/**
 * @author yanglei
 * @date 2016-12-02
 * @fileoverview
 */
const main = require("../../../base/main"),
    moment = require("moment"),
    util = require("../../../utils"),
    global_platform = require("./../../../utils/globalPlatform"),
    filter = require("../../../filters/table/order"),
    request = require("request");

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
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query) {
            return filter.ordOne(data, new Date(), query);
        }
    });

    Router.get("/socialAnalysis/dataTableDayOrderOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableDayOrderOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableDayOrderOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("订单数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const up = {
                font : {
                    color : "#FF0000"
                }
            };
            const down = {
                font : {
                    color : "#00FF00"
                }
            };
            for(let i = 0; i < data.length - 1; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            const one = [];
            for(let row of rows) {
                let dt = data[data.length - 1][row];
                if(+dt.replace("%", "") >= 0 && dt !== "--") {
                    one.push({
                        name : "↑" + dt,
                        style : up
                    });
                } else if(+dt.replace("%", "") < 0 && dt !== "--") {
                    one.push({
                        name : "↓" + dt,
                        style : down
                    });
                } else {
                    one.push(dt);
                }
            }
            newData.push(one);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
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