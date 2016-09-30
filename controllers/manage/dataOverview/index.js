/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../../base/main"),
    util = require("../../../utils"),
    orm = require("orm"),
    dataOverview = require("../../../filters/dataOverview");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllOne",
        modelName : ['OverviewPlatf', "KpiValue"],
        date_picker : false,
        platform : false,
        global_platform : {
            show: true,
            key: 'type',
            list: [{
                key: 'ios',
                name: 'IOS'
            }, {
                key: 'android',
                name: 'Android'
            }, {
                key: 'app',
                name: 'APP'
            }, {
                key: 'pc',
                name: 'PC'
            }, {
                key: 'm',
                name: 'H5'
            }]
        },
        params(query) {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
                params = {
                    date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                    region : "ALL",
                    day_type : 1,
                    type : query.type || "ios"
                };
            return params;
        },
        secondParams(query, params) {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, query, dates) {
            return dataOverview.dataOverviewAllOne(data, query.type || "ios");
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllTwo",
        modelName : ["OverviewPlatf"],
        platform : false,
        params(query, params) {
            params.type = params.type || 'ios';
            params.region = "ALL";
            return params;
        },
        //selectFilter(req, cb) {
        //    let _type = 'android，ios，app';
        //    let type = req.query.type || 'ios';
        //    if(_type.indexOf(type) >= 0) {
        //        cb(null, [{
        //            title: '指标选择',
        //            filter_key: 'filter_key',
        //            groups: [{
        //                key: 'open_user_total',
        //                value: '启动用户'
        //            }, {
        //                key: 'open_total',
        //                value: '启动次数'
        //            }, {
        //                key: 'new_user',
        //                value: '新用户'
        //            }, {
        //                key: 'new_account',
        //                value: '新增账户'
        //            }, {
        //                key: 'register_rate',
        //                value: '注册转化率'
        //            }, {
        //                key: 'using_time_avg',
        //                value: '每次使用时长'
        //            }]
        //        }]);
        //    } else {
        //        cb(null, [{
        //            title: '指标选择',
        //            filter_key: 'filter_key',
        //            groups: [{
        //                key: 'uv',
        //                value: '访客数'
        //            }, {
        //                key: 'pv',
        //                value: '浏览量'
        //            }, {
        //                key: 'ip_count',
        //                value: 'IP数'
        //            }, {
        //                key: 'new_user',
        //                value: '新用户'
        //            }, {
        //                key: 'new_account',
        //                value: '新增账户'
        //            }, {
        //                key: 'visit_time_avg',
        //                value: '平均访问时长'
        //            }, {
        //                key: 'register_rate',
        //                value: '注册转化率'
        //            }]
        //        }]);
        //    }
        //},
        filter(data, query, dates, type) {
            return dataOverview.dataOverviewAllTwo(data, query, dates);
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllThree",
        modelName : ["OverviewPlatf"],
        paging : [true],
        order : [ "-open_total" ],
        sum : ["open_total"],
        platform : false,
        date_picker : false,
        params(query) {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : query.type || 'ios',
                region : orm.not_in(["ALL"]),
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/terminal/provinces">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, query, dates, type) {
            return dataOverview.dataOverviewAllThree(data, query.type);
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllFour",
        modelName : ["OverviewPage"],
        platform : false,
        date_picker : false,
        paging : [true],
        order : ["-pv"],
        sum : ["pv"],
        params(query) {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : query.type || 'ios',
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/useAnalysis/accessPage" target="_blank">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, query, dates, type) {
            return dataOverview.dataOverviewAllFour(data);
        }
    });

    return Router;
};