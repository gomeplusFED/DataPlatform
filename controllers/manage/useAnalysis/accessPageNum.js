/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面数量分布
 */
var api = require("../../../base/main"),
    num = [ '1-2个', '3-5个', '6-9个', '10-19个', '20-30个', '31-99个', '100+个' ],
    filter = require("../../../filters/useAnalysis/accessPageNum"),
    global_platform = {
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
    };

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
        router : "/useAnalysis/accessPageNumOne",
        modelName : ["UserCompose"],
        global_platform : global_platform,
        platform : false,
        procedure : procedure,
        params(query, params) {
            params.use_type = 3;
            params.type = query.type || this.global_platform.list[0].key;
            return params;
        },
        filter(data) {
            return filter.accessPageNumOne(data, num);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessPageNumTwo",
        modelName : ["UserCompose"],
        excel_export : true,
        platform : false,
        procedure : procedure,
        global_platform : global_platform,
        params(query, params) {
            params.use_type = 3;
            params.type = query.type || this.global_platform.list[0].key;
            return params;
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data) {
            return filter.accessPageNumTwo(data, num);
        },
        rows : [
            ['distribution', 'num', 'num_rate']
        ],
        cols : [
            [{
                caption: '访问页面',
                type: 'string'
            }, {
                caption: '启动次数',
                type: 'number'
            }, {
                caption: '启动次数占比',
                type: 'string'
            }]
        ]
    });

    return Router;
};