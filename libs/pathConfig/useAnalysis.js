/**
 * @author yanglei
 * @date 20160316
 * @fileoverview 使用分析
 */
var config = require("../../config.json");
    usersAccess = require("../../filters/usersAccess"),
    usersConstitute = require('../../filters/usersConstitute');

module.exports = {
    pageAnalysis(router, line_name, line_key) {
        return {
            name: "访问页面-wap",
            path: router,
            display: true,
            serverConfig: {
                day_type : true,
                router: router,
                modelName: ['OverviewPage', 'Configure'],
                pageTitle: '访问页面',
                mapTitle: '受访页面',
                tableTitle: '访问页面明细',
                links: config.usersConstitute_page,
                lines : [{
                    name : line_name,
                    type : 'line',
                    key : line_key
                }],
                filter : function(data, types) {
                    return usersAccess.access_wap(data);
                },
                cols: [{
                    caption: '序号',
                    type: 'number'
                }, {
                    caption: '页面URL',
                    type: 'string'
                }, {
                    caption: '浏览量',
                    type: 'number'
                }, {
                    caption: '访客数',
                    type: 'number'
                }, {
                    caption: '贡献下游流量',
                    type: 'string'
                }, {
                    caption: '平均停留时长',
                    type: 'number'
                },
                {
                    caption: '操作'
                }],
                rows: [ 'id', 'page_url', 'pv', 'uv','follow_page_sum', 'stay_time_avg',
                    "<button url_detail='/useAnalysis/wap_json'>详情>></button>"],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                },
                use : '-3'
            }
        };
    },
    entrance(router, line_name, line_key) {
        return {
            name: "访问页面-wap",
            path: router,
            display: true,
            serverConfig: {
                day_type : true,
                router: router,
                modelName: ['OverviewPage', 'Configure'],
                pageTitle: '访问页面',
                mapTitle: '受访页面',
                tableTitle: '访问页面明细',
                links: config.usersConstitute_page,
                lines : [{
                    name : line_name,
                    type : 'line',
                    key : line_key
                }],
                filter : function(data, types) {
                    return usersAccess.access_wap(data);
                },
                cols: [{
                    caption: '序号',
                    type: 'number'
                }, {
                    caption: '页面URL',
                    type: 'string'
                }, {
                    caption: '浏览量',
                    type: 'number'
                }, {
                    caption: '访客数',
                    type: 'number'
                }, {
                    caption: '入口页次数',
                    type: 'number'
                }, {
                    caption: '平均停留时长',
                    type: 'number'
                },
                {
                    caption: '操作'
                }],
                rows: [ 'id', 'page_url', 'pv', 'uv','entry_page_cut', 'stay_time_avg',
                    "<button url_detail='/useAnalysis/wap_json'>详情>></button>" ],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                },
                use : '-3'
            }
        };
    },
    exit(router, line_name, line_key) {
        return {
            name: "访问页面-wap",
            path: router,
            display: true,
            serverConfig: {
                day_type : true,
                router: router,
                modelName: ['OverviewPage', 'Configure'],
                pageTitle: '访问页面',
                mapTitle: '受访页面',
                tableTitle: '访问页面明细',
                links: config.usersConstitute_page,
                lines : [{
                    name : line_name,
                    type : 'line',
                    key : line_key
                }],
                filter : function(data, types) {
                    return usersAccess.access_wap(data);
                },
                cols: [{
                    caption: '序号',
                    type: 'number'
                }, {
                    caption: '页面URL',
                    type: 'string'
                }, {
                    caption: '浏览量',
                    type: 'number'
                }, {
                    caption: '访客数',
                    type: 'number'
                }, {
                    caption: '出口页次数',
                    type: 'number'
                }, {
                    caption: '退出率',
                    type: 'number'
                },  {
                    caption: '平均停留时长',
                    type: 'number'
                },
                {
                    caption: '操作'
                }],
                rows: [ 'id', 'page_url', 'pv', 'uv','exit_page_cut', 'exit_rate', 'stay_time_avg',
                    "<button url_detail='/useAnalysis/wap_json'>详情>></button>"],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                },
                use : '-3'
            }
        };
    },
    accessPage(router, line_name, line_key) {
        return {
            name: "访问页面",
            path: router,
            display: true,
            serverConfig: {
                router: router,
                modelName: ['UsersAccess','Configure'],
                pageTitle:'访问页面',
                mapTitle:'页面访问趋势',
                tableTitle:'访问页面数据明细',
                lines: [{
                    name: line_name,
                    type : "line",
                    key : line_key
                }],
                links : config.users_access,
                filter : function(data, types) {
                    return usersAccess.access(data, line_key);
                },
                cols: [
                    {
                        caption: '序号',
                        type: 'number'
                    },
                    {
                        caption: '访问页面名称',
                        type: 'string'
                    },
                    {
                        caption: '访问页面备注名称',
                        type: 'string'
                    },
                    {
                        caption: '访问次数',
                        type: 'number'
                    },
                    {
                        caption: '访问次数占比',
                        type: 'number'
                    },
                    {
                        caption: '平均停留时间',
                        type: 'string'
                    },
                    {
                        caption: '停留时间占比',
                        type: 'string'
                    },
                    {
                        caption: '页面跳出率',
                        type: 'string'
                    },
                    {
                        caption: '操作'
                    }
                ],
                rows: [ 'id','url','url_comment','acc_num', 'acc_num_rate', 'acc_time', 'acc_time_rate', 'bounce_rate'
                    , "<button url_detail='/useAnalysis'>详情>></button>"],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                }
            }
        };
    },
    accessNum() {
        return {
            name: "访问页面数量分布",
            path: "/useAnalysis/accessPage",
            display: true,
            serverConfig: {
                day_type : false,
                router: '/useAnalysis/accessPage',
                modelName: ['UserCompose', 'Configure'],
                pageTitle: '访问页面',
                mapTitle: '访问页面分布',
                tableTitle: '访问页面数据明细',
                lines : [{
                    name : '启动次数',
                    type : 'bar',
                    key:'num',
                    direction : 1
                }],
                filter : function(data, types) {
                    return usersConstitute(data, [ '1-2个', '3-5个', '6-9个', '10-19个', '30-99个', '100+' ]);
                },
                cols: [{
                    caption: '访问页面',
                    type: 'string'
                }, {
                    caption: '启动次数',
                    type: 'number'
                }, {
                    caption: '启动次数占比',
                    type: 'string'
                }],
                rows: ['distribution', 'num', 'num_rate'],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                },
                use : '-3'
            }
        };
    }
};