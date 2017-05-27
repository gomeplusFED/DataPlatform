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
                            title: '明细表',
                            group: [4]
                        },
                        {
                            title: '统计表',
                            group: [0,1,2,3]
                        },
                    ],
                    radios: [
                        {
                            title: '客户端',
                            key: 'type',
                            value: 'all',
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
                            value: 'all',
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
        modelName : [ "ads2_soc_topic_statistics" ],
        platform : false,
        params(query, params) {
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
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                },
                {
                    caption: "",
                    type: ""
                }
            ]
        ]
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsThree",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/socialAnalysisCategories",
        toggle : {
            show : true
        },
        params(query, params) {
            params.category_id = query.category_id || "ALL";
            if(params.category_id === "all") {
                params.category_id = "ALL";
            }

            return params;
        },
        procedure : [{
            aggregate : {
                value : ["date"]
            },
            sum : ["new_topic_num", "delete_topic_num", "new_topic_reply_num",
                "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
                "new_topic_share_num", "is_item_topic_num", "is_vedio_topic_num"],
            groupBy : ["-date"],
            get : ""
        }],
        filter_select: [
            {
               title: '平台选择',
               filter_key: 'type',
               groups: [{
                   key: 'ALL',
                   value: '全部平台'
               },{
                   key: 'APP',
                   value: 'APP'
               },{
                   key: 'WAP',
                   value: 'WAP'
               },{
                   key: 'PC',
                   value: 'PC'
               }]
            },
            {
                title: "指标",
                filter_key: "filter_key",
                groups: [{
                    key: "new_topic_num",
                    value:"新增话题数"
                }, 
                {
                    key: "is_item_topic_num",
                    value: "新增带商品话题数"
                },
                {
                    key: "is_vedio_topic_num",
                    value: "新增带视频话题数"
                },

                {
                    key: "delete_topic_num",
                    value:"删除话题数"
                }, {
                    key: "new_topic_reply_num",
                    value:"新增回复数"
                }, {
                    key: "delete_topic_reply_num",
                    value:"删除回复数"
                }, {
                    key: "new_topic_like_num",
                    value:"新增点赞数"
                }, {
                    key: "new_topic_save_num",
                    value:"新增收藏数"
                }, {
                    key: "new_topic_share_num",
                    value:"新增分享数"
                }]
            }
        ],
        filter(data, query, dates, type) {
            return filter.topicsThree(data, query, dates);
        }
    });

    //一级圈子分类
    let topicsFour = {
        title: '指标选择',
        filter_key: 'filter_key',
        groups: [{
            key: 'new_topic_num',
            value: '话题'
        }, {
            key: 'new_topic_reply_num',
            value: '回复'
        }, {
            key: 'new_topic_like_num',
            value: '点赞'
        }, {
            key: 'new_topic_save_num',
            value: '收藏'
        }, {
            key: 'new_topic_share_num',
            value: '分享'
        }]
    };
    let Type = {
        title: "平台选择",
        filter_key : 'type',
        groups: [{
           key: 'ALL',
           value: '全部平台'
        },{
           key: 'APP',
           value: 'APP'
        },{
           key: 'WAP',
           value: 'WAP'
        },{
           key: 'PC',
           value: 'PC'
        }]
    };


    Router.get("/socialAnalysis/topicsFour_json" , (req , res , next) => {
        let query = req.query;
        req.models.SocialCategory.find({pid:""} , (err , data) => {
            let Result = {};
            for(let item of data){
                Result[item.id] = item.name;
            }

            req.models.SocialTopicStatistics.find({
                category_id : Object.keys(Result),
                date        : orm.between(query.startTime , query.endTime),
                day_type    : query.day_type,
                ver         : 0,
                channel     : 0,
                type        : query.type || "all"
            } , (err , result)=>{
                let newData = {};
                for(let key in Result){
                    newData[Result[key]] = { value:0 }
                }

                for(let item of result){
                    newData[Result[item.category_id]].value += item[query.filter_key];
                }

                let str;
                for(let item of topicsFour.groups){
                    if(item.key == query.filter_key){
                        str = item.value;
                    }
                }

                let Return = {
                    type : "pie",
                    map : {value : str},
                    data : newData,
                    config: {
                        stack: false
                    }
                };
                res.json({
                    code: 200,
                    modelData: [Return],
                    components: {
                        date_picker:{
                            show: true, 
                            defaultData: 7,
                            name : "startTime",
                            endname: "endTime"
                        },
                        filter_select: [Type , topicsFour]
                    }
                });
            });
        });
    });

    
    //二级圈子类型分布
    Router.get("/socialAnalysis/topicsFive_json" , (req , res , next) => {
        let query = req.query;
        if(query.category_use_id == undefined){
            req.models.SocialCategory.find({pid:""} , (err , data) => {
                let LevelOne = {
                    title: "一级分类",
                    filter_key : 'category_use_id',
                    groups: []
                };
                for(let item of data){
                    LevelOne.groups.push({
                        key : item.id,
                        value:item.name
                    });
                }
                res.json({
                    code: 200,
                    modelData: [],
                    components: {
                        date_picker:{
                            show: true, 
                            defaultData: 7,
                            name : "startTime",
                            endname: "endTime"
                        },
                        filter_select: [Type , topicsFour , LevelOne]
                    }
                });
            });
        }else{
            req.models.SocialCategory.find({pid:query.category_use_id} , (err , data) => {
                let CategoryResult = {};
                for(let item of data){
                    CategoryResult[item.id] = item.name;
                }
                req.models.SocialTopicStatistics.find({
                    category_id : Object.keys(CategoryResult),
                    date        : orm.between(query.startTime , query.endTime),
                    day_type    : query.day_type,
                    ver         : 0,
                    channel     : 0,
                    type        : query.type || "all"
                } , (err , result) => {
                    let newData = {};
                    for(let key in CategoryResult){
                        newData[CategoryResult[key]] = { value:0 }
                    }

                    for(let item of result){
                        newData[CategoryResult[item.category_id]].value += item[query.filter_key];
                    }

                    let str;
                    for(let item of topicsFour.groups){
                        if(item.key == query.filter_key){
                            str = item.value;
                        }
                    }

                    let Return = {
                        type : "pie",
                        map : {value : str},
                        data : newData,
                        config: {
                            stack: false
                        }
                    };
                    res.json({
                        code: 200,
                        modelData: [Return]
                    });
                });
            });
        }
    });

    
    //热门话题排行TOP100    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsSix",
        modelName : [ "SocialTopicList" , "Statistics", "SocialCategory" ],
        platform : false,
        paging : [true, false, false],
        date_picker_data: 1,
        showDayUnit: true,
        control_table_col : true,
        search : {
            show : true,
            title: "请输入话题ID",
            key  : "topic_id"
        },
        secondParams(query, params, data) {
            var now = new Date().getTime(),
                date = util.moment(new Date(now - 24 * 60 * 60 * 1000)),
                topic_ids = _.uniq(_.pluck(data.first.data, "topic_id"));

            return {
                topic_id : topic_ids,
                date : date,
                key : ["topic_reply_num", "topic_praise_num", "topic_subreply_user_num",
                    "topic_reply_user_num", "topic_subreply_num", "topic_collect_num"]
            };
        },
        thirdParams(query, params, data) {
            return {};
        },
        // procedure : [false, {
        //     aggregate : {
        //         value : ["topic_id", "key"]
        //     },
        //     sum : ["value"],
        //     groupBy : ["key"],
        //     get : ""
        // }, false],
        firstSql(query, params, isCount) {
            let keys = [query.startTime, query.endTime, query.day_type, query.type];
            let where = ["date BETWEEN ? AND ?", "day_type=?", "type=?"];
            if(query.topic_id) {
                keys.push(query.topic_id);
                where.push("topic_id=?");
            }
            if(isCount) {
                let sql = `SELECT COUNT(*) count FROM ads2_soc_topic_list WHERE ${where.join(" AND ")} ORDER BY ${query.filter_key} DESC`;
                return {
                    sql : sql,
                    params : keys
                };
            } else {
                let offset;
                if(query.from) {
                    offset = +query.from - 1;
                } else {
                    offset = (query.page - 1) * query.limit;
                }
                let limit = +query.to || query.limit;
                let sql = `SELECT * FROM ads2_soc_topic_list WHERE ${where.join(" AND ")} ORDER BY ${query.filter_key} DESC LIMIT ${offset},${limit}`;
                return {
                    sql : sql,
                    params : keys.concat(offset, limit)
                };
            }
        },
        filter_select: [
            {
               title: '',
               filter_key: 'type',
               groups: [{
                   key: "ALL",
                   value: '全部'
               }, {
                   key: 'APP',
                   value: 'APP'
               }, {
                   key: 'WAP',
                   value: 'WAP'
               }, {
                   key: 'PC',
                   value: 'PC'
               }]
            },
            {
                title: '排行',
                filter_key: 'filter_key',
                groups: [{
                    key: 'PV',
                    value: 'PV'
                }, {
                    key: 'new_topic_like_num',
                    value: '新增点赞数'
                }, {
                    key: 'new_topic_save_num',
                    value: '新增收藏数'
                }, {
                    key: 'new_topic_share_num',
                    value: '新增分享数'
                }]
            }
        ],
        filter(data, query) {
            return filter.topicsSix(data, query);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "top", "topic_name", "topic_id", "group_name", "category_id_1",
                "category_id_2", "PV", "UV", "publisher_id",
                // "publisher_name",
                "new_topic_reply_num", "new_topic_reply_user_num",
                //"rate",
                "reply_num", "reply_user_num", "topic_rate", "new_topic_like_num",
                "topic_praise_num", "new_topic_save_num", "topic_collect_num", "new_topic_share_num",
                "operating"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "话题名称",
                type: "string"
            }, {
                caption: "话题ID",
                type: "string"
            }, {
                caption: "归属圈子名称",
                type: "string"
            }, {
                caption: "一级分类",
                type: "string"
            }, {
                caption: "二级分类",
                type: "string"
            }, {
                caption: "PV",
                type: "number"
            }, {
                caption: "UV",
                type: "number"
            }, {
                caption: "发布人ID",
                type: 'string'
            // }, {
            //     caption: "发布人名称",
            //     type: 'string'
            }, {
                caption: "新增回复数",
                type: 'number',
                help : "新增的回复数"
            }, {
                caption: "新增回复人数",
                type: 'number'
            //}, {
            //    caption: "回复率",
            //    type: 'string',
            //    help : "回复用户数/点击用户数"
            }, {
                caption: "累计回复次数",
                type: 'number'
            }, {
                caption: "累计回复人数",
                type: 'number'
            }, {
                caption: "人均回复量",
                type: 'number',
                help : "话题回复量/话题回复人数"
            }, {
                caption: "新增点赞数",
                type: 'number'
            }, {
                caption: "累计点赞数",
                type: 'number',
                help : "话题被点赞的量"
            }, {
                caption: "新增收藏数",
                type: 'number'
            }, {
                caption: "累计收藏数",
                type: 'number',
                help : "话题被收藏的量"
            }, {
                caption: "新增分享数",
                type: 'number'
            }, {
                caption: "详情"
            }]
        ]
    });

    return Router;
};