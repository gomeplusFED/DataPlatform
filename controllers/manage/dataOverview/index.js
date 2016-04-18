/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../../base/api"),
    moment = require("moment"),
    util = require("../../../utils"),
    orm = require("orm"),
    dataOverview = require("../../../filters/dataOverview");

module.exports = (Router) => {
    var now = new Date(),
        ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
        qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllOne",
        modelName: ['OverviewPlatf', "KpiValue"],
        date_picker : false,
        platform : false,
        params : {
            date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            region : "ALL",
            day_type : 1
        },
        orderParams : {
            date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllOne(data, "H5");
        },
        rows : [
            ['name', 'open_total', 'open_user_total', 'open_user_avg', 'new_user',
                'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg',
                "pv", "create"]
        ],
        cols : [
            [{
                caption: ' ',
                type: 'string'
            }, {
                caption: '启动次数',
                type: 'number'
            },  {
                caption: '启动用户',
                type: 'number'
            },  {
                caption: '人均启动次数',
                type: 'string'
            }, {
                caption: '新用户',
                type: 'number'
            }, {
                caption: '新用户占比',
                type: 'string'
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '注册转化率',
                type: 'string'
            }, {
                caption: '每人使用时长',
                type: 'string'
            }, {
                caption: '每次使用时长',
                type: 'string'
            }, {
                caption: '累计访问用户数',
                type: 'string'
            }, {
                caption: '累计注册用户数',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllTwo",
        modelName: ["OverviewPlatf"],
        platform : false,
        fixedParams : {
            region : "ALL"
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'open_user_total',
                value: '启动用户'
            }, {
                key: 'open_total',
                value: '启动次数'
            }, {
                key: 'new_user',
                value: '新用户'
            }, {
                key: 'new_account',
                value: '新增账户'
            }, {
                key: 'register_rate',
                value: '注册转化率'
            }, {
                key: 'using_time_avg',
                value: '每次使用时长'
            }]
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllTwo(
                data,
                filter_key,
                {
                    open_user_total : "启动用户",
                    open_total : "启动次数",
                    new_user : "新用户",
                    new_account : "新增账户",
                    register_rate : "注册转化率",
                    using_time_avg : "每次使用时长"
                },
                dates,
                "H5"
            );
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllThree",
        modelName: ["OverviewPlatf"],
        platform : false,
        date_picker : false,
        params : {
            date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        //flexible_btn: [{
        //    content: '<a href="www.baidu.com" target="_blank">查看全部</a>',
        //    preMethods: [],
        //    customMethods: ''
        //}],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllThree(data);
        },
        cols : [
            [ {
                caption : "序号",
                type : "number"
            },{
                caption : "地区",
                type : "number"
            },{
                caption : "访客数",
                type : "number"
            },{
                caption : "浏览量",
                type : "number"
            },{
                caption : "浏览量占比",
                type : "number"
            }]
        ],
        rows : [
            [ "id", "region", "uv", "pv", "pv_rate" ]
        ]
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllFour",
        modelName: ["OverviewPage"],
        platform : false,
        date_picker : false,
        params : {
            date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        flexible_btn: [{
            content: '<a href="/useAnalysis/accessPage" target="_blank">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllFour(data);
        },
        cols : [
            [ {
                caption : "序号",
                type : "number"
            },{
                caption : "访问页面",
                type : "number"
            },{
                caption : "访问页面备注名称",
                type : "number"
            },{
                caption : "访问次数",
                type : "number"
            },{
                caption : "访问次数占比",
                type : "number"
            } ]
        ],
        rows : [
            [ "id", "page_url", "page_describe", "pv", "pv_rate" ]
        ]
    });

    return Router;
};