/**
 * @author yanglei
 * @date 20160412
 * @fileoverview 数据概览
 */

var api = require("../../../base/api"),
    moment = require("moment"),
    util = require("../../../utils"),
    orm = require("orm"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    dataOverview = require("../../../filters/dataOverview");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/wapOne",
        modelName : ['OverviewPlatf', "KpiValue"],
        date_picker : false,
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/dataOverviewWAP/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                region : "ALL",
                type : "H5",
                day_type : 1
            }
        },
        orderParams() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllOne(data, "");
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/wapTwo",
        modelName : ["OverviewPlatf"],
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
                dates
            );
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/wapThree",
        modelName : ["OverviewPlatf"],
        paging : true,
        order : ["-pv"],
        sum : ["pv"],
        date_picker : false,
        platform : false,
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : "H5",
                region : orm.not_in(["ALL"]),
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/terminal/provinces">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewWapThree(data);
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/wapFour",
        modelName : ["OverviewPage"],
        date_picker : false,
        paging : true,
        order : ["-pv"],
        sum : ["pv"],
        platform : false,
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : "H5",
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/useAnalysis/accessPage">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewWapFour(data);
        }
    });

    Router = new help(Router, {
        router : "/dataOverviewWAP/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "访客数",
                help : "访问人数"
            },
            {
                name : "浏览量",
                help : "浏览次数"
            },
            {
                name : "IP数",
                help : "访问IP数"
            },
            {
                name : "跳出率",
                help : "访客中访问一个页面用户占比"
            },
            {
                name : "新用户",
                help : "新访客"
            },
            {
                name : "新用户占比",
                help : "新用户/访客数"
            },
            {
                name : "新增账户",
                help : "新注册用户数"
            },
            {
                name : "注册转化率",
                help : "新增账户/新用户"
            },
            {
                name : "平均访问时长",
                help : "总时长/访客数"
            },
            {
                name : "访问次数占比",
                help : "页面访问次数/总访问次数"
            },
            {
                name : "浏览量占比",
                help : "区域的浏览次数/总浏览次数"
            }
        ]
    });

    return Router;
};