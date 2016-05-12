/**
 * @author yanglei
 * @date 20160503
 * @fileoverview 角色管理
 */
module.exports = (Router) => {
    Router.get("/role/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 30,
            page = query.page || 1,
            status = query.status,
            sql = "SELECT * FROM tbl_dataplatform_nodejs_role";
        if(status) {
            sql += " WHERE status=" + status;
        }
        sql += " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.Role.count({}, (err, count) => {
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

    Router.post("/role/update", (req, res, next) => {
        var body = req.body;
        if(body.name) {
           _uniq(req, body, (err, roles) => {
                if(!err) {
                    if(roles.length > 0) {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "角色名称重复"
                        });
                    } else {
                        req.models.Role.find({
                            id : body.id
                        }, (err, data) => {
                            if(!err) {
                                if(data.length) {
                                    data[0].name = body.name || data[0].name;
                                    data[0].limited = body.limited || data[0].limited;
                                    data[0].export = body.export || data[0].export;
                                    data[0].status = body.status || data[0].status;
                                    data[0].remark = body.remark || data[0].remark;
                                    data[0].save((err) => {
                                        if(!err) {
                                            res.json({
                                                code : 200,
                                                success : true,
                                                msg : "修改成功"
                                            });
                                        } else {
                                            res.json({
                                                code : 400,
                                                success : false,
                                                msg : "修改失败"
                                            });
                                        }
                                    });
                                } else {
                                    res.json({
                                        code : 400,
                                        success : false,
                                        msg : "无该角色，无法修改"
                                    });
                                }
                            } else {
                                res.json({
                                    code : 400,
                                    success : false,
                                    msg : "修改角色失败"
                                });
                            }
                        });
                    }
                } else {
                    res.json({
                        code : 400,
                        success : false,
                        msg : "修改角色失败"
                    });
                }
           })
        }

    });

    Router.post("/role/add", (req, res, next) => {
        var body = req.body,
            params = {
                name : body.name,
                date : new Date().getTime(),
                limited : body.limited || "{}",
                export : body.export | "{}",
                status : 1,
                remark : body.remark
            };
        if(body.name) {
            _uniq(req, params, (err, data) => {
                if(!err) {
                    if(data.length > 0) {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "角色名称重复"
                        })
                    } else {
                        req.models.Role.create(params, (err, data) => {
                            if(!err) {
                                res.json({
                                    code : 200,
                                    success : true,
                                    msg : "添加角色成功"
                                })
                            } else {
                                res.json({
                                    code : 400,
                                    success : false,
                                    msg : "添加角色失败"
                                });
                            }
                        })
                    }
                } else {
                    res.json({
                        code : 400,
                        success : false,
                        msg : "添加角色失败"
                    })
                }
            })
        } else {
            res.json({
                code : 400,
                success : false,
                msg : "缺少名称"
            })
        }

    });

    function _uniq(req, params, cb) {
        req.models.Role.find({
            name : params.name
        }, (err, data) => {
            if(err) {
                cb(err);
            } else {
                cb(null, data);
            }
        })
    }

    return Router;
};