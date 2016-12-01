/**
 * @author yanglei
 * @date 201611230
 * @fileoverview 返利表报
 */

const util = require("../../../utils"),
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
    //Router.get("/socialAnalysis/rebateOne_excel", (req, res, next) => {
    //    const query = req.query;
    //});

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