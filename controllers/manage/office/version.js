/**
 * @author yanglei
 * @date 2017-01-25
 * @fileoverview 版本分析
 */
const filter = require("../../../filters/office/version"),
    utils = require("../../../utils"),
    main = require("../../../base/main"),
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
    };

module.exports = (Router) => {

    //top10版本趋势
    Router = new main(Router , {
        router : "/office/versionOne",
        modelName : ["ads2_company_oa_version_analysis"],
        platform : false,
        global_platform : global_platform,
        firstSql(query, params) {
            const sql = `SELECT 
                * 
            FROM 
                ads2_company_oa_version_analysis
            WHERE
                date BETWEEN '${query.startTime}' AND '${query.endTime}'
            AND
                day_type=1
            AND
                wm='${params.wm || this.global_platform.list[0].key}'
            AND
                versions IN (
                SELECT versions FROM (SELECT versions FROM (SELECT 
                    COUNT(${query.filter_key}) ${query.filter_key}, versions
                FROM 
                    ads2_company_oa_version_analysis
                WHERE
                    date BETWEEN '${query.startTime}' AND '${query.endTime}'
                AND
                    day_type=1
                AND
                    wm='${params.wm || this.global_platform.list[0].key}'
                GROUP BY versions
                ORDER BY ${query.filter_key} DESC) a LIMIT 0,10) b)`;

            return {
                sql : sql,
                params : []
            };
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'new_user',
                value: '新增账户'
            }, {
                key: 'active_user',
                value: '活跃用户'
            }, {
                key: 'start_num',
                value: '启动次数'
            }]
        }],
        filter (data, query){
            return filter.one(data, query.filter_key, utils.timesTwo(query.startTime, query.endTime, "1"));
        }
    });

    //版本统计
    Router = new main(Router , {
        router : "/office/versionTwo",
        modelName : ["ads2_company_oa_version_analysis"],
        platform : false,
        global_platform : global_platform,
        date_picker_data : 1,
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            params.wm = params.wm || this.global_platform.list[0].key;

            return params;
        },
        filter (data){
            return filter.two(data);
        },
        rows : [
            ["versions", "new_user", "active_user", "error_num", "rate"]
        ],
        cols : [
            [
                {
                    caption : "版本号",
                    type : "string"
                },{
                    caption : "新增账号",
                    type : "number"
                },{
                    caption : "活跃用户",
                    type : "number"
                },{
                    caption : "错误次数",
                    type : "number"
                },{
                    caption : "当天用户占比",
                    type : "string",
                    help : "当天该版本操作用户数/总操作用户数"
                }
            ]
        ]
    });

    return Router;
};