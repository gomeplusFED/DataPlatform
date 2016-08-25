/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用频率
 */
var api = require("../../../base/main"),
    frequency = [ '1-2次', '3-5次', '6-9次', '10-19次', '20-49次', '50+次'],
    filter = require("../../../filters/useAnalysis/useFrequency");

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

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyOne",
        modelName : ["UserCompose"],
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
        procedure : procedure,
        params(query, params) {
            params.use_type = 2;
            params.type = query.type || 'ios';
            return params;
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "日启动次数(%)");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyTwo",
        modelName : ["UserCompose"],
        procedure : procedure,
        platform : false,
        params(query, params) {
            params.use_type = 2;
            params.type = query.type || "ios";
            return params;
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
        procedure : procedure,
        platform : false,
        params(query, params) {
            params.use_type = 2;
            params.day_type = 2;
            params.type = query.type || "ios";
            return params;
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "周启动次数(%)");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencyFour",
        modelName : ["UserCompose"],
        procedure : procedure,
        platform : false,
        params(query, params) {
            params.use_type = 2;
            params.day_type = 2;
            params.type = query.type || "ios";
            return params;
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
        procedure : procedure,
        platform : false,
        params(query, params) {
            params.use_type = 2;
            params.day_type = 3;
            params.type = query.type || "ios";
            return params;
        },
        filter(data, filter_key, dates) {
            return filter.useFrequencyOne(data, frequency, "月启动次数(%)");
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/useFrequencySix",
        modelName : ["UserCompose"],
        procedure : procedure,
        platform : false,
        params(query, params) {
            params.use_type = 2;
            params.day_type = 3;
            params.type = query.type || "ios";
            return params;
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