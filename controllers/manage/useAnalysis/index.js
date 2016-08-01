/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用时长
 */
var api = require("../../../base/main"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/useAnalysis");

module.exports = (Router) => {
    const procedure = [
        {
            aggregate : {
                value : ["distribution"]
            },
            sum : ["num"],
            groupBy : ["distribution"],
            get : ""
        }
    ];
    const times = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒',
        '1-3分', '3-10分', '10-30分', '30分+' ];

    Router = new api(Router,{
        router : "/useAnalysis/useTimeOne",
        modelName : ["UserCompose"],
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/useAnalysis/useTime/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        procedure : procedure,
        params : {
            use_type : 1
        },
        filter(data, filter_key, dates) {
            return filter.useTimeOne(data, times, "单次使用时长");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useTimeTwo",
        modelName : ["UserCompose"],
        params : {
            use_type : 1
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        procedure : procedure,
        filter(data, filter_key, dates) {
            return filter.useTimeTwo(
                data,
                times
            );
        },
        rows : [
            ['distribution', 'sum_num', 'num_rate']
        ],
        cols : [
            [{
                caption: '访问页面',
                type: 'string'
            }, {
                caption: '启动/浏览次数',
                type: 'number'
            }, {
                caption: '启动/浏览次数占比',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/useTimeThree",
        modelName : ["UserCompose"],
        params : {
            use_type : 4
        },
        procedure : procedure,
        filter(data, filter_key, dates) {
            return filter.useTimeOne(
                data,
                times,
                "日使用时长"
            );
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useTimeFour",
        modelName : ["UserCompose"],
        params : {
            use_type : 4
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        procedure : procedure,
        filter(data, filter_key, dates) {
            return filter.useTimeTwo(
                data,
                times
            );
        },
        rows : [
            ['distribution', 'sum_num', 'num_rate']
        ],
        cols : [
            [{
                caption: '访问页面',
                type: 'string'
            }, {
                caption: ' 用户数',
                type: 'number'
            }, {
                caption: ' 用户数占比',
                type: 'string'
            }]
        ]
    });

    Router = new help(Router, {
        router : "/useAnalysis/useTime/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "单次使用时长",
                help : "单次使用时长：一次使用应用的时长"
            },
            {
                name : "日使用时长",
                help : "单日使用时长：用户一天内使用应用的时长"
            }
        ]
    });

    return Router;
};