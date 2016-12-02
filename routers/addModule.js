/**
 * @author Mr.He
 * @date 20161021
 * @fileoverview 自动添加模块路由配置
 */

const ConfigApi = require("../config/");

/* 有权限修改的用户 */
let Usersname = [ "hexisen" , "yanglei" , "wangzhibo" ];

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
        }else if(data.type == "add" && data.name){
            //add module.
            let num = ConfigApi.addOne(data.name);
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

    return Router;
}