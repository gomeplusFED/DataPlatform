/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/share/outer");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/share/outerOne",
        modelName : ["ShareAnalysis"],
        filter(data, filter_key, dates) {
            return filter.outerOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/share/outerTwo",
        modelName : ["ShareAnalysis"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.outerTwo(data);
        },
        rows : [
            ['channel','open_num','open_num_rate']
        ],
        cols : [
            [
                {
                    caption: '分享平台',
                    type: 'string'
                },
                {
                    caption: '累计打开次数',
                    type: 'number'
                },
                {
                    caption: '打开次数占比',
                    type: 'string'
                }
            ]
        ]
    });

    return Router;
};