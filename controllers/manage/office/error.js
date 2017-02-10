/**
 * @author yanglei
 * @date 2017-02-08
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
        }]
    },
    filter = require("../../../filters/office/error");

module.exports = (Router) => {

    //错误趋势
    Router = new main(Router , {
        router : "/office/errorOne",
        modelName : ["ads2_company_oa_error_analysis"],
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
        order : ["-date"],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'error_num',
                value: '总错误数'
            }, {
                key: 'error_user',
                value: '影响用户数'
            }, {
                key: 'rate',
                value: '影响用户率'
            }]
        }],
        params(query, params) {
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data, query, dates, type){
            ret.one(data, query, utils.timesTwo(query.startTime, query.endTime, "1"), type);
        }
    });

    //错误列表
    // Router = new main(Router , {
    //     router : "/office/errorTwo",
    //     modelName : ["ads2_company_oa_error_analysis"],
    //     platform : false,
    //     global_platform : global_platform,
    //     excel_export : true,
    //     flexible_btn : [{
    //         content: '<a href="javascript:void(0)">导出</a>',
    //         preMethods: ['excel_export']
    //     }],
    //     order : ["-date"],
    //     firstSql(query, params) {
    //         let sql = `select * from ads2_company_oa_error_analysis
    //             where date between '${query.startTime}' and '${query.endTime}'
    //             and wm='${params.wm || this.global_platform.list[0].key}'
    //             and day_type = 1
    //             group by`
    //     },
    //     params(query, params) {
    //         params.wm = params.wm || this.global_platform.list[0].key;
    //
    //         return params;
    //     },
    //     filter (data, query, dates, type){
    //         return filter.two(data);
    //     },
    //     rows : [[]],
    //     cols : [[]]
    // });

    return Router;
};