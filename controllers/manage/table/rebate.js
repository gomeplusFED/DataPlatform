/**
 * @author yanglei
 * @date 201611230
 * @fileoverview 返利表报
 */

const util = require("../../../utils"),
    request = require("request"),
    main = require("../../../base/main"),
    filter = require("../../../filters/table/rebate");

module.exports = (Router) => {

    //总体返利情况
    Router = new main(Router, {
        router : "/socialAnalysis/rebateOne",
        platform : false,
        modelName : ["ReportRebatePlanRebateTypeTotalSummary", "ReportRebatePlanRebateTypeTotalDaily", "TypeFlow"],
        date_picker_data : 1,
        showDayUnit : true,
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                //key : "",
                name: '返利总览',
                url : "#!/socialAnalysis/rebate"
            }, {
                //key : "",
                name: '新增返利',
                url : "#!/socialAnalysis/rebateNew"
            }]
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        thirdParams() {
            return {};
        },
        filter(data) {
            return filter.rebateOne(data);
        }
    });

    //总体返利情况下载
    Router.get("/socialAnalysis/rebateOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/rebateOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/rebateOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("总体返利情况");
            const modelData = body.modelData;
            const newData = [];
            for(let item of modelData) {
                const cols = item.cols;
                const data = item.data;
                const rows = item.rows;
                const arr = [];
                for(let col of cols) {
                    arr.push(col.caption);
                }
                newData.push(arr);
                for(let key of data) {
                    let a = [];
                    for(let row of rows) {
                        a.push(key[row]);
                    }
                    newData.push(a);
                }
                newData.push([]);
                newData.push([]);
            }
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    //新增返利
    Router = new main(Router, {
        router : "/socialAnalysis/rebateNewOne",
        platform : false,
        modelName : ["ReportRebatePlanRebateTypeSummary", "ReportRebatePlanRebateTypeDaily", "TypeFlow"],
        date_picker_data : 1,
        showDayUnit : true,
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                //key : "",
                name: '返利总览',
                url : "#!/socialAnalysis/rebate"
            }, {
                //key : "",
                name: '新增返利',
                url : "#!/socialAnalysis/rebateNew"
            }]
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        thirdParams() {
            return {};
        },
        filter(data) {
            return filter.rebateNewOne(data);
        }
    });

    return Router;
};