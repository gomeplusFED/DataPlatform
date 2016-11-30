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

//write the config_add.json
const WriteConfig = (obj) => {
    let str = JSON.stringify(obj , null , 2);
    //写入config_add.json文件
    fs.writeFileSync(path.join(__dirname, "../config_add.json"), str , "utf8");
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

    Router.get("/getConfig" , (req , res , next) => {
        if(!Check(req)){
            res.send(Str);
            return;
        }

        res.json(ConfigAdd);
    });


    

    return Router;
}