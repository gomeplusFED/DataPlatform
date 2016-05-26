/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/retainedAnalysis");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/retainedAnalysis/retainedOne",
        modelName : ["UserKeep"],
        paging : true,
        order : ["-date", "keep_type"],
        filter(data, filter_key, dates) {
            return filter.retainedOne(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ 'date', 'new_user', 'keep', 'keep_type']
        ],
        cols: [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                }, {
                    caption: '新增用户',
                    type: 'number'
                }, {
                    caption: '留存率',
                    type: 'string'
                }, {
                    caption: '留存类型',
                    type: 'string'
                }
            ]
        ]
    });

    return Router;
};