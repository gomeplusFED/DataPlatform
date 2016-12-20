/**
 * @author yanglei
 * @date 2016-12-08
 * @fileoverview
 */
const main = require("../../../base/main");
const filter = require("../../../filters/table/shop");
const util = require("../../../utils");
const moment = require("moment");
const request = require("request");
const global_platform = require("../../../utils/globalPlatform");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayShopOne",
        modelName : ["ShopReport"],
        platform : false,
        control_table_col : true,
        global_platform : global_platform.day,
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
        filter(data, query) {
            return filter.dayOne(data, query, new Date());
        }
    });

    Router.get("/socialAnalysis/dataTableDayShopOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableDayShopOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableDayShopOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("商铺数据");
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
            const obj = [];
            for(let col of body.modelData[0].cols) {
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
        router : "/socialAnalysis/dataTableWeekShopOne",
        modelName : ["ShopReport"],
        platform : false,
        control_table_col : true,
        excel_export : true,
        global_platform : global_platform.week,
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
        router : "/socialAnalysis/dataTableMonthShopOne",
        modelName : ["ShopReport"],
        platform : false,
        control_table_col : true,
        excel_export : true,
        global_platform : global_platform.month,
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

    return Router;
};