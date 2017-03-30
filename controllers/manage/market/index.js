/**
 * @author Hao Sun
 * @date 20160818
 * @fileoverview 活动列表
 */

var api = require("../../../base/main"),
    moment = require("moment"),
    util = require("../../../utils");

const con = {
    'A': '商城-APP',
    'p': 'Plus-APP'
};

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/activity/listOne",
        modelName : ["Activity"],
        platform : false,
        date_picker: false,
        paging : [true],
        flexible_btn: [{
            content: '<a href="/#!/custom/saveActivity">新建活动</a>',
            preMethods: [],
            customMethods: ''
        }],
        params(query, params) {
            delete params.day_type;
            delete params.date;
            return params;
        },
        filter(data, query) {
            let page = query.page,
                limit = query.limit,
                source = data.first.data[0],
                count = data.first.count;

            for(let i = 0; i < source.length; i++) {
                source[i].top = (page - 1) * limit + i + 1;
                source[i].activity_start_time = moment(source[i].activity_start_time).format("YYYY-MM-DD");
                source[i].activity_end_time = moment(source[i].activity_end_time).format("YYYY-MM-DD");
                source[i].operating =
                    `<button class='btn btn-default' url_link='/custom/saveActivity' url_fixed_params='{"activity_id": "${source[i].activity_id}"}'>修改>></button>`;
            }

            return util.toTable([source], data.rows, data.cols, [count]);
        },
        rows: [
            ["top", "activity_type", "activity_id", "activity_name",
                "activity_start_time", "activity_end_time", "operating"]
        ],
        cols: [
            [{
                caption: "序号",
                type: "number"
            }, {
                caption: "活动类型",
                type: "string"
            }, {
                caption: "活动ID",
                type: "string"
            }, {
                caption: "活动名称",
                type: "string"
            }, {
                caption: "活动开始时间",
                type: "string"
            }, {
                caption: "活动结束时间",
                type: "string"
                //}, {
                //    caption: "活动备注",
                //    type: "string"
            }, {
                caption: "活动详情"
            }]
        ]
    });

    Router = Router.get("/custom/saveActivity", (req, res, next) => {
        var params = {
            activity_id : req.query.activity_id
        };
        req.models.Activity.find(params, (err, data) => {
            if(err) {
                res.json({
                    code : 400,
                    msg : "查询失败"
                });
            } else {
                req.models.ActivityChannelRelationship.find(params, (err, ships) => {
                    if(err) {
                        res.json({
                            code : 400,
                            msg : "查询失败"
                        });
                    } else {

                        var channel_idArr = [];
                        for(let item of ships){
                            channel_idArr.push(item.channel_id);
                        }

                        req.models.Channel.find({"channel_id":channel_idArr} , (err , result) => {
                            if(err){
                                res.json({
                                    code : 400,
                                    msg : "查询失败"
                                });
                                return;
                            }
                            var obj = {};
                            for(let item of result){
                                obj[item.channel_id] = item.channel_name;
                            }

                            for(let item of ships){
                                item.channel_name = obj[item.channel_id];
                            }
                            data[0].activity_channel_relationship = ships;
                            data[0].activity_start_time =
                                moment(data[0].activity_start_time).format("YYYY-MM-DD");
                            data[0].activity_end_time =
                                moment(data[0].activity_end_time).format("YYYY-MM-DD");

                            res.json({
                                code : 200,
                                data : data[0]
                            });
                        });

                    }
                });

            }
        });
    });

    Router = Router.post("/custom/saveActivity", (req, res, next) => {
        const body = JSON.parse(req.body.data),
            activity = {},
            relationship = body.activity_channel_relationship;

        for(let key in body) {
            if(key !== "activity_channel_relationship") {
                activity[key] = body[key];
            }
        }

        req.models.Activity.find({activity_id:activity.activity_id}, (err, activityData) => {
            if(err) {
                res.json({
                    code : 400,
                    msg : "活动查询失败"
                });
            } else if(activityData.length > 0) {

                //保存活动名称
                req.models.Activity.get(activity.activity_id , (err , data) => {
                    for(let key in activity) {
                        data[key] = activity[key]
                    }
                    data.update_time = new Date();
                    data.save();
                });

                req.models.ActivityChannelRelationship.create(relationship, (err, data) => {
                    if(err) {
                        res.json({
                            code : 400,
                            msg : "活动关系修改失败"
                        });
                    } else {
                        res.json({
                            code : 200
                        });
                    }
                });
            } else {
                activity.create_time = new Date();
                req.models.Activity.create(activity, (err, data) => {
                    if(err) {
                        res.json({
                            code : 400,
                            msg : "活动创建失败"
                        });
                    } else {
                        req.models.ActivityChannelRelationship.create(relationship, (err, data) => {
                            if(err) {
                                res.json({
                                    code : 400,
                                    msg : "活动关系修改失败2"
                                });
                            } else {
                                res.json({
                                    code : 200
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    Router = Router.get("/custom/channel", (req, res, next) => {
        req.models.Channel.find({}, [ "channel_id", "A" ], (err, data) => {
            if(err) {
                next(err);
            } else {
                res.json({
                    code : 200,
                    data : data
                });
            }
        });
    });

    Router = Router.post("/custom/channel", (req, res, next) => {
        let body = JSON.parse(req.body.data);

        if(Object.keys(body).length !== 6) {
            res.json({
                code : 400,
                msg : "所有项为必填项"
            });
        } else {
            body.channel_id = [body.channel_type_code, body.channel_code, body.channel_ex].join("");
            body.create_time = new Date();
            body.update_time = new Date();
            req.models.Channel.find({
                channel_id : body.channel_id
            }, (err, items) => {
                if(err) {
                    res.json({
                        code : 400,
                        msg : "创建失败"
                    });
                } else if(items.length > 0) {
                    res.json({
                        code : 400,
                        msg : "已经存在"
                    });
                } else {
                    req.models.Channel.create(body, (err,data) => {
                        if(err) {
                            res.json({
                                code : 400,
                                msg : "创建失败"
                            });
                        } else {
                            res.json({
                                code : 200,
                                data : data
                            });
                        }
                    });
                }
            });
        }
    });

    Router = Router.get("/custom/deleteChannel", (req, res, next) => {
        const channel_id = req.query.channel_id;
        req.models.Channel.find({
            channel_id
        }, (err, data) => {
            if(err) {
                res.json({
                    code : 400,
                    msg : "删除失败"
                });
            } else {
                if(data.length === 0) {
                    res.json({
                        code : 400,
                        msg : "删除信息不存在"
                    });
                } else {
                    data[0].remove((err) => {
                        if(err) {
                            res.json({
                                code : 400,
                                msg : "删除失败"
                            });
                        } else {
                            res.json({
                                code : 200,
                                msg : "删除成功"
                            });
                        }
                    })
                }
            }
        });
    });

    Router = Router.post("/custom/updateChannel", (req, res, next) => {
        const body = JSON.parse(req.body.data);
        req.models.Channel.find({
            channel_id : body.channel_id
        }, (err, data) => {
            if(err) {
                res.json({
                    code : 400,
                    msg : "修改失败"
                });
            } else {
                if(data.length === 0) {
                    res.json({
                        code : 400,
                        msg : "修改信息不存在"
                    });
                } else {
                    for(let key in body) {
                        data[0][key] = body[key];
                    }
                    data[0].channel_id = [body.channel_type_code, body.channel_code, body.channel_ex].join("");
                    data[0].save((err) => {
                        if(err) {
                            res.json({
                                code : 400,
                                msg : "修改失败"
                            });
                        } else {
                            res.json({
                                code : 200,
                                result : data[0],
                                msg : "修改成功"
                            });
                        }
                    })
                }
            }
        });
    });

    //渠道管理工具-列表
    Router = Router.get("/custom/channelUtils", (req, res, next) => {
        const sql = `select * from channel_util limit ?,?;`;
        const totalSql = `select count(*) count from channel_util`;
        const query = req.query;
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;
        req.models.db1.driver.execQuery(sql, [offset, +limit], (err, data) => {
            if(err) {
                // console.log(err);
                res.json({
                    code: 400,
                    msg: "查询失败"
                });
            } else {
                req.models.db1.driver.execQuery(totalSql, (e, d) => {
                    if(e) {
                        res.json({
                            code: 400,
                            msg: "查询失败"
                        });
                    } else {
                        const newData = data.map((x, i) => {
                            if(!x.code) {
                                x.site = x.channel_ext_name.substr(0, 1);
                                x.url = `http://shouji.gomeplus.com/kd/${x.channel_ext_name}.html`;
                            }
                            return x;
                        });
                        res.json({
                            code: 200,
                            msg: "查询成功",
                            data: newData,
                            count: d[0].count
                        });
                    }
                });
            }
        });
    });

    //渠道管理工具-添加
    Router = Router.post("/custom/channelUtilsAdd", (req, res, next) => {
        const body = req.body;
        const MaxCodeSql = `select * from channel_util order by code desc limit 0,1`;
        const insertSql = `insert into channel_util(
            site, 
            channel_name, 
            channel_ex_name,
            channel_ext_name,
            code,
            url) values(?, ?, ?, ?, ?, ?)`;
        const findSql = `select * from channel_util where channel_ext_name = ?`;
        req.models.db1.driver.execQuery(MaxCodeSql, (err, data) => {
            if(err) {
                returnErr(res, "添加失败");
            } else {
                let code;
                if(data.length) {
                    code = Code(data[0].code);
                } else {
                    code = "00001";
                }
                findCheck(req, findSql, code, (err, c) => {
                    if(err) {
                        returnErr(res, "添加失败");
                    } else {
                        req.models.db1.driver.execQuery(insertSql, [
                            body.site,
                            body.channel_name,
                            body.channel_ex_name,
                            body.site + c,
                            c,
                            `http://shouji.gomeplus.com/kd/${body.site + c}.html`
                        ], (e, d) => {
                            if(e) {
                                returnErr(res, "添加失败");
                            } else {
                                const find = `select * from channel_util where id=${d.insertId}`;
                                req.models.db1.driver.execQuery(find, (ee, dd) => {
                                    if(ee) {
                                        returnErr(res, "添加失败");
                                    } else {
                                        _log(
                                            req,
                                            res,
                                            [`渠道管理工具添加渠道:站点:${con[body.site]};一级渠道:${body.channel_name};二级渠道:${body.channel_ex_name};三级渠道:${body.site + c}`],
                                            "添加",
                                            dd[0]
                                        );
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    //渠道管理工具-修改
    Router = Router.post("/custom/channelUtilsUpdate", (req, res, next) => {
        let body = req.body;
        delete body.update;
        const a = [];
        const values = [];
        for(let key in body) {
            a.push(`${key}=?`);
            values.push(body[key]);
        }
        const sql = `update channel_util set ${a.join(",")} where id=${body.id}`;
        const findSql = `select * from channel_util where id = ${body.id}`;
        req.models.db1.driver.execQuery(findSql, (err, d) => {
            if(err) {
                returnErr(res, "修改失败");
            } else {
                req.models.db1.driver.execQuery(sql, values, (err, data) => {
                    if(err) {
                        returnErr(res, "修改失败");
                    } else {
                        const obj = d[0];
                        _log(
                            req,
                            res,
                            [`渠道管理工具:一级渠道:${obj.channel_name}修改成${body.channel_name};二级渠道:${obj.channel_ex_name}修改成${body.channel_ex_name}`],
                            "修改"
                        );
                    }
                });
            }
        });
    });

    //渠道管理工具-删除
    Router = Router.get("/custom/channelUtilsDelete", (req, res, next) => {
        const id = req.query.id;
        const sql = `delete from channel_util where id=?`;
        const findSql = `select * from channel_util where id=?`;
        req.models.db1.driver.execQuery(findSql, [id], (e, d) => {
            if(e) {
                returnErr(res, "删除失败");
            } else {
                req.models.db1.driver.execQuery(sql, [id], (err, data) => {
                    if(err) {
                        returnErr(res, "删除失败");
                    } else {
                        const obj = d[0];
                        _log(
                            req,
                            res,
                            [`渠道管理工具:站点:${con[obj.site]};一级渠道:${obj.channel_name};二级渠道:${obj.channel_ex_name};三级渠道:${obj.channel_ext_name}被删除`],
                            "删除"
                        );
                    }
                });
            }
        });
    });

    return Router;
};

function Code(code) {
    const num = (+code + 1).toString();
    const len = 5;
    let str = "";
    for(let i = num.length; i < len; i++) {
        str += "0";
    }
    return str + num;
}

function returnErr(res, msg) {
    res.json({
        code: 400,
        msg
    });
}

function check(req, sql, code, cb) {
    req.models.db1.driver.execQuery(sql, [code], (err, data) => {
        if(err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

function findCheck(req, sql, code, cb) {
    check(req, sql, code, (err, data) => {
        let c = code;
        if(err) {
            cb(err);
        } else {
            if(data.length) {
                c = Code(code);
                findCheck(req, sql, c, cb);
            } else {
                cb(null, c);
            }
        }
    });
}

function _log(req, res, content, msg, data) {
    var log = {
        username : req.session.userInfo.username,
        date : new Date().getTime(),
        ip : util.getClientIp(req),
        content : content.join(";")
    };
    req.models.Log.create(log, (err, da) => {
        if(!err) {
            res.json({
                code : 200,
                success : true,
                msg : `${msg}成功`,
                data
            })
        } else {
            res.json({
                code : 400,
                success : false,
                msg : `${msg}失败`
            })
        }
    });
}