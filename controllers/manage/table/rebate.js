/**
 * @author yanglei
 * @date 201611230
 * @fileoverview 返利表报
 */

const util = require("../../../utils"),
    EventProxy = require("eventproxy"),
    request = require("request"),
    main = require("../../../base/main"),
    filter = require("../../../filters/table/rebate");

module.exports = (Router) => {

    Router = Router.get("/socialAnalysis/rebateZero_json", (req, res, next) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                export: {
                    url : '/socialAnalysis/rebateZero_json'
                }
            }
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/rebateOne",
        platform : false,
        modelName : ["ReportRebatePlanRebateTypeTotalDaily", "ReportRebatePlanRebateTypeTotalSummary"],
        date_picker_data : 1,
        showDayUnit : true,
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                key : "",
                name: '返利总览',
                url : "/socialAnalysis/rebate"
            }, {
                key : "",
                name: '新增返利',
                url : "/channelAnalysis"
            }]
        },
        filter(data, query, dates) {
            return filter.rebateOne(data, query, dates);
        }
    });

    return Router;
};