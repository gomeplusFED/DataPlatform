/**
 * @author yanglei
 * @date 2017-02-07
 * @fileoverview
 */
const main = require("../../../base/main"),
    utils = require("../../../utils"),
    global_platform = {
        show: true,
        key: 'wm',
        list: [{
            key: 'ios',
            name: 'IOS'
        }, {
            key: 'android',
            name: 'Android'
        }, {
            key: 'app',
            name: 'APP'
        }, {
            key: 'pc',
            name: 'PC'
        }]
    },
    filter = require("../../../filters/office/function");

module.exports = (Router) => {

    //通讯录功能
    Router = new main(Router , {
        router : "/office/funOne",
        modelName : ["ads2_company_oa_function_analysis"],
        platform : false,
        global_platform : global_platform,
        toggle : {
            show : true
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.approval_name = "all";
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data, query, dates, type){
            return filter.one(data, query, utils.timesTwo(query.startTime, query.endTime, "1"), type);
        }
    });

    //设置功能
    Router = new main(Router , {
        router : "/office/funTwo",
        modelName : ["ads2_company_oa_function_analysis"],
        platform : false,
        global_platform : global_platform,
        toggle : {
            show : true
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.approval_name = "all";
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data, query, dates, type){
            return filter.two(data, query, utils.timesTwo(query.startTime, query.endTime, "1"), type);
        }
    });

    //审批功能
    Router = new main(Router , {
        router : "/office/funThree",
        modelName : ["ads2_company_oa_function_analysis"],
        platform : false,
        global_platform : global_platform,
        toggle : {
            show : true
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.approval_name = "all";
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data, query, dates, type){
            return filter.three(data, query, utils.timesTwo(query.startTime, query.endTime, "1"), type);
        }
    });

    //审批
    Router = new main(Router , {
        router : "/office/funThree",
        modelName : ["ads2_company_oa_function_analysis"],
        platform : false,
        global_platform : global_platform,
        toggle : {
            show : true
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.approval_name = "all";
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data, query, dates, type){
            return filter.three(data, query, utils.timesTwo(query.startTime, query.endTime, "1"), type);
        }
    });

    return Router;
};