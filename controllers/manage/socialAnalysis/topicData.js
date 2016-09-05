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
    topicsTwo = ["new_topic_num", "delete_topic_num", "new_topic_reply_num",
        "new_topic_reply_user_num", "delete_topic_reply_num",
        "new_topic_like_num", "new_topic_save_num", "new_topic_share_num",
        "new_reply_topic_num"];

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/socialAnalysis/topicsOne",
        modelName : ["Statistics"],
        platform : false,
        date_picker: false,
        //date_picker_data: 1,
        params(query, params, data) {
            var now = new Date().getTime(),
                date = util.getDate(new Date(now - 24 * 60 * 60 * 1000));

            return {
                date : orm.between(date + " 00:00:00", date + " 23:59:59"),
                key : ["all_topic_num", "all_topic_reply_num", "all_topic_subReply_num", "all_praise_num"]
            };
        },
        procedure : [{
            aggregate : {
                value : ["key"]
            },
            sum : ["value"],
            groupBy : ["key"],
            get : ""
        }],
        filter(data) {
            return filter.topicsOne(data);
        },
        /*flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/helpTwo_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],*/
        rows: [
            ["all_topic_num", "all", "all_praise_num"]
        ],
        cols: [
            [{
                caption: "累计话题数",
                type: "number",
                help : "累计话题数"
            }, {
                caption: "累计回复次数",
                type: "number"
            //}, {
            //    caption: "话题回复率", // = 被回复的话题数 / 话题数
            //    type: "string",
            //    help : "被回复的话题数/话题数"
            }, {
                caption: "累计点赞数",
                type: "number"
            //}, {
            //    caption: "累计收藏数",
            //    type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsTwo",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        procedure : [{
            aggregate : {
                value : topicsTwo.concat(["type"])
            },
            sum : topicsTwo,
            groupBy : ["type"],
            get : ""
        }],
        filter(data, query, dates, type) {
            return filter.topicsTwo(data);
        },
        rows : [
            ["type" , "new_topic_num", "delete_topic_num", "new_topic_reply_num",
                "new_topic_reply_user_num", "delete_topic_reply_num", "rate",
                "new_topic_like_num", "new_topic_save_num", "new_topic_share_num"]
        ],
        cols : [
            [{
                caption: "平台",
                type: "string"
            },{
                caption: "新增话题数",
                type: "number",
                help : "新增的话题数"
            },{
                caption: "删除话题数",
                type: "number"
            },{
                caption: "新增回复数",
                type: "number",
                help : "新增的回复数"
            },{
                caption: "新增回复人数",
                type: "number"
            },{
                caption: "删除回复数",
                type: "number"
            },{
                caption: "新增话题回复率",
                type: "number",
                help : "被回复的新增话题数 / 新增话题数"
            },{
                caption: "新增点赞数",
                type: "number"
            },{
                caption: "新增收藏数",
                type: "number"
            },{
                caption: "新增分享数",
                type: "number"
            }]
        ]
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsThree",
        modelName : [ "SocialTopicStatistics" ],
        platform : false,
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/socialAnalysisCategories",
        procedure : [{
            aggregate : {
                value : ["date"]
            },
            sum : ["new_topic_num", "delete_topic_num", "new_topic_reply_num",
                "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
                "new_topic_share_num"],
            groupBy : ["date"],
            get : ""
        }],
        filter_select: [
            //{
            //    title: '平台选择',
            //    filter_key: 'type',
            //    groups: [{
            //        key: ['APP','WAP','PC'],
            //        value: '全部平台'
            //    },{
            //        key: 'APP',
            //        value: 'APP'
            //    },{
            //        key: 'WAP',
            //        value: 'WAP'
            //    },{
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
            {
                title: "指标",
                filter_key: "filter_key",
                groups: [{
                    key: "new_topic_num",
                    value:"新增话题数"
                }, {
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
            return filter.topicsThree(data, query.filter_key, dates);
        }
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsFour",
        modelName : [ "SocialTopicCategoryDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, sendData) {
            return {
                pid : ""
            }
        },
        procedure : [{
            aggregate : {
                value : ["category_id"]
            },
            sum : ["new_topic_num", "new_topic_reply_num", "new_topic_like_num",
                "new_topic_save_num", "new_topic_share_num"],
            groupBy : ["category_id"],
            get : ""
        }, false],
        fixedParams(req, query, cb) {
            var group_type = [];
            req.models.SocialCategory.find({
                pid : ""   //没有pid的数据级为一级类目
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.category_id = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            //{
            //    title: "平台选择",
            //    filter_key : 'type',
            //    groups: [{
            //        key: ['APP','WAP','PC'],
            //        value: '全部平台'
            //    },{
            //        key: 'APP',
            //        value: 'APP'
            //    },{
            //        key: 'WAP',
            //        value: 'WAP'
            //    },{
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
            {
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
            }
        ],
        filter(data, query, dates, type) {
            return filter.topicsFour(data, query.filter_key);
        }
    });

    //二级圈子类型分布
    Router = new api(Router,{
        router : "/socialAnalysis/topicsFive",
        modelName : [ "SocialTopicCategoryDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, sendData) {
            return {};
        },
        procedure : [{
            aggregate : {
                value : ["category_id"]
            },
            sum : ["new_topic_num", "new_topic_reply_num", "new_topic_like_num",
                "new_topic_save_num", "new_topic_share_num"],
            groupBy : ["category_id"],
            get : ""
        }, false],
        fixedParams(req, query, cb) {
            //依据选择的一级分类id获取对应的二级列表，保存二级类id至req中
            var filter_key = query.filter_key || "-1";
            var group_type = [];
            req.models.SocialCategory.find({
                pid : filter_key
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.category_id = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        //初始化一级分类选项
        selectFilter(req , cb){
            var filter_select = {
                title : "一级分类",
                filter_key : "filter_key",
                groups : []
            };

            req.models.SocialCategory.find({
                pid : ""
            }, (err , data)=>{
                if(!err){
                    for(var key of data){
                        var obj = {
                            key : key.id,
                            value:key.name
                        };
                        filter_select.groups.push(obj);
                    }
                    cb(null, [filter_select]);
                }else{
                    cb(err);
                }
            });
        },
        filter_select: [
            //{
            //    title: "平台选择",
            //    filter_key : 'type',
            //    groups: [{
            //        key: ['APP','WAP','PC'],
            //        value: '全部平台'
            //    },{
            //        key: 'APP',
            //        value: 'APP'
            //    },{
            //        key: 'WAP',
            //        value: 'WAP'
            //    },{
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
            {
                title: '指标选择',
                filter_key: 'filter_key2',
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
            }
        ],
        filter(data, query, dates, type) {

            return filter.topicsFive(data, query);
        }
    });
    
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
                date = util.getDate(new Date(now - 24 * 60 * 60 * 1000)),
                topic_ids = _.uniq(_.pluck(data, "topic_id"));

            return {
                topic_id : topic_ids,
                date : orm.between(date + " 00:00:00", date + " 23:59:59"),
                key : ["topic_reply_num", "topic_praise_num", "topic_subreply_user_num",
                    "topic_reply_user_num", "topic_subreply_num", "topic_collect_num"]
            };
        },
        thirdParams(query, params, data) {
            return {};
        },
        procedure : [false, {
            aggregate : {
                value : ["topic_id", "key"]
            },
            sum : ["value"],
            groupBy : ["key"],
            get : ""
        }, false],
        firstSql(query, params, isCount) {
            let keys = [query.startTime, query.endTime, query.day_type];
            let where = ["date BETWEEN ? AND ?", "day_type=?"];
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
                let offset = (query.page - 1) * query.limit;
                let limit = query.limit;
                let sql = `SELECT * FROM ads2_soc_topic_list WHERE ${where.join(" AND ")} ORDER BY ${query.filter_key} DESC LIMIT ${offset},${limit}`;
                return {
                    sql : sql,
                    params : keys.concat(offset, limit)
                };
            }
        },
        filter_select: [
            //{
            //    title: '',
            //    filter_key: 'type',
            //    groups: [{
            //        key: ['APP', "WAP", "PC"],
            //        value: '全部'
            //    }, {
            //        key: 'APP',
            //        value: 'APP'
            //    }, {
            //        key: 'WAP',
            //        value: 'WAP'
            //    }, {
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
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
                "category_id_2", "PV", "UV", "publisher_id", "publisher_name",
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
            }, {
                caption: "发布人名称",
                type: 'string'
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