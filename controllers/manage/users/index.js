/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */
var orm = require("orm"),
    util = require("../../../utils");

module.exports = (Router) => {
    Router.get("/users/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 10,
            username = query.username || "",
            page = query.page || 1,
            count = "SELECT count(1) FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin < 50  AND"
                + " username like '%" + username + "%' OR role like '%" +  username + "%'",
            sql = "SELECT * FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin < 50 AND"
                + " username like '%" + username + "%' OR role like '%" +  username + "%'"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.db.driver.execQuery(count, (err, count) => {
            if(!err) {
                req.db.driver.execQuery(sql, (err, data) => {
                        if(!err) {
                            res.json({
                                code : 200,
                                count : count[0]["count(1)"],
                                data : data
                            });
                        } else {
                            next(err);
                        }
                    });
            } else {
                next(err)
            }
        });
    });

    Router.post("/users/update", (req, res, next) => {
        var params = req.body,
            content = [];
        req.models.User2.find({
            id : params.id
        }, (err, data) => {
            if(!err) {
                if(data.length) {
                    data[0].status = params.status || data[0].status;
                    data[0].role = params.role !== "undefined" ? params.role : data[0].role;
                    data[0].remark = params.remark !== "undefined" ? params.remark : data[0].remark;
                    data[0].limited = params.limited || data[0].limited;
                    data[0].export = params.export || data[0].export;
                    var username = data[0].username;
                    if(params.export) {
                        content.push(username + "被给予下载权限");
                    }
                    if(params.status === "1") {
                        content.push(username + "被启用");
                    } else if(params.status === "0") {
                        content.push(username + "被禁用");
                    }
                    if(params.role) {
                        content.push("修改" + username + "角色为" + params.role);
                    }
                    if(params.limited) {
                        content.push(username + "被授予权限");
                    }
                    if(params.remark === "") {
                        content.push(username + "的备注被清空");
                    } else if(params.remark !== "" && params.remark) {
                        content.push(username + "被修改备注");
                    }
                    _save();
                } else {
                    res.json({
                        code : 400,
                        success : false,
                        msg : "无该用户,无法修改"
                    })
                }
            } else {
                res.json({
                    code : 400,
                    success : false,
                    msg : "查询错误"
                })
            }
            function _log() {
                var log = {
                    username : req.session.userInfo.username,
                    date : new Date().getTime(),
                    ip : util.getClientIp(req),
                    content : content.join(";")
                };
                req.models.Log.create(log, (err, data) => {
                    if(!err) {
                        res.json({
                            code : 200,
                            success : true,
                            msg : "修改成功"
                        })
                    } else {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "修改失败"
                        })
                    }
                });
            }
            function _save() {
                data[0].save((err) => {
                    if(!err) {
                        _log();
                    } else {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "修改失败"
                        })
                    }
                })
            }
        });
    });

     return Router;
};