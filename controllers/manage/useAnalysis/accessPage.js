/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面
 */
var api = require("../../../base/api"),
    orm = require("orm"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/useAnalysis/accessPage");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/accessPageOne",
        modelName : ["UsersAccess"],
        platform : false,
        fixedParams : {
            type : orm.not_in(["H5"])
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
        filter(data, filter_key, dates) {
            return filter.accessPageOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessPageTwo",
        modelName : ["UsersAccess"],
        platform : false,
        excel_export : true,
        paging : true,
        sum : ["acc_num", "acc_time"],
        order : ["-date"],
        fixedParams : {
            type : orm.not_in(["H5"])
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.accessPageTwo(data, page);
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
                    type: 'number'
                },
                {
                    caption: '访问次数占比',
                    type: 'string'
                },
                {
                    caption: '平均停留时间(s)',
                    type: 'number'
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
                    caption: '趋势'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/page",
        modelName : ["UsersAccess"],
        paging : true,
        order : [ "-date" ],
        platform : false,
        fixedParams : {
            type : orm.not_in(["H5"])
        },
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.page(data, page);
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

    Router = new help(Router, {
        router : "/useAnalysis/accessPage/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "访问次数",
                help : "统计时间内，访问次数"
            },
            {
                name : "平均停留时长",
                help : "总时长/访问次数"
            },
            {
                name : "访问次数占比",
                help : "页面访问次数/总访问次数"
            },
            {
                name : "停留时间占比",
                help : "页面访问时长/总时长"
            }
        ]
    });

    return Router;
};