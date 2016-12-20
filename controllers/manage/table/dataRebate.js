/**
 * @author yanglei
 * @date 2016-12-12
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../utils/globalPlatform");
const moment = require("moment");
const util = require("../../../utils");
const filter = require("../../../filters/table/dataRebate");
const request = require("request");

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

    Router.get("/socialAnalysis/dataTableDayDataRebateOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableDayDataRebateOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableDayDataRebateOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("返利数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const cols = body.modelData[0].cols;
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
            const obj = [];
            for(let col of cols) {
                obj.push(col.caption);
            }
            newData.push(obj);
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
                let d = data[data.length - 1][row];
                if(+d.replace("%", "") >= 0 && d !== "--") {
                    one.push({
                        name : "↑" +d,
                        style : up
                    });
                } else if(+d.replace("%", "") <= 0 && d !== "--") {
                    one.push({
                        name : "↓" + d,
                        style : down
                    });
                } else {
                    one.push(d);
                }
            }
            newData.push(one);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekDataRebateOne",
        platform : false,
        modelName : ["ReportRebateSumHistory"],
        order : ["-date"],
        global_platform : global_platform.week,
        control_table_col : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = 2;

            return params;
        },
        filter(data) {
            return filter.weekOne(data);
        }
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthDataRebateOne",
        platform : false,
        modelName : ["ReportRebateSumHistory"],
        order : ["-date"],
        global_platform : global_platform.month,
        control_table_col : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = 2;

            return params;
        },
        filter(data) {
            return filter.monthOne(data);
        }
    });

    return Router;
};