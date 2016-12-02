/**
 * @author yanglei
 * @date 20161125
 * @fileoverview 数据报表
 */
const util = require("../../../utils"),
    EventProxy = require("eventproxy");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayOne",
        platform : false,
        modelName : ["ReportRebatePlanRebateTypeTotalSummary"],
        date_picker_data : 1,
        showDayUnit : true,
        global_platform : [{
            show: true,
            key: 'type',
            name : "",
            list: [{
                name: '数据日报',
                url : "#!/socialAnalysis/rebate"
            }, {
                name: '新增返利',
                url : "#!/socialAnalysis/rebateNew"
            }]
        },{
            show: true,
            key: 'type',
            name : "",
            list: [{
                name: '返利总览',
                url : "#!/socialAnalysis/rebate"
            }, {
                name: '新增返利',
                url : "#!/socialAnalysis/rebateNew"
            }]
        }],
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

    return Router;
};