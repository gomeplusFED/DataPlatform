/**
 * @author yanglei
 * @date 2016-12-06
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../utils/globalPlatform");
const filter = require("../../../filters/table/user");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = 1;

            return params;
        },
        filter(data) {
            return filter.dayOne(data);
        }
    });

    return Router;
};