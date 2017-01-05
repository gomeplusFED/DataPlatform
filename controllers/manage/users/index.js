/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */
var orm = require("orm"),
    config = require("../../../config/config").limit,
    _ = require("lodash"),
    util = require("../../../utils");

module.exports = (Router) => {
    Router.get("/users/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 10,
            username = query.username || "",
            page = query.page || 1,
            count = "SELECT count(1) FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin<99 AND"
                + " (username like '%" + username + "%' OR role like '%" +  username + "%')",
            sql = "SELECT * FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin<99 AND"
                + " (username like '%" + username + "%' OR role like '%" +  username + "%')"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.db1.driver.execQuery(count, (err, count) => {
            if(!err) {
                req.models.db1.driver.execQuery(sql, (err, data) => {
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
                    var username = data[0].username;
                    if(data[0].status === 1) {
                        if(params.status === "0") {
                            content.push(username + "被禁用");
                        }
                    } else {
                        if(params.status === "1") {
                            content.push(username + "被启用");
                        }
                    }
                    if(params.role) {
                        if(params.role !== data[0].role) {
                            if(params.role) {
                                content.push("修改" + username + "角色为" + params.role);
                            } else {
                                content.push(username + "角色被清空了");
                            }
                        }
                    }

                    if(params.limited) {
                        let l = JSON.parse(params.limited);
                        let u = JSON.parse(data[0].limited);
                        if(req.session.userInfo.username !== "superAdmin") {
                            if(u && (!u[0])) {
                                if(l["0"]) {
                                    delete l["0"];
                                }
                            }
                        }
                        params.limited = JSON.stringify(l);
                        if(params.limited !== data[0].limited) {
                            content.push(username + "权限被修改");
                        }
                    }
                    if(params.export) {
                        if(params.export !== data[0].export) {
                            content.push(username + "下载权限被修改");
                        }
                    }
                    if(data[0].remark) {
                        if(params.remark !== data[0].remark) {
                            if(params.remark) {
                                content.push(username + "被修改备注");
                            } else {
                                content.push(username + "备注被清空了");
                            }
                        }
                    } else {
                        if(params.remark) {
                            content.push(username + "被修改备注");
                        }
                    }
                    if(params.type) {
                        if(params.type !== data[0].type) {
                            content.push(username + "平台权限被修改");
                        }
                    }
                    if(params.sub_pages) {
                        if(params.sub_pages !== data[0].sub_pages) {
                            content.push(username + "三级页面权限被修改");
                        }
                    }

                    data[0].status = params.status || data[0].status;
                    data[0].role = params.role !== undefined ? params.role : data[0].role;
                    data[0].remark = params.remark !== undefined ? params.remark : data[0].remark;
                    data[0].limited = params.limited || data[0].limited;
                    data[0].export = params.export || data[0].export;
                    data[0].type = params.type || data[0].type;
                    data[0].sub_pages = params.sub_pages || data[0].sub_pages;
                    if(content.length > 0) {
                        _save();
                    } else {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "请修改后再提交"
                        })
                    }
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

    Router.get("/users/download", (req, res, next) => {
        const xl = require("excel4node");
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet("用户权限");
        const wss = wb.addWorksheet("权限");
        let obj = {};
        let NewData = [];
        for(let key in config) {
            if(config[key].display) {
                obj[key] = {
                    id : key,
                    name : config[key].name,
                    cell : {}
                };
                config[key].path.forEach((item, index) => {
                    NewData.push({
                        one : config[key].name,
                        o : key,
                        two : item.name,
                        t : index
                    });
                    obj[key].cell[index] = item.name;
                });
            }
        }

        util.export(wss, util.arrayToArray([{
            cols : [{caption : "一级页面"},{caption : "一级id"},{caption : "二级页面"},{caption:"二级id"}],
            rows : ["one", "o", "two", "t"],
            data : NewData
        }]));
        req.models.User2.find({
            is_admin : orm.lt(99),
            status : 1
        }, (err, data) => {
            if(err) {
                return next(err);
            }
            let arr = [];
            for(let key of data) {
                const name = key.name || "";
                const username = key.username || "";
                const email = key.email || "";
                const department = key.department || "";
                const role = key.role || "";
                const remark = key.remark || "";
                const limited = JSON.parse(key.limited);
                const exports = JSON.parse(key.export);
                const list = _.uniq(Object.keys(limited).concat(Object.keys(exports)));
                if(list.length === 0) {
                    arr.push({
                        name,
                        username,
                        email,
                        department,
                        role,
                        remark,
                        one : "",
                        id : "",
                        two : "",
                        three : ""
                    });
                } else {
                    for(let k of list) {
                        if(k != "16") {
                            if(limited[k] && exports[k]) {
                                const l = _.uniq(limited[k].concat(exports[k]));
                                for(let j of l) {
                                    const o = {
                                        name,
                                        username,
                                        email,
                                        department,
                                        role,
                                        remark,
                                        one : obj[k].name,
                                        id : k,
                                        two : "",
                                        three : ""
                                    };
                                    if(limited[k].indexOf(j) !== -1) {
                                        o.two = obj[k].cell[j] || "";
                                    }
                                    if(exports[k].indexOf(j) !== -1) {
                                        o.three = obj[k].cell[j] || "";
                                    }
                                    arr.push(o);
                                }
                                //if(limited[k].length >= exports[k].length) {
                                //    limited[k].forEach((item, index) => {
                                //        arr.push({
                                //            name,
                                //            username,
                                //            email,
                                //            department,
                                //            role,
                                //            remark,
                                //            one : obj[k].name,
                                //            id : k,
                                //            two : obj[k].cell[item] || "",
                                //            three : obj[k].cell[exports[index]] || ""
                                //        });
                                //    });
                                //} else {
                                //    exports[k].forEach((item, index) => {
                                //        arr.push({
                                //            name,
                                //            username,
                                //            email,
                                //            department,
                                //            role,
                                //            remark,
                                //            one : obj[k].name,
                                //            id : k,
                                //            two : obj[k].cell[limited[index]] || "",
                                //            three : obj[k].cell[item] || ""
                                //        });
                                //    });
                                //}
                            } else if(limited[k]) {
                                limited[k].forEach((item, index) => {
                                    arr.push({
                                        name,
                                        username,
                                        email,
                                        department,
                                        role,
                                        remark,
                                        one : obj[k].name,
                                        id : k,
                                        two : obj[k].cell[item] || "",
                                        three : ""
                                    });
                                });
                            } else if(exports[k]) {
                                exports[k].forEach((item, index) => {
                                    arr.push({
                                        name,
                                        username,
                                        email,
                                        department,
                                        role,
                                        remark,
                                        one : obj[k].name,
                                        id : k,
                                        two : "",
                                        three : obj[k].cell[item] || ""
                                    });
                                });
                            }
                        }
                    }
                }
            }
            const newData = util.arrayToArray([{
                cols : [{caption : "姓名"},
                    {caption : "账户名"},
                    {caption : "邮箱"},
                    {caption : "部门"},
                    {caption : "角色"},
                    {caption : "备注"},
                    {caption : "一级页面"},
                    {caption : "一级ID"},
                    {caption : "菜单权限"},
                    {caption : "下载权限"}],
                rows : ["name", "username", "email", "department", "role", "remark", "one", "id", "two", "three"],
                data : arr
            }]);
            util.export(ws, newData);
            wb.write("report.xlsx", res);
        });
    });

    Router.get("/users/delete", (req, res, next) => {
        var params = req.query;
        req.models.User2.find({
            id : params.id
        }, (err, data) => {
            if(!err) {
                if(data.length) {
                    data[0].status = 0;
                    data[0].is_admin = 250;
                    data[0].save((err) => {
                        if(!err) {
                            var log = {
                                username : req.session.userInfo.username,
                                date : new Date().getTime(),
                                ip : util.getClientIp(req),
                                content : `${data[0].username}被删除`
                            };
                            req.models.Log.create(log, (err, data) => {
                                if(!err) {
                                    res.json({
                                        code : 200,
                                        success : true,
                                        msg : "删除成功"
                                    })
                                } else {
                                    res.json({
                                        code : 400,
                                        success : false,
                                        msg : "删除失败"
                                    })
                                }
                            });
                        } else {
                            res.json({
                                code : 400,
                                success : false,
                                msg : "删除失败"
                            });
                        }
                    });
                } else {
                    res.json({
                        code : 400,
                        success : false,
                        msg : "无该用户，无法删除"
                    });
                }
            } else {
                res.json({
                    code : 400,
                    success : false,
                    msg : "删除失败"
                });
            }
        });
    });

     return Router;
};