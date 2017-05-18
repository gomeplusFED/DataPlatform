/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/main"),
    orm = require("orm"),
    filter = require("../../../filters/share");

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
        router : "/share/indexOne",
        modelName : ["ads_share_data_analysis_info"],
        platform : false,
        date_picker_data: 1,
        showDayUnit: true,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["71"]);
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
        router : "/share/indexTwo",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour"],
        platform : false,
        toggle : {
            show : true
        },
        firstSql(query, params) {
            let share_platform = query.share_platform ? query.share_platform : this.global_platform.list[0].key;
            const day_type = query.day_type;
            const startIsEnd = query.startTime == query.endTime;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            const sql = `select * 
            from 
                ${startIsEnd ? "ads_share_source_type_hour" : "ads_share_data_analysis_info"}
            where 
                date between '${query.startTime}' and '${query.endTime}'
                ${startIsEnd ? "" : "and product_line='ALL'"}
            and
                share_platform=?
            and
                share_source='ALL'
            and
                share_type='ALL'
            and
                day_type=1
            order by ${startIsEnd ? "hours" : "date"} asc`;

            return {
                sql,
                params: [share_platform]
            };
        },
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["71"]);
        },
        excel_export : true,
        flexible_btn : [
            {
                content: '<a href="javascript:void(0)">导出</a>',
                preMethods: ['excel_export']
            },
            {
                content: '<a href="javascript:void(0)">指标选择</a>',
                preMethods: ['show_filter'],
                customMethods: '',
                max: 2,
                key: 'filter_key',
                groups: [
                    {
                        value: 'filter_test',
                        text: '指标选择',
                        options: [
                            {
                                value: 'share_num',
                                text: '分享次数'
                            },
                            {
                                value: 'share_user',
                                text: '分享人数'
                            },
                            {
                                value: 'share_rate',
                                text: '人均分享次数'
                            },
                            {
                                value: 'share_succeed_num',
                                text: '分享成功次数'
                            },
                            {
                                value: 'share_succeed_user',
                                text: '分享成功人数'
                            },
                            {
                                value: 'success_rate',
                                text: '分享成功率'
                            },
                            {
                                value: 'share_links_num',
                                text: '分享链接点击量'
                            },
                            {
                                value: 'share_links_user',
                                text: '分享链接点击人数'
                            },
                            {
                                value: 'link_rate',
                                text: '分享回流率'
                            }
                        ]
                    }
                ]
            }
        ],
        filter(data, query, dates, type) {
            return filter.indexTwo(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/indexThree",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour", "ads_share_dim_channel"],
        secondParams() {
            return {};
        },
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
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
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        toggle : {
            show : true
        },
        date_picker_data: 1,
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const day_type = query.day_type;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            if(day_type == 1) {
                const sql = `select 
                        share_source,
                        sum(share_num)          as share_num,
                        sum(share_user)         as share_user,
                        sum(share_succeed_num)  as share_succeed_num,
                        sum(share_succeed_user) as share_succeed_user,
                        sum(share_links_num)    as share_links_num,
                        sum(share_links_user)   as share_links_user
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
                    group by share_source`;

                return {
                    sql,
                    params:[share_platform]
                };
            }
            else {
                const sql = `select 
                        share_source,
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
                        share_source not in ('ALL') 
                    and 
                        share_type='ALL'
                    and
                        day_type=${query.day_type}
                    and
                        share_platform=?
                    group by share_source`;

                return {
                    sql,
                    params: [share_platform]
                };
            }
        },
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["71"]);
        },
        filter(data, query, dates, type) {
            return filter.indexThree(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/indexFour",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour", "ads_share_dim_type"],
        secondParams() {
            return {};
        },
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
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
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        toggle : {
            show : true
        },
        date_picker_data: 1,
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const day_type = query.day_type;

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            if(day_type == 1) {
                const sql = `select 
                        share_type,
                        sum(share_num)          as share_num,
                        sum(share_user)         as share_user,
                        sum(share_succeed_num)  as share_succeed_num,
                        sum(share_succeed_user) as share_succeed_user,
                        sum(share_links_num)    as share_links_num,
                        sum(share_links_user)   as share_links_user
                    from 
                        ads_share_source_type_hour 
                    where
                        date='${query.startTime}' 
                    and
                        share_platform=?
                    and
                        share_source='ALL'
                    and
                        share_type not in ('ALL')
                    and
                        day_type=1
                    group by share_type`;

                return {
                    sql,
                    params:[share_platform]
                };
            }
            else {
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

                return {
                    sql,
                    params: [share_platform]
                };
            }
        },
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["71"]);
        },
        filter(data, query, dates, type) {
            return filter.indexFour(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/indexFive",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour"],
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
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
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        toggle : {
            show : true
        },
        date_picker_data: 1,
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["71"]);
        },
        filter(data, query, dates, type) {
            return filter.indexFive(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/operating",
        modelName : ["ShareAnalyzeChannelTrend"],
        platform : false,
        paging : [true],
        params(query, params) {
            let filter_key = query.filter_key;
            if(filter_key === "all") {
                params.share_source_name = "all";
            }
            if(query.share_source === "店铺") {
                params.share_source = "shop";
            }
            if(query.share_source === "商品") {
                params.share_source = "product";
            }
            if(query.share_source === "话题") {
                params.share_source = "topic";
            }
            if(query.share_source === "圈子") {
                params.share_source = "group";
            }
            return params;
        },
        filter(data) {
            return filter.operating(data);
        },
        rows : [
            ["share_channel", "share_time_sum", "share_user_sum", "click_time_sum",
                "click_user_sum", "rate"]
        ],
        cols : [
            [
                {
                    caption : "分享渠道",
                    type : "string"
                },{
                    caption : "分享次数",
                    type : "number"
                },{
                    caption : "分享人数",
                    type : "number"
                },{
                    caption : "点击次数",
                    type : "number"
                },{
                    caption : "点击人数",
                    type : "number"
                },{
                    caption : "分享回流率",
                    type : "string",
                    help : "分享文案中的链接点击次数/分享次数"
                }
            ]
        ]
    });

    return Router;
};