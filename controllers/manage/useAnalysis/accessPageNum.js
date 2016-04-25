/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面数量分布
 */
var api = require("../../../base/api"),
    num = [ '1-2个', '3-5个', '6-9个', '10-19个', '20-30个', '30-99个', '100+个' ],
    filter = require("../../../filters/useAnalysis/accessPageNum");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/useAnalysis/accessPageNumOne",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 3
        },
        filter(data, filter_key, dates) {
            return filter.accessPageNumOne(data, num);
        }
    });

    Router = new api(Router,{
        router : "/useAnalysis/accessPageNumTwo",
        modelName : ["UserCompose"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
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