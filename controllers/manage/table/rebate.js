/**
 * @author yanglei
 * @date 201611230
 * @fileoverview 返利表报
 */

const util = require("../../../utils"),
    request = require("request"),
    main = require("../../../base/main"),
    orm = require("orm"),
    filter = require("../../../filters/table/rebate");

module.exports = (Router) => {

    //总体返利情况
    Router = new main(Router, {
        router : "/socialAnalysis/rebateOne",
        platform : false,
        cancelDateLimit : true,
        modelName : ["ReportRebatePlanRebateTypeTotalSummary", "ReportRebatePlanRebateTypeTotalDaily", "TypeFlow"],
        date_picker_data : 1,
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
        secondParams(query, params) {
            params.plan_type = orm.not_in([4]);

            return params;
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
            const newData = util.arrayToArray(modelData);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    //新增返利
    Router = new main(Router, {
        router : "/socialAnalysis/rebateNewOne",
        platform : false,
        cancelDateLimit : true,
        modelName : ["ReportRebatePlanRebateTypeSummary", "ReportRebatePlanRebateTypeDaily", "TypeFlow"],
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        secondParams(query, params) {
            params.plan_type = orm.not_in([4]);

            return params;
        },
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
        thirdParams() {
            return {};
        },
        filter(data) {
            return filter.rebateNewOne(data);
        }
    });

    //总体返利情况下载
    Router.get("/socialAnalysis/rebateNewOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/rebateNewOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
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
            const ws = wb.addWorksheet("新增返利");
            const modelData = body.modelData;
            const newData = util.arrayToArray(modelData);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    return Router;
};