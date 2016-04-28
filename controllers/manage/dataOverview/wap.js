/**
 * @author yanglei
 * @date 20160412
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
        router: "/dataOverview/wapOne",
        modelName: ['OverviewPlatf', "KpiValue"],
        date_picker : false,
        platform : false,
        params : {
            date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            region : "ALL",
            type : "H5",
            day_type : 1
        },
        orderParams : {
            date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllOne(data, "");
        },
        rows : [
            ['name', 'uv', 'pv', 'ip_count', 'jump_loss_rate',
                'new_user', 'new_user_rate_two', 'new_account', 'register_rate', 'visit_time_avg',
                "pv1", "create"]
        ],
        cols : [
            [{
                caption: ' ',
                type: 'string'
            }, {
                caption: '访客数',
                type: 'number'
            },  {
                caption: '浏览量',
                type: 'number'
            },  {
                caption: 'IP数',
                type: 'number'
            }, {
                caption: '跳失率',
                type: 'number'
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
                caption: '平均访问时长(s)',
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
        router: "/dataOverview/wapTwo",
        modelName: ["OverviewPlatf"],
        fixedParams : {
            region : "ALL",
            type : "H5"
        },
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'uv',
                value: '访客数'
            }, {
                key: 'pv',
                value: '浏览量'
            }, {
                key: 'ip_count',
                value: 'IP数'
            }, {
                key: 'new_user',
                value: '新用户'
            }, {
                key: 'new_account',
                value: '新增账户'
            }, {
                key: 'visit_time_avg',
                value: '平均访问时长'
            }, {
                key: 'register_rate',
                value: '注册转化率'
            }]
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllTwo(
                data,
                filter_key,
                {
                    uv : "访客数",
                    pv : "浏览量",
                    ip_count : "IP数",
                    new_user : "新用户",
                    new_account : "新增账户",
                    visit_time_avg : "平均访问时长(s)",
                    register_rate : "注册转化率(%)"
                },
                dates,
                ""
            );
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/wapThree",
        modelName: ["OverviewPlatf"],
        date_picker : false,
        platform : false,
        params : {
            date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        flexible_btn: [{
            content: '<a href="#!/terminal/provinces">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewWapThree(data);
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
        router: "/dataOverview/wapFour",
        modelName: ["OverviewPage"],
        date_picker : false,
        platform : false,
        params : {
            date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
            day_type : 1
        },
        flexible_btn: [{
            content: '<a href="#!/useAnalysis/accessPage">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewWapFour(data);
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