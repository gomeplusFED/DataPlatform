/**
 * @author Xisen He
 * @date 20160812 , 
 * @fileoverview 话题数据，详情页接口
 */

var api = require("../../../base/main"),
    orm = require("orm"),
    util = require("../../../utils"),
    filter = require("../../../filters/socialAnalysis/topicData");

module.exports = (Router) => {
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailOne",
        modelName : ["Statistics"],
        platform : false,
        date_picker : false,
        params(query) {
            let now = new Date().getTime(),
                date = util.getDate(new Date(now - 24 * 60 * 60 * 1000));

            return {
                date : date,
                topic_id : query.topic_id,
                key : ["topic_subreply_num", "topic_reply_num", "topic_praise_num"]
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
        filter(data, filter_key, dates) {
            return filter.topicDetailOne(data);
        },
        rows: [
            ["num", "topic_praise_num"]
        ],
        cols: [
            [{
            //    caption: "话题成员数",
            //    type: "number"
            //}, {
                caption: "累计回复次数",
                type: "number"
            //}, {
            //    caption: "话题回复率",
            //    type: "number"
            }, {
                caption: "累计点赞数",
                type: "number"
            //}, {
            //    caption: "累计收藏数",
            //    type: "number"
            }]
        ]
    });

    //圈子数据统计
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailTwo",
        modelName : ["SocialTopicDetailStatistics"],
        platform : false,
        filter(data) {
            return filter.topicDetailTwo(data);
        },
        procedure : [{
            aggregate : {
                value : ["type"]
            },
            sum : ["new_topic_user_num", "new_topic_reply_num", "new_topic_reply_user_num",
                "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
                "new_topic_share_num"],
            groupBy : ["type"],
            get : ""
        }],
        rows: [
            ["type", "new_topic_user_num", "new_topic_reply_num", "new_topic_reply_user_num",
                "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
                "new_topic_share_num"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "新增成员数",
                type: "number"
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增回复人数",
                type: "number"
            }, {
                caption: "删除回复数",
                type: "number"
            }, {
                caption: "新增点赞数",
                type: "number"
            }, {
                caption: "新增收藏数",
                type: "number"
            }, {
                caption: "新增分享数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailThree",
        modelName : [ "SocialTopicDetailStatistics" ],
        platform : false,
        filter_select : [{
            title: "平台选择",
            filter_key : 'type',
            groups: [{
                key: ['APP','WAP','PC'],
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
        },{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'new_topic_user_num',
                value: '新增成员数'
            },{
                key: 'new_topic_reply_num',
                value: '新增回复数'
            },{
                key: 'new_topic_reply_user_num',
                value: '新增回复人数'
            },{
                key: 'delete_topic_reply_num',
                value: '删除回复数'
            },{
                key: 'new_topic_like_num',
                value: '新增点赞数'
            },{
                key: 'new_topic_save_num',
                value: '新增收藏数'
            },{
                key: 'new_topic_share_num',
                value: '新增分享数'
            }]
        }],
        procedure : [{
            aggregate : {
                value : ["date"]
            },
            sum : ["new_topic_user_num", "new_topic_reply_num", "new_topic_reply_user_num",
                "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
                "new_topic_share_num"],
            groupBy : ["date"],
            get : ""
        }],
        filter(data, query, dates, type) {
            return filter.topicDetailThree(data, query, dates);
        }
    });

    return Router;
};