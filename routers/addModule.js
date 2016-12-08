/**
 * @author Mr.He
 * @date 20161021
 * @fileoverview 自动添加模块路由配置
 */

const fs = require("fs");
const path=require("path");
const ConfigApi = require("../config/");

/* 有权限修改的用户 */
let Usersname = [ "hexisen" , "yanglei" ];

module.exports = (Router) => {

    /* 权限验证 */
    Router.get("/mapi/*" , (req , res , next) => {
        if(Usersname.includes(req.session.userInfo.username)){
            next();
        }else{
            res.send(`无权限&nbsp;&nbsp;<a href="/">首页</a>`);
        }
    });

    Router.get("/mapi/index" , (req , res , next) => {
        res.render("include/addModule" , {
            pageTitle : "自动添加模块"
        });
    });

    //获取配置文件
    Router.get("/mapi/getConfig" , (req , res , next) => {
        res.json(ConfigApi.getConfig());
    });

    //大模块添加、修改操作
    Router.post("/mapi/addBigModule" , (req , res , next) => {
        let data = req.body,
            error= false;
        if(data.type == "change" && data.name && data.id){
            //change module name.
            data.id = data.id / 1;
            if(data.id && typeof data.id == 'number'){
                ConfigApi.getConfig()[data.id].name = data.name;
                ConfigApi.writeIn(() => {
                    res.json({
                        state : 1,
                        msg   : "change Success"
                    });
                });
            }else{
                error = true;
            }
        }else if(data.type == "add" && data.name && data.filename){
            //add module.
            let num = ConfigApi.addOne(data.name , data.filename);
            if(num){
                res.json({
                    state : 1,
                    data  : {
                        id : num
                    },
                    msg   : "add Success"
                });
            }else{
                error = true;
            }
            
        }else{
            error = true;
        }

        if(error){
            res.json({
                state : 0,
                msg   : "参数错误"
            });
        }
    });
    
    //子模块添加、修改操作
    Router.post("/mapi/addSonModule" , (req , res , next) => {
        let data = req.body,  
            error = false;

        if(data.id && data.P_R && data.type == "add" && data.sonName && data.path){
            ConfigApi.sonChange(data);
        }else if(data.id && data.P_R && data.type == "change" && data.sonName && data.path && data.index){
            ConfigApi.sonChange(data);
        }else{
            res.json({
                state : 0,
                msg   : "参数错误"
            });
            return;
        }

        res.json({
            state : 1,
            msg   : "子模块修改成功"
        });
    });

    //获取apiConfig配置信息
    Router.get("/mapi/apiConfig" , (req , res , next) => {
        if(!req.query.filename || !req.query.mark){
            res.json({
                state : 0,
                msg   : "参数错误"
            });
            return;
        }

        let Json = require(path.join(__dirname , "../config/apiConfig" , req.query.filename));
        let Data = Json[req.query.mark];
        console.log(123 , typeof Data.filter);
        if(Data){
            res.json({
                "state" : 1,
                "msg"   : "ok",
                "result": Data
            });
        }else{
            res.json({
                "state" : 0,
                "msg"   : "数据没有找到"
            });
        }            
    });

    //修改apiConfig配置信息
    Router.post("/mapi/setApi" , (req , res  , next) => {
        let data = JSON.parse(req.body.data);

        //change config_add.json
        ConfigApi.apiChange(data);
        //change api config
        let Json = require(path.join(__dirname , "../config/apiConfig" , data.Position.filename));
        data.ApiConfig.router = data.Api3.query_api;
        Json[data.Api3.mark] = data.ApiConfig;

        let source = fs.createWriteStream(path.join(__dirname , "../config/apiConfig" , data.Position.filename + ".json"));
        source.write(JSON.stringify(Json , null , 4));
        source.end((err)=>{
            if(err){
                next(err);
            }else{
                res.json({
                    state : 1,
                    msg   : "ok"
                });
            }
        });
    });


    return Router;
}