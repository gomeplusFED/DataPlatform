/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/share");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/share/insideOne",
        modelName : ["ShareAnalysis"],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'product',
                value: '商品'
            }, {
                key: 'shop',
                value: '店铺'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.insideOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/share/insideTwo",
        modelName : ["ShareAnalysis"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.insideTwo(data, dates);
        },
        rows : [
            ['date','share_num','open_num']
        ],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption: '分享次数',
                    type: 'number'
                },
                {
                    caption: '打开次数',
                    type: 'number'
                }
            ]
        ]
    });

    return Router;
};