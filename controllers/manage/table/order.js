/**
 * @author yanglei
 * @date 2016-12-02
 * @fileoverview
 */
const main = require("../../../base/main"),
    moment = require("moment"),
    util = require("../../../utils"),
    global_platform = require("./../../../utils/globalPlatform"),
    filter = require("../../../filters/table/order");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayOrderOne",
        platform : false,
        modelName : ["OrderData"],
        order : ["-date"],
        params(query, params) {
            const now = new Date();
            const date = util.times(query.startTime, query.endTime, "1");
            date.push(moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            date.push(moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            params.date = date;

            return params;
        },
        global_platform : global_platform.day,
        control_table_col : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query) {
            return filter.ordOne(data, new Date(), query);
        }
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekOrderOne",
        platform : false,
        modelName : ["OrderData"],
        order : ["-date"],
        params(query, params) {
            params.day_type = 2;
            return params;
        },
        global_platform : global_platform.week,
        control_table_col : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query) {
            return filter.orwOne(data);
        }
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthOrderOne",
        platform : false,
        modelName : ["OrderData"],
        order : ["-date"],
        params(query, params) {
            params.day_type = 3;
            return params;
        },
        global_platform : global_platform.month,
        control_table_col : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query) {
            return filter.ormOne(data);
        }
    });

    return Router;
};