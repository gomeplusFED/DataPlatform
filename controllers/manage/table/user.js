/**
 * @author yanglei
 * @date 2016-12-06
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../utils/globalPlatform");
const filter = require("../../../filters/table/user");
const util = require("../../../utils");
const moment = require("moment");
const request = require("request");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        //control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = [1, 5];
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

    Router.get("/socialAnalysis/dataTableDayUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableDayUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableDayUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
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
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 13, "APP", style],
                [1, 14, 1, 20, "PC", style],
                [1, 21, 1, 27, "WAP站", style]
            ]);
            for(let i = 0; i < data.length - 2; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            const one = [];
            const two = [];
            for(let row of rows) {
                let d = data[data.length - 2][row];
                let dt = data[data.length - 1][row];
                if(d >= 0 && d !== "--") {
                    one.push({
                        name : "↑" +d,
                        style : up
                    });
                } else if(d <= 0 && d !== "--") {
                    one.push({
                        name : "↓" + d,
                        style : down
                    });
                } else {
                    one.push(d);
                }
                if(+dt.replace("%", "") >= 0 && d !== "--") {
                    two.push({
                        name : "↑" + dt,
                        style : up
                    });
                } else if(+dt.replace("%", "") < 0 && d !== "--") {
                    two.push({
                        name : "↓" + dt,
                        style : down
                    });
                } else {
                    two.push(dt);
                }
            }
            newData.push(one);
            newData.push(two);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        //control_table_col : true,
        //excel_export : true,
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

    Router.get("/socialAnalysis/dataTableWeekUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableWeekUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableWeekUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 13, "APP", style],
                [1, 14, 1, 20, "PC", style],
                [1, 21, 1, 27, "WAP站", style]
            ]);
            for(let i = 0; i < data.length; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        //control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.day_type = 3;

            return params;
        },
        filter(data) {
            return filter.monthOne(data);
        }
    });

    Router.get("/socialAnalysis/dataTableMonthUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableMonthUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableMonthUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 13, "APP", style],
                [1, 14, 1, 20, "PC", style],
                [1, 21, 1, 27, "WAP站", style]
            ]);
            for(let i = 0; i < data.length; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    return Router;
};