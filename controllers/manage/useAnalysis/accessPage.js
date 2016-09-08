/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/useAnalysis/accessPage");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/accessPageOne",
        modelName : ["UsersAccess"],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";
            return params;
        },
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
            }]
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/useAnalysis/accessPage/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'acc_num',
                value: '访问次数'
            }, {
                key: 'acc_time',
                value: '平均停留时长'
            }, {
                key: 'bounce_rate',
                value: '跳出率'
            }]
        }],
        filter(data, query, dates) {
            return filter.accessPageOne(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessPageTwo",
        modelName : ["UsersAccess"],
        platform : false,
        excel_export : true,
        paging : [true],
        sum : ["acc_num", "acc_time"],
        order : ["-date"],
        params(query, params) {
            params.type = query.type || 'ios';
            return params;
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return filter.accessPageTwo(data, query.page);
        },
        rows : [
            [ 'id','url','url_comment','acc_num', 'acc_num_rate', 'acc_time', 'acc_time_rate', 'bounce_rate',
                "operating"]
        ],
        cols : [
            [
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
                    type: 'number',
                    help : "统计时间内，访问次数"
                },
                {
                    caption: '访问次数占比',
                    type: 'string',
                    help : "页面访问次数/总访问次数"
                },
                {
                    caption: '平均停留时间(s)',
                    type: 'number',
                    help : "总时长/访问次数"
                },
                {
                    caption: '停留时间占比',
                    type: 'string',
                    help : "页面访问时长/总时长"
                },
                {
                    caption: '页面跳出率',
                    type: 'string'
                },
                {
                    caption: '趋势'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/page",
        modelName : ["UsersAccess"],
        paging : [true],
        order : [ "-date" ],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";
            return params;
        },
        filter(data, query, dates) {
            return filter.page(data, query.page);
        },
        rows : [
            [ "id", "date", "acc_num", "acc_time", "bounce_rate" ]
        ],
        cols : [
            [ {
                caption : "序号",
                type : "number"
            },{
                caption : "日期",
                type : "number"
            },{
                caption : "访问次数",
                type : "number"
            },{
                caption : "平均停留时间",
                type : "number"
            },{
                caption : "页面跳出率",
                type : "number"
            } ]
        ]
    });

    return Router;
};