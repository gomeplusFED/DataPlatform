/**
 * @author yanglei
 * @date 20170503
 * @fileoverview 分享渠道
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/share/channel");

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
        router : "/share/channelOne",
        modelName : ["ads_share_data_analysis_info"],
        platform : false,
        date_picker_data: 1,
        showDayUnit: true,
        selectFilter(req, cb) {
            req.models.ads_share_dim_channel.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [];
                    filter_select.push({
                        title: '渠道选择',
                        filter_key: 'share_source',
                        groups : [{
                            key: "ALL",
                            value: "全部"
                        }]
                    });
                    for(let key of data) {
                        filter_select[0].groups.push({
                            key: key.channel_id,
                            value: key.channel_name
                        });
                    }
                    cb(null, filter_select);
                }
            });
        },
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["667"]);
        },
        params(query, params, data, dates) {
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
        router : "/share/channelTwo",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour", "ads_share_dim_channel"],
        secondParams() {
            return {};
        },
        platform : false,
        toggle : {
            show : true
        },
        firstSql(query, params) {
            let share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            const day_type = query.day_type;
            const startIsEnd = query.startTime === query.endTime;

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
                    share_source not in ('ALL')
                and
                    share_type='ALL'
                and
                    day_type=1
                order by ${startIsEnd ? "hours" : "date"} asc`;

            return {
                sql,
                params:[share_platform]
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
            return filter.indexTwo(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/channelThree",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour", "ads_share_dim_type"],
        secondParams() {
            return {};
        },
        platform : false,
        toggle : {
            show : true
        },
        date_picker_data: 1,
        showDayUnit: true,
        selectFilter(req, cb) {
            req.models.ads_share_dim_channel.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [];
                    filter_select.push({
                        title: '渠道选择',
                        filter_key: 'share_source',
                        groups : [{
                            key: "ALL",
                            value: "全部渠道"
                        }]
                    });
                    for(let key of data) {
                        filter_select[0].groups.push({
                            key: key.channel_id,
                            value: key.channel_name
                        });
                    }
                    filter_select.push({
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
                    });
                    cb(null, filter_select);
                }
            });
        },
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
                    date='${query.endTime}'
                and
                    product_line='ALL' 
                and 
                    share_source='${query.share_source}'
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
            const select_filter = this.filter_select;
            return filter.indexThree(data, query, dates, type, select_filter);
        }
    });

    Router = new api(Router,{
        router : "/share/channelFour",
        modelName : ["ads_share_data_analysis_info/ads_share_source_type_hour"],
        platform : false,
        toggle : {
            show : true
        },
        date_picker_data: 1,
        showDayUnit: true,
        firstSql(query, params) {
            let share_platform = query.share_platform = query.share_platform ? decodeURI(query.share_platform) : this.global_platform.list[0].key;
            let platform = share_platform !== "ALL";
            let sql;
            if(platform) {
                sql = `select 
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
                    date='${query.endTime}'
                and
                    product_line not in ('ALL') 
                and 
                    share_source='${query.share_source}'
                and 
                    share_type='ALL'
                and
                    day_type=${query.day_type}
                and
                    share_platform=?
                group by product_line`;
            }
            else {
                sql = `select 
                    share_platform,
                    sum(share_num)          as share_num,
                    sum(share_user)         as share_user,
                    sum(share_succeed_num)  as share_succeed_num,
                    sum(share_succeed_user) as share_succeed_user,
                    sum(share_links_num)    as share_links_num,
                    sum(share_links_user)   as share_links_user
                from 
                    ads_share_data_analysis_info 
                where 
                    date='${query.endTime}'
                and
                    product_line='ALL' 
                and 
                    share_source='${query.share_source}'
                and 
                    share_type='ALL'
                and
                    day_type=${query.day_type}
                and
                    share_platform != 'ALL'
                group by share_platform`;
            }

            if(share_platform !== "ALL") {
                share_platform += "站";
            }

            return {
                sql,
                params: [share_platform]
            };
        },
        selectFilter(req, cb) {
            req.models.ads_share_dim_channel.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [];
                    filter_select.push({
                        title: '渠道选择',
                        filter_key: 'share_source',
                        groups : [{
                            key: "ALL",
                            value: "全部渠道"
                        }]
                    });
                    for(let key of data) {
                        filter_select[0].groups.push({
                            key: key.channel_id,
                            value: key.channel_name
                        });
                    }
                    filter_select.push({
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
                    });
                    cb(null, filter_select);
                }
            });
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
            return filter.indexFour(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/share/channelFive",
        modelName : ["ads_share_share_type_top", "ads_share_dim_channel", "ads_share_dim_type"],
        secondParams() {
            return {};
        },
        thirdParams() {
            return {};
        },
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
                    date='${query.endTime}'
                and
                    share_type not in ('ALL')
                and
                    share_source${query.share_source === "ALL" ? ' not in ("ALL")' : '="' + query.share_source + '"'}
                and
                    day_type=${query.day_type}
                and
                    share_platform ${share_platform == "ALL" ? "!='ALL'" : "='" + share_platform + "'"}
                ${str}`;

                return {
                    sql,
                    params: []
                };
            }
            const page = query.page || 1;
            let limit = +query.limit || 20;
            let offset = (page - 1) * limit;
            if(params.from) {
                offset = params.from - 1;
            }
            if(params.to) {
                limit = +params.to;
            }
            const sql = `select 
                    share_source,
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
                    share_type not in ('ALL')
                and
                    share_source${query.share_source === "ALL" ? ' not in ("ALL")' : '="' + query.share_source + '"'}
                and
                    day_type=${query.day_type}
                and
                    share_platform ${share_platform == "ALL" ? "!='ALL'" : "='" + share_platform + "'"}
                ${str}
                order by share_num desc
                limit ?,?`;

            return {
                sql,
                params: [offset, limit]
            };
        },
        selectFilter(req, cb) {
            req.models.ads_share_dim_channel.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [];
                    filter_select.push({
                        title: '渠道选择',
                        filter_key: 'share_source',
                        groups : [
                            {
                                key: "ALL",
                                value: "全部"
                            }
                        ]
                    });
                    for(let key of data) {
                        filter_select[0].groups.push({
                            key: key.channel_id,
                            value: key.channel_name
                        });
                    }
                    cb(null, filter_select);
                }
            });
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
            ["top", "share_source", "share_type", "name", "share_num", "share_user", "share_succeed_num",
                "share_succeed_user", "share_links_num", "share_links_user", "rate"]
        ],
        cols : [
            [
                {
                    caption: "序号",
                    type: "number"
                },
                {
                    caption: "分享渠道",
                    type: "string"
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