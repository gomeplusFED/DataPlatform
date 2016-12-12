/**
 * @author yanglei
 * @date 2016-12-12
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../util/globalPlatform");
const moment = require("moment");
const util = require("../../../utils");
const filter = require("../../../filters/table/dataRebate");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayDataRebateOne",
        platform : false,
        modelName : ["ReportRebateSumHistory"],
        order : ["-date"],
        global_platform : global_platform.day,
        control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = [1, 6];
            const now = new Date();
            const date = util.times(query.startTime, query.endTime, "1");
            date.push(moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            date.push(moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            params.date = date;

            return params;
        },
        filter(data, query) {
            return filter.dayOne(data, new Date(), query);
        }
    });

    return Router;
};