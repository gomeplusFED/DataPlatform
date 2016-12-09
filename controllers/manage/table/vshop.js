/**
 * @author yanglei
 * @date 2016-12-09
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../utils/globalPlatform");
const moment = require("moment");
const filter = require("../../../filters");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayVshopOne",
        platform : false,
        modelName : ["VshopReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = 1;
            const now = new Date();
            const date = util.times(query.startTime, query.endTime, "1");
            date.push(moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            date.push(moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            params.date = date;

            return params;
        },
        filter(data) {
            return filter.dayOne(data, new Date());
        }
    });

    return Router;
};