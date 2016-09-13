/**
 * @author Hao Sun
 * @date 20160818
 * @fileoverview 活动列表
 */

var api = require("../../../base/main"),
    moment = require("moment"),
    util = require("../../../utils");

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
        req.models.Channel.find({}, (err, data) => {
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
    });

    return Router;
};