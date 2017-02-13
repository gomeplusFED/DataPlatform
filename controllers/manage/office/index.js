/**
 * @author yanglei
 * @date 2017-01-23
 * @fileoverview
 */
const filter = require("../../../filters/office"),
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
        }, {
            key: 'pc',
            name: 'PC'
        }]
    };

function globalPlatform(type) {
    let all = true;
    let global_platform = {
        show: true,
        key : "wm",
        // name : "平台选择",
        list : []
    };
    if(type[0] == "1") {
        global_platform.list.push({
            key: "ios",
            name: "IOS"
        });
    } else {
        all = false;
    }
    if(type[1] == "1") {
        global_platform.list.push({
            key: "android",
            name: "Android"
        });
    } else {
        all = false;
    }
    if(type[2] == "1") {
        global_platform.list.push({
            key: "app",
            name: "APP"
        });
    } else {
        all = false;
    }
    if(type[3] == "1") {
        global_platform.list.push({
            key: "pc",
            name: "PC"
        });
    } else {
        all = false;
    }
    if(all) {
        global_platform.list = [{
            key: "ALL",
            name: "全部平台"
        }].concat(global_platform.list);
    }
    return global_platform;
}

module.exports = (Router) => {
    //整体数据
    Router = new main(Router , {
        router : "/office/indexOne",
        modelName : ["ads2_company_oa_overview"],
        platform : false,
        date_picker : false,
        // global_platform : global_platform,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["301"]);
        },
        firstSql(query, params) {
            const now = new Date();
            let boo = true;
            const wm = params.wm || this.global_platform.list[0].key;
            if(wm === "ALL") {
                boo = false;
            }
            const sql = `select 
                date,
                SUM(new_user) new_user, 
                SUM(total_active_user) total_active_user,
                SUM(operate_user) operate_user,
                SUM(start_num) start_num,
                SUM(start_num_peruser) start_num_peruser,
                SUM(error_num) error_num,
                SUM(error_user) error_user,
                SUM(total_user) total_user
                from ads2_company_oa_overview where
                date between '${utils.moment(now - 2 * 24 * 60 * 60 * 1000)}' and '${utils.moment(now - 24 * 60 * 60 * 1000)}' 
                and ${boo ? "wm='" + wm + "' and " : ""} day_type=1 group by date`;

            return {
                sql : sql,
                params : []
            };
        },
        // params : function(query , params , sendData){
        //     const date = [];
        //     const now = new Date();
        //     date.push(utils.moment(now - 24 * 60 * 60 * 1000));
        //     date.push(utils.moment(now - 2 * 24 * 60 * 60 * 1000));
        //     params.date = date;
        //     params.wm = params.wm || this.global_platform.list[0].key;
        //     query.wm = params.wm;
        //     return params;
        // },
        filter (data, query){
            return filter.indexOne(data, query);
        }
    });
    //整体数据趋势
    Router = new main(Router , {
        router : "/office/indexTwo",
        modelName : ["ads2_company_oa_overview"],
        platform : false,
        // global_platform : global_platform,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["301"]);
        },
        params : function(query , params , sendData){
            params.wm = params.wm || this.global_platform.list[0].key;
            return params;
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'user',
                value: '活跃用户构成'
            }, {
                key: 'start',
                value: '启动次数'
            }, {
                key: 'error',
                value: '错误次数'
            }]
        }],
        filter (data, query){
            return filter.indexTwo(data, query.filter_key, utils.timesTwo(query.startTime, query.endTime, "1"));
        }
    });
    //整体数据明细
    Router = new main(Router , {
        router : "/office/indexThree",
        modelName : ["ads2_company_oa_overview"],
        platform : false,
        // global_platform : global_platform,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["301"]);
        },
        order : ["-date"],
        excel_export : true,
        paging : [true],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        firstSql(query, params) {
            let boo = true;
            const wm = params.wm || this.global_platform.list[0].key;
            if(wm === "ALL") {
                boo = false;
            }
            const sql = `select 
                date,
                SUM(new_user) new_user, 
                SUM(total_active_user) total_active_user,
                SUM(operate_user) operate_user,
                SUM(start_num) start_num,
                SUM(start_num_peruser) start_num_peruser,
                SUM(error_num) error_num,
                SUM(error_user) error_user,
                SUM(total_user) total_user
                from ads2_company_oa_overview where
                date between '${query.startTime}' and '${query.endTime}' 
                and ${boo ? "wm='" + wm + "' and " : ""} day_type=1 group by date limit ?,?`;
            const page = query.page - 1 || 0,
                offset = query.from || (page * query.limit),
                limit = query.to || query.limit || 0;

            return {
                sql : sql,
                params : [+offset, +limit]
            };
        },
        // params : function(query , params , sendData){
        //     params.wm = params.wm || this.global_platform.list[0].key;
        //     return params;
        // },
        filter (data){
            return filter.indexThree(data);
        },
        rows : [
            ["date", "new_user", "total_active_user", "rate", "operate_user", "error_num", "error_user"]
        ],
        cols : [
            [
                {
                    caption : "时间",
                    type : "string"
                },{
                    caption : "新增账号",
                    type : "number",
                    help : "新激活的用户数据"
                },{
                    caption : "活跃用户",
                    type : "number",
                    help : "登录用户数"
                },{
                    caption : "新用户占比",
                    type : "string",
                    help : "新增账号/活跃用户*100%"
                },{
                    caption : "操作用户",
                    type : "number",
                    help : "登录后有操作行为的用户数"
                },{
                    caption : "错误次数",
                    type : "number",
                    help : "发生的错误总次数"
                },{
                    caption : "影响用户数",
                    type : "number",
                    help : "出现错误的用户数，去重"
                }
            ]
        ]
    });
    //TOP版本
    Router = new main(Router , {
        router : "/office/indexFour",
        modelName : ["ads2_company_oa_version_analysis"],
        platform : false,
        date_picker : false,
        // global_platform : global_platform,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["301"]);
        },
        firstSql(query, params) {
            const wm = params.wm || this.global_platform.list[0].key;
            const sql = `SELECT 
                versions, SUM(new_user) new_user, SUM(active_user) active_user, SUM(start_num) 
            FROM 
                ads2_company_oa_version_analysis
            WHERE
                date = '${utils.moment(new  Date() - 24 * 60 * 60 * 1000)}' 
            AND
                day_type=1 ${wm === 'ALL' ? "" : "wm='" + wm + "' "}
            group by versions ORDER BY ${query.filter_key} DESC`;

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
        flexible_btn: [{
            content: '<a href="#!/office/version">查看更多</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter (data, query){
            return filter.indexFour(data, query.filter_key);
        }
    });

    return Router;
};