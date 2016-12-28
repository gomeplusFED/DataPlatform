/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面-wap
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/useAnalysis/accessWap"),
    global_platform = {
        show: true,
        key: 'type',
        list: [{
            key: 'pc',
            name: 'PC'
        }, {
            key: 'm',
            name: 'H5'
        }]
    };

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/accessWapOne",
        modelName : ["UrlAccessWap"],
        platform : false,
        global_platform : global_platform,
        procedure : [{
            aggregate : {
                params : "params",
                value : ["date"]
            },
            sum : ["page_view", "access_num", "ip_num"],
            groupBy : ["date"],
            get : ""
        }],
        params(query, params) {
            params.type = query.type || this.global_platform.list[0].key;
            params.url_type = 1;
            return params;
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/useAnalysis/accessWap/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'sum_page_view',
                value: '浏览量'
            }, {
                key: 'sum_access_num',
                value: '访客数'
            }, {
                key: 'sum_ip_num',
                value: 'ip数'
            }]
        }],
        filter(data, query, dates) {
            return filter.accessWapOne(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessWapTwo",
        modelName : ["UrlAccessWap"],
        excel_export : true,
        platform : false,
        paging : [true],
        order : ["-date"],
        global_platform : global_platform,
        params(query, params) {
            params.type = query.type || this.global_platform.list[0].key;
            return params;
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter_select: [{
            title: '',
            filter_key : 'url_type',
            groups: [ {
                key: '2',
                value: '入口页面'
            }, {
                key: '3',
                value: '出口页面'
            }]
        }],
        filter(data, query, dates) {
            return filter.accessWapTwo(data, query.page);
        },
        rows : [
            [ 'id', 'url', 'page_view', 'access_num','down_browse', 'avg_stay_time',
                "operating"]
        ],
        cols : [
            [{
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
                type: 'string',
                help : "访客数-访问一个页面即跳走的人数"
            }, {
                caption: '平均停留时长(s)',
                type: 'number',
                help : "总时长/访问次数"
            }, {
                caption: '趋势'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/wap",
        modelName : ["UrlAccessWap"],
        paging : [true],
        platform : false,
        order : ["-date"],
        toggle : true,
        global_platform : global_platform,
        params(query, params) {
            params.type = query.type || this.global_platform.list[0].key;
            return params;
        },
        filter(data, query, dates) {
            return filter.wap(data, dates);
        },
        rows : [
            [ "date", "url", "page_view", "access_num", "down_browse", "avg_stay_time" ]
        ],
        cols : [
            [ {
                caption : "日期",
                type : "number"
            },{
                caption : "页面URL",
                type : "number"
            },{
                caption : "浏览量",
                type : "number"
            },{
                caption : "访客数",
                type : "number"
            },{
                caption : "贡献下游浏览",
                type : "number",
                help : "访客数-访问一个页面即跳走的人数"
            },{
                caption : "平均停留时间(s)",
                type : "number",
                help : "总时长/访问次数"
            } ]
        ]
    });

    return Router;
};