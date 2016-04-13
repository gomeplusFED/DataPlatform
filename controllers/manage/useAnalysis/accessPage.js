/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/useAnalysis/accessPage");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/accessPageOne",
        modelName : ["UsersAccess"],
        filter_select: [{
            title: '指标选择',
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
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.accessPageTwo(data);
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
                    caption: '平均停留时间',
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
        filter(data, filter_key, dates) {
            return filter.page(data);
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