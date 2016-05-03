/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */
var orm = require("orm");

module.exports = (Router) => {
    Router.get("/users/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 10,
            username = query.username || "",
            page = query.page || 1,
            params = {
                username : orm.like("%" + username + "%")
            },
            sql = "SELECT * FROM tbl_dataplatform_nodejs_users2"
                + " WHERE username like '%" + username + "%"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.User2.count(params, (err, count) => {
            if(!err) {
                req.db.driver.execQuery(sql, (err, data) => {
                        if(!err) {
                            res.json({
                                code : 200,
                                count : count,
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
        var params = req.body;
        req.models.User2.find({
            id : params.id
        }, (err, data) => {
            if(!err) {
                if(data.length) {
                    data[0].status = params.status || data[0].status;
                    data[0].role = params.role || data[0].role;
                    data[0].remark = params.remark || data[0].remark;
                    data[0].limited = params.limited || data[0].limited;
                    data[0].export = params.export || data[0].export;
                    //if(params.limited) {
                    //    var limited = eval('(' + data[0].limited + ')');
                    //    params.limited = eval('(' + params.limited + ')');
                    //    Object.keys(params.limited).forEach((key) => {
                    //        var limit = params.limited[key].concat(limited[key]);
                    //        limited[key] = util.uniq(limit).sort((a, b) => {
                    //            return a - b;
                    //        });
                    //    });
                    //    data[0].limited = JSON.stringify(limited);
                    //}
                    data[0].save((err) => {
                        if(!err) {
                            req.session.userInfo = data[0];
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
                    })
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
        });
    });

     return Router;
};