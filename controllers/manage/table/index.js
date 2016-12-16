/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 我的报表
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/table");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/socialAnalysis/tableOne",
        modelName : ["GroupReport", "SocialCategory"],
        paging : [true, false],
        platform : false,
        date_picker_data: 1,
        showDayUnit : true,
        excel_export : true,
        procedure : [[
            {
                find : "params",
                offset : "offset",
                limit : "limit",
                order : ["category_id_1"],
                run : ""
            },{
                count : ""
            }
        ]],
        secondParams(query, params, data) {
            return {};
        },
        filter_select: [
            {
                title: '报表类型',
                filter_key: 'filter_key',
                groups: [{
                    key: 'social',
                    value: '社交圈子'
                }]
            }
        ],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates, type) {
            return filter.tableOne(data, query.filter_key);
        }
    });

    return Router;
};