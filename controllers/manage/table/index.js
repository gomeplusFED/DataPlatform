/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 我的报表
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/table"),
    filter2 = require("../../../filters/socialAnalysis/topicData"),
    orm = require("orm"),
    _ = require("lodash"),
    util= require("../../../utils");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/socialAnalysis/tableOne",
        modelName : ["GroupReport", "SocialCategory"],
        // paging : [true, false],
        platform : false,
        date_picker_data: 1,
        showDayUnit : true,
        excel_export : true,
        procedure : [
            {
                find : "params",
                // offset : "offset",
                // limit : "limit",
                order : ["category_id_1"],
                run : ""
            }/*,{
                count : ""
            }*/
        ],
        params(query , params , data){
            if(query.filter_key2 == "one"){
                params.category_id_2 = "ALL";
            }else{
                params.category_id_2 = orm.not_in(["ALL"]);
            }

            return params;
        },
        secondParams(query, params, data) {
            if(query.filter_key2 == "one"){
                return {"pid":""}
            }else{
                return {};
            }
        },
        filter_select: [
            {
                title: '报表类型',
                filter_key: 'filter_key',
                groups: [{
                    key: 'social',
                    value: '社交圈子'
                }]
            },
            {
                title: "分类切换",
                filter_key: "filter_key2",
                groups: [
                    {
                        key : "two",
                        value:"二级分类"
                    },
                    {
                        key : "one",
                        value:"一级分类"
                    }
                ]
            }
        ],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates, type) {
            return filter.tableOne(data, query);
        }
    });


    //热门话题排行TOP100    
    Router = new api(Router,{
        router : "/socialAnalysis/topic_ReportOne",
        modelName : [ "SocialTopicList" , "Statistics", "SocialCategory" ],
        platform : false,
        paging : [true, false, false],
        date_picker_data: 1,
        showDayUnit: true,
        // control_table_col : true,
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
                   key: ['APP', "WAP", "PC"],
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
            return filter2.topicsSix(data, query);
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
                "reply_num", "reply_user_num", "topic_rate", "new_topic_like_num",
                "topic_praise_num", "new_topic_save_num", "topic_collect_num", "new_topic_share_num"
            ]
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
            }/*, {
                caption: "详情"
            }*/]
        ]
    });













    return Router;
};