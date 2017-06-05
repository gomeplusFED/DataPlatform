/**
 * @author Hao Sun
 * @date 20160511 , 
 * @fileoverview 话题数据
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    _ = require("lodash"),
    util = require("../../../utils"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/topicData"),
    topicsTwo = ["new_topic_num", 
        "new_pv",
        "is_item_topic_num",
        "is_vedio_topic_num",
        "delete_topic_num", "new_topic_reply_num",
        "new_topic_reply_user_num", "delete_topic_reply_num",
        "new_topic_like_num", "new_topic_save_num", "new_topic_share_num",
        "new_reply_topic_num"];

module.exports = (Router) => {

    Router = Router.get("/socialAnalysis/topicsZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                switch_filter: {
                    show: true,
                    defaultIndex: 0,
                    btns: [
                        {
                            title: '统计表',
                            group: [0,1,2,3]
                        },
                        {
                            title: '明细表',
                            group: [4]
                        },
                    ],
                    radios: [
                        {
                            title: '客户端',
                            key: 'type',
                            value: 'all,pc,wap,android,ios',
                            group: [
                                {
                                    title: '全站',
                                    key: 'all,pc,wap,android,ios'
                                },
                                {
                                    title: 'PC',
                                    key: 'all,pc'
                                },
                                {
                                    title: 'WAP',
                                    key: 'all,wap'
                                },
                                {
                                    title: 'APP',
                                    key: "all,android,ios"
                                }
                            ]
                        },
                        {
                            title: '用户标签',
                            key: 'expert_type',
                            value: '平台达人,签约达人,普通用户',
                            group: [
                                {
                                    title: '全站',
                                    key: '平台达人,签约达人,普通用户'
                                },
                                {
                                    title: '平台达人创建',
                                    key: '平台达人'
                                },
                                {
                                    title: '签约达人创建',
                                    key: '签约达人'
                                },
                                {
                                    title: '普通用户创建',
                                    key: '普通用户'
                                }
                            ]
                        }
                    ]
                }
            }
        });
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsTwo",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        params(query, params) {
            params.type = params.type || "all,pc,wap,android,ios";
            params.expert_type = params.expert_type || "平台达人,签约达人,普通用户";
            params.type = params.type.split(",");
            params.expert_type = params.expert_type.split(",");
            params.category_id = "all";

            return params;
        },
        filter(data, query, dates, type) {
            return filter.topicsTwo(data);
        },
        rows : [
            ["type", "new_topic_num", "is_item_topic_num", "is_vedio_topic_num", "delete_topic_num",
                "new_uv", "new_pv", "new_topic_reply_num", "new_topic_reply_user_num",
                "delete_topic_reply_num", "rate", "new_topic_share_num"]
        ],
        cols : [
            [
                {
                    caption: "平台",
                    type: "string"
                },
                {
                    caption: "新增话题数",
                    type: "number"
                },
                {
                    caption: "新增带商品话题数",
                    type: "number"
                },
                {
                    caption: "新增带视频话题数",
                    type: "number"
                },
                {
                    caption: "删除话题数",
                    type: "number"
                },
                {
                    caption: "UV",
                    type: "number"
                },
                {
                    caption: "PV",
                    type: "number"
                },
                {
                    caption: "新增回复数",
                    type: "number"
                },
                {
                    caption: "新增回复人数",
                    type: "number"
                },
                {
                    caption: "删除回复数",
                    type: "number"
                },
                {
                    caption: "新增话题回复率",
                    type: "string"
                },
                {
                    caption: "新增分享数",
                    type: "number"
                }
            ]
        ]
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsThree",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        toggle : {
            show : true
        },
        firstSql(query, params) {
            params.type = params.type || "all,pc,wap,android,ios";
            params.expert_type = params.expert_type || "平台达人,签约达人,普通用户";
            const type = params.type.split(",");
            const expert_type = params.expert_type.split(",");
            const sql = `select 
                    date,
                    sum(new_topic_num) as new_topic_num,
                    sum(new_pv) as new_pv,
                    sum(is_item_topic_num) as is_item_topic_num,
                    sum(is_vedio_topic_num) as is_vedio_topic_num,
                    sum(delete_topic_num) as delete_topic_num,
                    sum(new_topic_reply_num) as new_topic_reply_num,
                    sum(delete_topic_reply_num) as delete_topic_reply_num,
                    sum(new_topic_like_num) as new_topic_like_num,
                    sum(new_topic_save_num) as new_topic_save_num,
                    sum(new_topic_share_num) as new_topic_share_num
                from
                    ads2_soc_topic_statistics
                where
                    date between '${query.startTime}' and '${query.endTime}' 
                and
                    day_type=1
                and
                    category_id='all'
                and
                    expert_type in ('${expert_type.join("','")}')
                and
                    type in ('${type.join("','")}')
                group by date
                order by date`;

            return {
                sql,
                params: [expert_type, type]
            };
        },
        filter(data, query, dates, type) {
            return filter.topicsThree(data, query, dates, type);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsFour",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        toggle : {
            show : true
        },
        firstSql(query, params) {
            params.type = params.type || "all,pc,wap,android,ios";
            params.expert_type = params.expert_type || "平台达人,签约达人,普通用户";
            const filter_type = query.filter_type || "0";
            const category = filter_type.split(",");
            const type = params.type.split(",");
            const expert_type = params.expert_type.split(",");
            const sql = `select 
                    category_id,
                    sum(new_topic_num) as new_topic_num,
                    sum(new_topic_reply_num) as new_topic_reply_num,
                    sum(new_topic_like_num) as new_topic_like_num,
                    sum(new_topic_save_num) as new_topic_save_num,
                    sum(new_topic_share_num) as new_topic_share_num
                from
                    ads2_soc_topic_statistics
                where
                    date between '${query.startTime}' and '${query.endTime}' 
                and
                    day_type=1
                and
                    category_id in ('${category.join("','")}')
                and
                    expert_type in ('${expert_type.join("','")}')
                and
                    type in ('${type.join("','")}')
                group by category_id`;

            return {
                sql,
                params: []
            };
        },
        selectFilter(req, cb) {
            req.models.SocialCategory.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    req.query.filter_data = data;
                    const config = {};
                    for(let item of data) {
                        if(item.categorylevel == 1) {
                            config[item.id] = {
                                name: item.name,
                                value: []
                            };
                        } else {
                            config[item.pid].value.push(item.id);
                        }
                    }
                    var filter_select = [];
                    filter_select.push({
                        title: '指标选择',
                        filter_key: 'filter_key',
                        groups : [
                            {
                                key: "new_topic_num",
                                value: "新增话题"
                            },
                            {
                                key: "new_topic_reply_num",
                                value: "回复"
                            },
                            {
                                key: "new_topic_like_num",
                                value: "点赞"
                            },
                            {
                                key: "new_topic_save_num",
                                value: "收藏"
                            },
                            {
                                key: "new_topic_share_num",
                                value: "分享"
                            },
                        ]
                    });
                    filter_select.push({
                        title: '一级圈子',
                        filter_key: 'filter_type',
                        groups : [{
                            key: Object.keys(config).join(","),
                            value: "不限"
                        }]
                    });
                    for(let key in config) {
                        filter_select[1].groups.push({
                            key: config[key].value.join(","),
                            value: config[key].name
                        });
                    }
                    cb(null, filter_select);
                }
            });
        },
        filter(data, query, dates, type) {
            const filter_select = this.filter_select[0].groups;
            return filter.topicsFour(data, query, dates, type, filter_select);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsFive",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        toggle : {
            show : true
        },
        firstSql(query, params) {
            params.type = params.type || "all,pc,wap,android,ios";
            params.expert_type = params.expert_type || "平台达人,签约达人,普通用户";
            const filter_key = query.filter_key || "0";
            //是否是一级类目
            const isOne = filter_key.indexOf("-") > -1;
            const category = filter_key.split(",");
            const type = params.type.split(",");
            const expert_type = params.expert_type.split(",");
            const sql = `select 
                    category_id,
                    sum(new_pv) as new_pv,
                    sum(new_uv) as new_uv
                from
                    ads2_soc_topic_statistics
                where
                    date between '${query.startTime}' and '${query.endTime}' 
                and
                    day_type=1
                and
                    category_id in ('${category.join("','")}')
                and
                    expert_type in ('${expert_type.join("','")}')
                and
                    type in ('${type.join("','")}')
                group by category_id
                order by new_pv desc, new_uv desc
                ${isOne ? "" : "limit 0,15"}`;

            return {
                sql,
                params: []
            };
        },
        selectFilter(req, cb) {
            req.models.SocialCategory.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    req.query.filter_data = data;
                    //一级类型
                    const one = [];
                    //二级类型
                    const two = [];
                    for(let item of data) {
                        if(item.categorylevel == 1) {
                            one.push(item.id);
                        } else {
                            two.push(item.id);
                        }
                    }
                    var filter_select = [];
                    filter_select.push({
                        title: '',
                        filter_key: 'filter_key',
                        groups : [
                            {
                                key: one.join(","),
                                value: "一级圈子"
                            },
                            {
                               key: two.join(","),
                                value: "二级圈子"
                            }]
                    });
                    cb(null, filter_select);
                }
            });
        },
        filter(data, query, dates, type) {
            return filter.topicsFive(data, query, dates, type);
        }
    });
    
    //热门话题排行TOP100    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsSix",
        modelName : [ "SocialTopicList" , "Statistics" ],
        platform : false,
        paging : [true, false, false],
        // date_picker_data: 1,
        // showDayUnit: true,
        control_table_col : true,
        control_table_col_default: {
            5: false,
            6: false,
            10: false,
            11: false,
            12: false,
            13: false,
            14: false,
            16: false,
            18: false
        },
        search : {
            show : true,
            title: "搜索: ",
            key  : "topic_id"
        },
        selectFilter(req, cb) {
            req.models.SocialCategory.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    req.query.filter_data = data;
                    const config = {};
                    //一级分类
                    const one = [];
                    //二级分类
                    const two = [];
                    for(let item of data) {
                        if(item.categorylevel == 1) {
                            config[item.id] = {
                                name: item.name,
                                value: []
                            };
                            one.push(item.id);
                        } else {
                            config[item.pid].value.push({
                                key: item.id,
                                value: item.name
                            });
                            two.push(item.id);
                        }
                    }
                    var filter_select = [];
                    filter_select.push({
                        title: '一级圈子',
                        filter_key: 'category_id_1',
                        groups : [{
                            key: one.join(","),
                            value: "不限",
                            cell: {
                                title: '二级圈子',
                                filter_key : 'category_id_2',
                                groups : [{
                                    key: two.join(","),
                                    value: '不限'
                                }]
                            }
                        }]
                    });
                    for(let key in config) {
                        let obj = {
                            key: config[key].value.map((x) => {
                                return x.key;
                            }).join(','),
                            value: "全部"
                        };
                        filter_select[0].groups.push({
                            key: key,
                            value: config[key].name,
                            cell: {
                                title: '二级圈子',
                                filter_key : 'category_id_2',
                                groups : [obj].concat(config[key].value)
                            }
                        });
                    }
                    filter_select.push({
                        title: '排序',
                        filter_key: 'filter_key',
                        groups : [
                            {
                                key: "PV",
                                value: "PV"
                            },
                            {
                                key: "new_topic_reply_num",
                                value: "回复"
                            },
                            {
                                key: "new_topic_onereply_num",
                                value: "一级回复"
                            },
                            {
                                key: "new_topic_subreply_num",
                                value: "二级回复"
                            },
                            {
                                key: "new_topic_like_num",
                                value: "点赞"
                            },
                            {
                                key: "new_topic_save_num",
                                value: "收藏"
                            },
                            {
                                key: "new_topic_share_num",
                                value: "分享"
                            }
                        ]
                    });
                    cb(null, filter_select);
                }
            });
        },
        secondParams(query, params, data) {
            var now = new Date().getTime(),
                date = util.moment(new Date(now - 24 * 60 * 60 * 1000)),
                topic_ids = _.uniq(_.pluck(data.first.data, "topic_id"));

            return {
                topic_id : topic_ids,
                date : date,
                key : ["topic_reply_num", "topic_subreply_num", "topic_praise_num", "topic_collect_num",
                    "topic_reply_user_num", "topic_subreply_user_num"]
            };
        },
        firstSql(query, params, isCount) {
            const topic_id = query.topic_id;
            //搜索sql
            const search = `${topic_id? " and topic_id='" + topic_id + "' or topic_name like '%" + topic_id + "%' or publisher_id='" + topic_id + "'" : ""}`;
            params.type = params.type || "all,pc,wap,android,ios";
            params.expert_type = params.expert_type || "平台达人,签约达人,普通用户";
            const filter_key = query.filter_key || "pv";
            const type = params.type.split(",");
            const expert_type = params.expert_type.split(",");
            const category_id_1 = (query.category_id_1 || "0").split(",");
            const category_id_2 = (query.category_id_2 || "0").split(",");
            if(isCount) {
                const sql = `select
                        count(*) total
                    from (
                    select
                        *
                    from
                        ads2_soc_topic_list
                    where
                        date between '${query.startTime || util.moment(Date.now())}' and '${query.endTime || util.moment(Date.now())}'
                    and
                        day_type=${query.day_type || 1}
                    and
                        expert_type in ('${expert_type.join("','")}')
                    and
                        type in ('${type.join("','")}')
                    and
                        category_id_1 in ('${category_id_1.join("','")}')
                    and
                        category_id_2 in ('${category_id_2.join("','")}')
                    ${search}
                    group by topic_id) a`;

                return {
                    sql,
                    params: []
                };
            }
            else {
                const page = query.page || 1;
                let limit = +query.limit || 20;
                let offset = (page - 1) * limit;
                if(params.from) {
                    offset = params.from - 1;
                }
                const sql = `select
                        topic_name,
                        topic_id,
                        group_name,
                        publisher_id,
                        category_id_1,
                        category_id_2,
                        sum(UV) as UV,
                        sum(PV) as PV,
                        sum(new_topic_reply_num) as new_topic_reply_num,
                        sum(new_topic_reply_user_num) as new_topic_reply_user_num,
                        sum(new_topic_onereply_num) as new_topic_onereply_num,
                        sum(new_topic_subreply_num) as new_topic_subreply_num,
                        sum(new_topic_like_num) as new_topic_like_num,
                        sum(new_topic_save_num) as new_topic_save_num,
                        sum(new_topic_share_num) as new_topic_share_num
                    from
                        ads2_soc_topic_list
                    where
                        date between '${query.startTime || util.moment(Date.now())}' and '${query.endTime || util.moment(Date.now())}'
                    and
                        day_type=${query.day_type || 1}
                    and
                        expert_type in ('${expert_type.join("','")}')
                    and
                        type in ('${type.join("','")}')
                    and
                        category_id_1 in ('${category_id_1.join("','")}')
                    and
                        category_id_2 in ('${category_id_2.join("','")}')
                    ${search}
                    group by topic_id
                    order by ${filter_key} desc
                    limit ?,?
                    `;
                if(params.to) {
                    limit = +params.to;
                }

                return {
                    sql,
                    params: [offset, limit]
                };
            }
        },
        filter(data, query) {
            return filter.topicsSix(data, query);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            ["top", "topic_name", "topic_id", "group_name", "publisher_id", "category_id_1", "category_id_2",
                "UV", "PV", "new_topic_reply_num", "new_topic_reply_user_num", "new_topic_onereply_num",
                "new_topic_subreply_num", "topic_reply_num", "rate", "new_topic_like_num", "topic_praise_num",
                "new_topic_save_num", "topic_collect_num", "new_topic_share_num", "operating"]
        ],
        cols: [[
            {
                caption: "排名",
                type: "number"
            },
            {
                caption: "话题名称",
                type: "string"
            },
            {
                caption: "话题ID",
                type: "string"
            },
            {
                caption: "归属圈子名称",
                type: "string"
            },
            {
                caption: "发布人ID",
                type: "string"
            },
            {
                caption: "圈子一级分类",
                type: "string"
            },
            {
                caption: "圈子二级分类",
                type: "string"
            },
            {
                caption: "uv",
                type: "number"
            },
            {
                caption: "pv",
                type: "number"
            },
            {
                caption: "新增回复数",
                type: "number"
            },
            {
                caption: "新增回复人数",
                type: "number"
            },
            {
                caption: "一级回复数",
                type: "number"
            },
            {
                caption: "二级回复数",
                type: "number"
            },
            {
                caption: "当前回复数",
                type: "number"
            },
            {
                caption: "人均回复量",
                type: "string"
            },
            {
                caption: "新增点赞数",
                type: "number"
            },
            {
                caption: "当前点赞数",
                type: "number"
            },
            {
                caption: "新增收藏数",
                type: "number"
            },
            {
                caption: "当前收藏数",
                type: "number"
            },
            {
                caption: "新增分享数",
                type: "number"
            },
            {
                caption: "话题详情",
                type: "string"
            }
        ]]
    });

    return Router;
};