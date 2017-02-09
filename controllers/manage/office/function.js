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
        order : ["-date"],
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
        order : ["-date"],
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
        order : ["-date"],
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

    //审批单详情
    Router = new main(Router , {
        router : "/office/funOperatingOne",
        modelName : ["ads2_company_oa_function_analysis"],
        platform : false,
        global_platform : global_platform,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        firstSql(query, params) {
            let sql = `SELECT 
                SUM(approval_commit) approval_commit,
                SUM(approval_agree) approval_agree,
                SUM(approval_refuse) approval_refuse,
                SUM(approval_cancel) approval_cancel,
                approval_name
            FROM ads2_company_oa_function_analysis
                where date between '${query.startTime}' and '${query.endTime}'
                and wm='${params.wm || this.global_platform.list[0].key}'
                and approval_name not in ("all") 
                and day_type = 1 
                group by approval_name`;

            return {
                sql : sql,
                params : []
            };
        },
        filter (data){
            return filter.operating(data);
        }
    });

    return Router;
};