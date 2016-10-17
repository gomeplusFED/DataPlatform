/**
 * @author yanglei
 * @date 2016-10-17
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    filter = require("../../../filters/channelAnalysis/apkOperating"),
    orm = require("orm");

module.exports = (Router) => {

    Router = new main(Router,{
        router : "/channelAnalysis/apkOperatingOne",
        modelName : ["ChaChalistApkChannel", "ChaApkKeepChannel"],
        platform : false,
        date_picker : false,
        params(query) {
            let date = new Date(),
                start = new Date(date - 30 * 24 * 60 * 60 * 1000),
                end = new Date(date - 24 * 60 * 60 * 1000);

            let params = {
                day_type : 1,
                channel_id : query.channel_id,
                date : orm.between(start, end)
            };

            return params;
        },
        secondParams(query) {
            return {
                channel_id : query.channel_id,
                day_type : 1,
                date : new Date(new Date() - 24 * 60 * 60 * 1000)
            };
        },
        procedure : [
            {
                find : "params",
                order : ["-date"],
                run : ""
            }, false
        ],
        filter(data, query, dates, type) {
            return filter.apkOperatingOne(data);
        },
        rows : [
            ["one", "two", "three"]
        ],
        cols : [
            [
                {
                    caption : "昨日活跃"
                },{
                    caption : "过去7日活跃"
                },{
                    caption : "过去30日活跃"
                }
            ]
        ]
    });

    Router = new main(Router,{
        router : "/channelAnalysis/apkOperatingTwo",
        modelName : ["ChaChalistApkChannel", "ChaApkKeepChannel", "Channel"],
        platform : false,
        params(query, params) {
            params.channel_id = params.channel_id.split(",");

            return params;
        },
        secondParams(query, params) {
            params.keep_type = "k1";

            return params;
        },
        thirdParams(query) {
            return {
                channel_id : query.channel_id.split(",")
            };
        },
        selectFilter(req, cb) {
            let groups = [];
            let _obj = {};
            req.models.db1.driver.execQuery(`SELECT * FROM channel`, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        if(_obj[item.channel_type_code]) {
                            _obj[item.channel_type_code].options.push({
                                text : item.channel_name,
                                value : item.channel_id
                            });
                        } else {
                            _obj[item.channel_type_code] = {
                                text : item.channel_type,
                                value : item.channel_type_code,
                                options : [{
                                    text : item.channel_name,
                                    value : item.channel_id
                                }]
                            };
                        }
                    }
                    for(let key in _obj) {
                        groups.push(_obj[key]);
                    }
                    this.flexible_btn = [{
                        content: '<a href="javascript:void(0)">对比渠道</a>',
                        preMethods: ['show_filter'],
                        customMethods: '',
                        max: 5,
                        key: 'channel_id',
                        groups: groups
                    }];
                    cb(null, [{
                        title: '指标',
                        filter_key : 'filter_key',
                        groups: [{
                            key: 'new_users',
                            value: '新增用户'
                        }, {
                            key: 'new_accounts',
                            value: '新增账户'
                        }, {
                            key: 'active_users',
                            value: '活跃用户'
                        }, {
                            key: 'start_num',
                            value: '启动次数'
                        }, {
                            key: 'rate',
                            value: '次日留存率'
                        }]
                    }]);
                }
            });
        },
        filter(data, query, dates, type) {
            return filter.apkOperatingTwo(data, query.filter_key, dates);
        }
    });

    Router = new main(Router,{
        router : "/channelAnalysis/apkOperatingThree",
        modelName : ["ChaChalistApkChannel", "ChaApkKeepChannel"],
        platform : false,
        paging : [true, false],
        excel_export : true,
        order : ["-date"],
        secondParams(query, params) {
            params.keep_type = "k1";

            return params;
        },
        procedure : [false, {
            find : "params",
            run : ""
        }],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates, type) {
            return filter.apkOperatingThree(data);
        },
        rows : [
            ["date", "new_users", "new_accounts", "active_users", "start_num", "avg_use_timeout",
                "rate", "pay_rate"]
        ],
        cols : [
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "新增用户",
                    type : "number",
                    help : ""
                },{
                    caption : "新增账户",
                    type : "number",
                    help : ""
                },{
                    caption : "活跃用户",
                    type : "number",
                    help : ""
                },{
                    caption : "启动次数",
                    type : "number",
                    help : ""
                },{
                    caption : "单次使用时长",
                    type : "number",
                    help : ""
                },{
                    caption : "次日留存率",
                    type : "string",
                    help : ""
                },{
                    caption : "付费率",
                    type : "string",
                    help : ""
                }
            ]
        ]
    });

    return Router;
};