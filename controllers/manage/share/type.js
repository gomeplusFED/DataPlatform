/**
 * @author yanglei
 * @date 20170504
 * @fileoverview 分享类型
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/share/type");

function globalPlatform(type) {
    let all = true;
    let global_platform = {
        show: true,
        key : "share_platform",
        name : "",
        list : []
    };
    if(type[2] == "1") {
        global_platform.list.push({
            key: "APP",
            name: "APP站"
        });
    } else {
        all = false;
    }
    if(type[3] == "1") {
        global_platform.list.push({
            key: "PC",
            name: "PC站"
        });
    } else {
        all = false;
    }
    if(type[4] == "1") {
        global_platform.list.push({
            key: "M",
            name: "M站"
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

    Router = new api(Router,{
        router : "/share/typeOne",
        modelName : ["ads_share_data_analysis_info"],
        platform : false,
        date_picker_data: 1,
        showDayUnit: true,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["668"]);
        },
        params(query, params, data, dates) {
            params.share_source = "ALL";
            params.share_type   = "ALL";
            params.product_line = "ALL";
            params.share_platform = query.share_platform ? query.share_platform : this.global_platform.list[0].key;

            if(params.share_platform !== "ALL") {
                params.share_platform += "站";
            }

            return params;
        },
        filter(data) {
            return filter.indexOne(data);
        },
        rows : [
            ["share_num", "share_user", "share_rate", "share_succeed_num", "share_succeed_user",
                "success_rate", "share_links_num", "share_links_user", "link_rate"]
        ],
        cols : [
            [
                {
                    caption : "分享次数",
                    type : "number"
                },
                {
                    caption : "分享人数",
                    type : "number"
                },
                {
                    caption : "人均分享数",
                    type : "number"
                },
                {
                    caption : "分享成功次数",
                    type : "number"
                },
                {
                    caption : "分享成功人数",
                    type : "number"
                },
                {
                    caption : "分享成功率",
                    type : "string"
                },
                {
                    caption : "分享链接点击量",
                    type : "number"
                },
                {
                    caption : "分享链接点击人数",
                    type : "number"
                },
                {
                    caption : "分享回流率",
                    type : "string"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/share/typeTwo",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour"],
        platform : false,
        toggle : {
            show : true
        },
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const day_type = query.day_type;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            if(day_type == 1) {
                const sql = `select * 
                    from 
                        ads_share_source_type_hour 
                    where 
                        date='${query.startTime}'
                    and
                        share_platform=?
                    and
                        share_source not in ('ALL')
                    and
                        share_type='ALL'
                    and
                        day_type=1
                    order by hours asc`;

                return {
                    sql,
                    params:[share_platform]
                };
            }
            else {
                const sql = `select * 
                    from 
                        ads_share_data_analysis_info 
                    where 
                        date='${query.startTime}'
                    and
                        product_line='ALL' 
                    and 
                        share_source not in ('ALL') 
                    and 
                        share_type='ALL'
                    and
                        day_type=${query.day_type}
                    and
                        share_platform=?
                    order by date asc`;

                return {
                    sql,
                    params: [share_platform]
                };
            }
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [
                {
                    key: 'share_num',
                    value: '分享次数'
                },
                {
                    key: 'share_user',
                    value: '分享人数'
                },
                {
                    key: 'share_succeed_num',
                    value: '分享成功次数'
                },
                {
                    key: 'share_succeed_user',
                    value: '分享成功人数'
                },
                {
                    key: 'share_links_num',
                    value: '分享链接点击量'
                },
                {
                    key: 'share_links_user',
                    value: '分享链接点击人数'
                }
            ]
        }],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["667"]);
        },
        excel_export : true,
        flexible_btn : [
            {
                content: '<a href="javascript:void(0)">导出</a>',
                preMethods: ['excel_export']
            }
        ],
        filter(data, query, dates, type) {
            return filter.indexTwo(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/typeThree",
        modelName : ["ads_share_data_analysis_info"],
        platform : false,
        toggle : {
            show : true
        },
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const sql = `select 
                    share_type,
                    sum(share_num)          as share_num,
                    sum(share_user)         as share_user,
                    sum(share_succeed_num)  as share_succeed_num,
                    sum(share_succeed_user) as share_succeed_user,
                    sum(share_links_num)    as share_links_num,
                    sum(share_links_user)   as share_links_user
                from 
                    ads_share_data_analysis_info 
                where 
                    date='${query.startTime}'
                and
                    product_line='ALL' 
                and 
                    share_source='ALL'
                and 
                    share_type not in ('ALL')
                and
                    day_type=${query.day_type}
                and
                    share_platform=?
                group by share_type`;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            return {
                sql,
                params: [share_platform]
            };
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [
                {
                    key: 'share_num',
                    value: '分享次数'
                },
                {
                    key: 'share_user',
                    value: '分享人数'
                },
                {
                    key: 'share_succeed_num',
                    value: '分享成功次数'
                },
                {
                    key: 'share_succeed_user',
                    value: '分享成功人数'
                },
                {
                    key: 'share_links_num',
                    value: '分享链接点击量'
                },
                {
                    key: 'share_links_user',
                    value: '分享链接点击人数'
                }
            ]
        }],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["667"]);
        },
        excel_export : true,
        flexible_btn : [
            {
                content: '<a href="javascript:void(0)">导出</a>',
                preMethods: ['excel_export']
            }
        ],
        filter(data, query, dates, type) {
            return filter.indexThree(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/typeFour",
        modelName : ["ads_share_data_analysis_info"],
        platform : false,
        toggle : {
            show : true
        },
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const sql = `select 
                    product_line,
                    sum(share_num)          as share_num,
                    sum(share_user)         as share_user,
                    sum(share_succeed_num)  as share_succeed_num,
                    sum(share_succeed_user) as share_succeed_user,
                    sum(share_links_num)    as share_links_num,
                    sum(share_links_user)   as share_links_user
                from 
                    ads_share_data_analysis_info 
                where 
                    date='${query.startTime}'
                and
                    product_line not in ('ALL') 
                and 
                    share_source='ALL'
                and 
                    share_type='ALL'
                and
                    day_type=${query.day_type}
                and
                    share_platform=?
                group by product_line`;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            return {
                sql,
                params: [share_platform]
            };
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [
                {
                    key: 'share_num',
                    value: '分享次数'
                },
                {
                    key: 'share_user',
                    value: '分享人数'
                },
                {
                    key: 'share_succeed_num',
                    value: '分享成功次数'
                },
                {
                    key: 'share_succeed_user',
                    value: '分享成功人数'
                },
                {
                    key: 'share_links_num',
                    value: '分享链接点击量'
                },
                {
                    key: 'share_links_user',
                    value: '分享链接点击人数'
                }
            ]
        }],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["667"]);
        },
        excel_export : true,
        flexible_btn : [
            {
                content: '<a href="javascript:void(0)">导出</a>',
                preMethods: ['excel_export']
            }
        ],
        filter(data, query, dates, type) {
            return filter.indexFour(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/typeFive",
        modelName : ["ads_share_share_type_top"],
        platform : false,
        date_picker_data: 1,
        showDayUnit: true,
        paging: [true],
        search : {
            show : true,
            title : "分享类型ID/名称",
            key : "filter_key"
        },
        firstSql(query, params, isCount) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const filter_key = query.filter_key;
            const str = `${filter_key ? "and share_id='" + filter_key + "' or share_name like '%" + filter_key + "%'" : ""}`;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            if(isCount) {
                const sql = `select 
                    count(*) count
                from 
                    ads_share_share_type_top 
                where 
                    date='${query.startTime}'
                and
                    share_type not in ('ALL')
                and
                    day_type=${query.day_type}
                and
                    share_platform=?
                ${str}`;

                return {
                    sql,
                    params: [share_platform]
                };
            }
            const page = query.page || 1;
            const limit = +query.limit || 20;
            const offset = (page - 1) * limit;
            const sql = `select 
                    share_type,
                    share_id,
                    share_name,
                    share_num,
                    share_user,
                    share_succeed_num,
                    share_succeed_user,
                    share_links_num,
                    share_links_user,
                    ROUND(share_links_num / share_num, 4) rate
                from 
                    ads_share_share_type_top 
                where 
                    date='${query.startTime}'
                and
                    share_source not in ('ALL')
                and
                    share_type not in ('ALL')
                and
                    day_type=${query.day_type}
                and
                    share_platform=?
                ${str}
                order by share_num desc
                limit ?,?`;

            return {
                sql,
                params: [share_platform, offset, limit]
            };
        },
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["667"]);
        },
        excel_export : true,
        flexible_btn : [
            {
                content: '<a href="javascript:void(0)">导出</a>',
                preMethods: ['excel_export']
            }
        ],
        filter(data, query, dates, type) {
            return filter.indexFive(data, query, dates, type);
        },
        rows : [
            ["top", "share_type", "name", "share_num", "share_user", "share_succeed_num",
                "share_succeed_user", "share_links_num", "share_links_user", "rate"]
        ],
        cols : [
            [
                {
                    caption: "序号",
                    type: "number"
                },
                {
                    caption: "分享类型",
                    type: "string"
                },
                {
                    caption: "分享类型ID/名称",
                    type: "string"
                },
                {
                    caption: "分享次数",
                    type: "number"
                },
                {
                    caption: "分享人数",
                    type: "number"
                },
                {
                    caption: "分享成功次数",
                    type: "number"
                },
                {
                    caption: "分享成功人数",
                    type: "number"
                },
                {
                    caption: "分享链接点击量",
                    type: "number"
                },
                {
                    caption: "分享链接点击人数",
                    type: "number"
                },
                {
                    caption: "分享回流率",
                    type: "string"
                }
            ]
        ]
    });

    return Router;
};