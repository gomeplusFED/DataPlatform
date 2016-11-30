/**
 * @author Mr.He
 * @date 20161021
 * @fileoverview 自动添加模块路由配置
 */

let reg = /[^a-z]/i;
let fs = require("fs");
let path=require("path");
let Config = require("../config");
let ConfigAdd = require("../config_add");
const moment = require("moment");
const deletePassword = "Mr.He";

//write the config_add.json
const WriteConfig = (obj) => {
    let str = JSON.stringify(obj , null , 2);
    //写入config_add.json文件
    fs.writeFileSync(path.join(__dirname, "../config_add.json"), str , "utf8");
}


let content = `/**
 * @author Mr.He
 * @date ${moment(new Date()).format("YYYY-MM-DD")}
 * @fileoverview
 */`;


module.exports = (Router) => {

    Router.get("/addModule" , (req , res , next) => {
        res.render("include/addModule" , {
            pageTitle : "自动添加模块"
        });
    });

    //增加左侧模块
    Router.get("/addModulefile" , (req , res , next) => {
        let foldname = req.query.foldname;
        if(!foldname || !req.query.name){
            res.json({
                state: 0,
                msg  : "创建模块参数不全"
            });
            return;
        }else if(reg.test(foldname)){
            res.json({
                state: 0,
                msg  : "文件夹名必须为字母"
            });
            return;
        }

        if(fs.existsSync(path.join(__dirname , "../controllers/manage" , foldname)) || fs.existsSync(path.join(__dirname , "../filters" , foldname))){
            res.json({
                state : 0,
                msg   : "文件名已经存在，请重新输入"
            });
            return;
        }

        //创建写入config的对象
        let obj = {
            "name" : req.query.name,
            "display":true,
            "className":"fa  fa-laptop fa-fw",
            "href":"#",
            "path":[],
            "routers":[],
            "foldname":foldname
        }

        let i = 0;
        while(i in Config.limit){
            i++;
        }
        ConfigAdd[i] = obj;

        WriteConfig(ConfigAdd);
        
        //创建文件夹
        fs.mkdirSync(path.join(__dirname , "../controllers/manage" , foldname));
        fs.mkdirSync(path.join(__dirname , "../filters" , foldname));

        res.json({
            "state" : 1,
            "data"  : {
                "number" : i,
                "foldname": foldname
            }
        });
    });

    //删除左侧模块
    Router.get("/deleModule" , (req , res , next) => {
        if(req.query.password != deletePassword){
            res.json({
                state : 0,
                msg   : "密码不正确"
            });
            return;
        }

        if(!ConfigAdd[req.query.id]){
            res.json({
                state : 0,
                msg   : "这不是自动创建的模块"
            });
            return;
        }

        let foldname = ConfigAdd[req.query.id].foldname;
        if(!fs.existsSync(path.join(__dirname , "../controllers/manage" , foldname)) || !fs.existsSync(path.join(__dirname , "../filters" , foldname))){
            res.json({
                state : 0,
                msg   : "文件夹不存在"
            });
            return;
        }

        //do the job.
        fs.rmdirSync(path.join(__dirname , "../controllers/manage" , foldname));
        fs.rmdirSync(path.join(__dirname , "../filters" , foldname));
        delete ConfigAdd[req.query.id];

        WriteConfig(ConfigAdd);

        res.json({
            state : 1,
            msg   : "该模块已经删除"
        });
    });

    //增加左侧子模块
    Router.get("/addSonModule" , (req , res , next) => {
        let obj = ConfigAdd[req.query.id];
        if(!obj){
            res.json({
                state : 0,
                msg   : "模块id不正确"
            });
            return;
        }

        if(!req.query.name || !req.query.filename){
            res.json({
                state : 0,
                msg   : "创建参数不全"
            });
            return;
        }

        let foldname = obj.foldname;
        let names    = req.query.filename + ".js";
        let paths     = path.join(__dirname , "../controllers/manage/" , foldname , names);
        let fpath    = path.join(__dirname , "../filters/" , foldname , "f_"+names);

        //创建文件
        if(fs.existsSync(paths) || fs.existsSync(fpath)){
            res.json({
                state : 0,
                msg   : "文件已经存在"
            });
            return;
        }

        fs.writeFileSync(paths, content);
        fs.writeFileSync(fpath, content);

        //修改config_add.json文件
        let data = {
            "name" : req.query.name,
            "path" : path.join("/",foldname,req.query.filename),
            "display":true,
            defaultData:[]
        }

        if(req.query.type == "routers"){
            obj.routers.push(data);
        }else{
            obj.path.push(data);
        }

        WriteConfig(ConfigAdd);

        res.json({
            state : 1,
            msg   : "文件创建"
        });
    });


    //add api
    Router.get("/addApi" , (req , res , next) => {

    });

    return Router;
}