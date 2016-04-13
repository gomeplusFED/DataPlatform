/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用频率
 */
var api = require("../../../base/api"),
    frequency = [ '1-2次', '3-5次', '6-9次', '10-19次', '20-49次', '50+次'],
    filter = require("../../../filters/useAnalysis/useFrequency");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyOne",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "日启动次数");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyTwo",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.useFrequencyTwo(data, frequency);
        },
        rows : [
            ['distribution', 'num', 'num_rate']
        ],
        cols : [
            [{
                caption: '启动次数',
                type: 'string'
            }, {
                caption: '用户数',
                type: 'number'
            }, {
                caption: '用户数占比',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyThree",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2,
            day_type : 2
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "周启动次数");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyFour",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2,
            day_type : 2
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.useFrequencyTwo(data, frequency);
        },
        rows : [
            ['distribution', 'num', 'num_rate']
        ],
        cols : [
            [{
                caption: '启动次数',
                type: 'string'
            }, {
                caption: '用户数',
                type: 'number'
            }, {
                caption: '用户数占比',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyFive",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2,
            day_type : 3
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "月启动次数");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencySix",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 2,
            day_type : 3
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.useFrequencyTwo(data, frequency);
        },
        rows : [
            ['distribution', 'num', 'num_rate']
        ],
        cols : [
            [{
                caption: '启动次数',
                type: 'string'
            }, {
                caption: '用户数',
                type: 'number'
            }, {
                caption: '用户数占比',
                type: 'string'
            }]
        ]
    });

    return Router;
};