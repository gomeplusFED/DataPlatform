/**
 * @author Hao Sun
 * @date 20160818
 * @fileoverview 活动列表
 */

var api = require("../../../base/main"),
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
        const params = {
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
                        data[0].activity_channel_relationship = ships;
                        res.json({
                            code : 200,
                            data : data[0]
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

        req.models.Activity.find(activity, (err, data) => {
            if(err) {
                res.json({
                    code : 400,
                    msg : "创建失败"
                });
            } else if(data.length > 0) {
                req.models.ActivityChannelRelationship.create(relationship, (err, data) => {
                    if(err) {
                        res.json({
                            code : 400,
                            msg : "创建失败"
                        });
                    } else {
                        res.json({
                            code : 200
                        });
                    }
                });
            } else {
                req.models.Activity.create(activity, (err, data) => {
                    if(err) {
                        res.json({
                            code : 400,
                            msg : "创建失败"
                        });
                    } else {
                        req.models.ActivityChannelRelationship.create(relationship, (err, data) => {
                            if(err) {
                                res.json({
                                    code : 400,
                                    msg : "创建失败"
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
        const query = req.query,
            offset = (query.page - 1) * query.limit,
            limit = query.limit;
        req.models.Channel.find({}).offset(offset).limit(limit).run((err, data) => {
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
        const body = JSON.parse(req.body.data);
        req.models.Channel.create(body, (err, data) => {
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
    });

    return Router;
};