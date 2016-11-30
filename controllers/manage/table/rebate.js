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
                url : "#!/channelAnalysis"
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

    Router.get("/socialAnalysis/rebateOne_excel", (req, res, next) => {
        const query = req.query;
        request(`http://localhost:7879/socialAnalysis/rebateOne_json?day_type=${query.day_type}&startTime=${query.startTime}&endTime=${query.endTime}`, (err, res, body) => {
            if(body.iserro) {
                next(new Error("/socialAnalysis/rebateOne_excel has error"));
            }

        })
    });

    return Router;
};