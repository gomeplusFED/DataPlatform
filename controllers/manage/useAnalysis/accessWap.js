/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面-wap
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/useAnalysis/accessWap");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/accessWapOne",
        modelName : ["UrlAccessWap"],
        platform : false,
        fixedParams : {
            type : "H5",
            url_type : 1
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'page_view',
                value: '浏览量'
            }, {
                key: 'access_num',
                value: '访客数'
            }, {
                key: 'ip_num',
                value: 'ip数'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.accessWapOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessWapTwo",
        modelName : ["UrlAccessWap"],
        excel_export : true,
        platform : false,
        fixedParams : {
            type : "H5"
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
        filter(data, filter_key, dates) {
            return filter.accessWapTwo(data);
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
                type: 'string'
            }, {
                caption: '平均停留时长(s)',
                type: 'number'
            }, {
                caption: '趋势'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/wap",
        modelName : ["UrlAccessWap"],
        filter(data, filter_key, dates) {
            return filter.wap(data);
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
                type : "number"
            },{
                caption : "平均停留时间",
                type : "number"
            } ]
        ]
    });

    return Router;
};