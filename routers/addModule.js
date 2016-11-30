/**
 * @author Mr.He
 * @date 20161021
 * @fileoverview 自动添加模块路由配置
 */

let reg = /[^a-z]/i;
let fs = require("fs");
let path=require("path");
// let Config = require("../config/");
let ConfigAdd = require("../config/config_add");
let ConfigApi = require("../config/");
const moment = require("moment");

//write the config_add.json
const WriteConfig = (obj , callback) => {
    let str = JSON.stringify(obj , null , 2);
    //写入config_add.json文件
    fs.writeFile(path.join(__dirname, "../config_add.json"), str , (err)=>{
        if(err) throw err;
        return callback && callback();
    });
}



let Usersname = [ "hexisen" , "yanglei"];
let Str = `无权限&nbsp;&nbsp;<a href="/">首页</a>`;
let Check = (req) => {
    if(Usersname.includes(req.session.userInfo.username)){
        return true;
    }else{
        return false;
    }
}

module.exports = (Router) => {

    Router.get("/addModule" , (req , res , next) => {
        if(!Check(req)){
            res.send(Str);
            return;
        }

        res.render("include/addModule" , {
            pageTitle : "自动添加模块"
        });
    });

    //获取配置文件
    Router.get("/getConfig" , (req , res , next) => {
        if(!Check(req)){
            res.send(Str);
            return;
        }

        res.json(ConfigAdd);
    });

    //大模块添加、修改操作
    Router.post("/addBigModule" , (req , res , next) => {
        if(!Check(req)){
            res.send(Str);
            return;
        }

        let data = req.body,
            error= false;
        if(data.type == "change" && data.name && data.id){
            //change module name.
            data.id = data.id / 1;
            if(data.id && typeof data.id == 'number'){
                ConfigAdd[data.id].name = data.name;
                ConfigApi.writeIn(ConfigAdd , () => {
                    res.json({
                        state : 1,
                        msg   : "change Success"
                    });
                });
            }else{
                error = true;
            }
        }else if(data.type == "add" && data.name){
            //add module.

        }


        if(error){
            res.json({
                state : 0,
                msg   : "参数错误"
            });
        }
        
    });
    

    return Router;
}