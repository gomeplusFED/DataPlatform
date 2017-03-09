/**
 * @author yanglei
 * @date 2017-02-04
 * @fileoverview 终端分析
 */
const filter = require("../../../filters/office/terminal"),
    orm = require("orm"),
    main = require("../../../base/main");

module.exports = (Router) => {

    //top10-客户端
    Router = new main(Router , {
        router : "/office/terminalOne",
        modelName : ["ads2_company_oa_terminal_analysis"],
        platform : false,
        global_platform : {
            show: true,
            name : "终端切换",
            list: [{
                name: '客户端',
                url : "#!/office/terminal"
            }, {
                name: '浏览器',
                url : "#!/office/terminalOther"
            }]
        },
        firstSql(query, params) {
            const sql = `SELECT 
                SUM(${query.filter_key}) ${query.filter_key},
                ${query.filter_type}
            FROM 
                ads2_company_oa_terminal_analysis
            WHERE
                date BETWEEN '${query.startTime}' AND '${query.endTime}'
            AND
                day_type=1
            AND
                wm='app'
            AND
                ${query.filter_type} IN (
                SELECT ${query.filter_type} FROM (SELECT ${query.filter_type} FROM (SELECT 
                    COUNT(${query.filter_key}) ${query.filter_key}, ${query.filter_type}
                FROM 
                    ads2_company_oa_terminal_analysis
                WHERE
                    date BETWEEN '${query.startTime}' AND '${query.endTime}'
                AND
                    day_type=1
                AND
                    wm='app'
                GROUP BY ${query.filter_type}
                ORDER BY ${query.filter_key} DESC) a LIMIT 0,10) b) GROUP BY ${query.filter_type}`;

            return {
                sql : sql,
                params : []
            };
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_type',
            groups: [{
                key: "phone_type",
                value: '机型'
            }, {
                key: "phone_os",
                value: '操作系统'
            }]
        }, {
            title : "",
            filter_key : "filter_key",
            groups : [{
            //     key : "new_user",
            //     value : "新增账号"
            // }, {
                key : "active_user",
                value : "活跃用户"
            }, {
                key : "start_num",
                value : "启动次数"
            }]
        }],
        filter (data, query){
            return filter.one(data, query.filter_key, query.filter_type);
        }
    });

    //数据明细-客户端
    Router = new main(Router , {
        router : "/office/terminalTwo",
        modelName : ["ads2_company_oa_terminal_analysis"],
        platform : false,
        firstSql(query, params, isCount) {
            if(isCount) {
                let sql = `select COUNT(*) count, SUM(new_user) new_user, SUM(operate_user) operate_user FROM (SELECT SUM(new_user) new_user, SUM(operate_user) operate_user FROM ads2_company_oa_terminal_analysis WHERE date BETWEEN '${query.startTime}' AND '${query.endTime}' AND day_type=1 and wm='app' GROUP BY ${query.filter_type}) a`;

                return {
                    sql : sql,
                    params : []
                };
            } else {
                let sql = `SELECT SUM(new_user) new_user, SUM(active_user) active_user, SUM(operate_user) operate_user, SUM(start_num) start_num, phone_type, phone_os,operate_user_total  FROM ads2_company_oa_terminal_analysis where date between '${query.startTime}' and '${query.endTime}' and day_type=1 and wm='app' GROUP BY ${query.filter_type} LIMIT ?,?`,
                    page = query.page - 1 || 0,
                    offset = query.from - 1 || (page * query.limit),
                    limit = query.to || query.limit || 0;

                return {
                    sql : sql,
                    params : [+offset, +limit]
                };
            }
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_type',
            groups: [{
                key: "phone_type",
                value: '机型'
            }, {
                key: "phone_os",
                value: '操作系统'
            }]
        }],
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter (data, query){
            return filter.two(data, query.filter_type);
        }
    });

    //top10-浏览器
    Router = new main(Router , {
        router : "/office/terminalOtherOne",
        modelName : ["ads2_company_oa_terminal_analysis"],
        platform : false,
        global_platform : {
            show: true,
            name : "终端切换",
            list: [{
                name: '客户端',
                url : "#!/office/terminal"
            }, {
                name: '浏览器',
                url : "#!/office/terminalOther"
            }]
        },
        firstSql(query, params) {
            const sql = `SELECT 
                * 
            FROM 
                ads2_company_oa_terminal_analysis
            WHERE
                date BETWEEN '${query.startTime}' AND '${query.endTime}'
            AND
                day_type=1
            AND
                wm='web'
            AND
                phone_type IN (
                SELECT phone_type FROM (SELECT phone_type FROM (SELECT 
                    COUNT(${query.filter_key}) ${query.filter_key}, phone_type
                FROM 
                    ads2_company_oa_terminal_analysis
                WHERE
                    date BETWEEN '${query.startTime}' AND '${query.endTime}'
                AND
                    day_type=1
                AND
                    wm='web'
                GROUP BY phone_type
                ORDER BY ${query.filter_key} DESC) a LIMIT 0,10) b)`;

            return {
                sql : sql,
                params : []
            };
        },
        filter_select: [{
            title : "",
            filter_key : "filter_key",
            groups : [{
            //     key : "new_user",
            //     value : "新增账号"
            // }, {
                key : "active_user",
                value : "活跃用户"
            }, {
                key : "start_num",
                value : "访问次数"
            }]
        }],
        filter (data, query){
            return filter.one(data, query.filter_key, query.filter_type);
        }
    });

    //数据明细-浏览器
    Router = new main(Router , {
        router : "/office/terminalOtherTwo",
        modelName : ["ads2_company_oa_terminal_analysis"],
        platform : false,
        firstSql(query, params, isCount) {
            if(isCount) {
                let sql = `select COUNT(*) count, SUM(new_user) new_user, SUM(operate_user) operate_user FROM (SELECT SUM(new_user) new_user, SUM(operate_user) operate_user FROM ads2_company_oa_terminal_analysis WHERE date BETWEEN '${query.startTime}' AND '${query.endTime}' AND day_type=1 and wm='web' GROUP BY phone_type) a`;

                return {
                    sql : sql,
                    params : []
                };
            } else {
                let sql = `SELECT SUM(new_user) new_user, SUM(active_user) active_user, SUM(operate_user) operate_user, SUM(start_num) start_num, phone_type, operate_user_total FROM ads2_company_oa_terminal_analysis where date between '${query.startTime}' and '${query.endTime}' and day_type=1 and wm='web' GROUP BY phone_type LIMIT ?,?`,
                    page = query.page - 1 || 0,
                    offset = query.from - 1 || (page * query.limit),
                    limit = query.to || query.limit || 0;

                return {
                    sql : sql,
                    params : [+offset, +limit]
                };
            }
        },
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter (data, query){
            return filter.two(data, 2);
        }
    });

    return Router;
};