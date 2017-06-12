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
        modelName : ["SocialTopicDetailStatistics"],
        platform : false,
        firstSql(query, params) {
            const sql = `select
                    type,
                    sum(new_topic_reply_num) as new_topic_reply_num,
                    sum(new_topic_reply_user_num) as new_topic_reply_user_num,
                    sum(delete_topic_reply_num) as delete_topic_reply_num,
                    sum(new_topic_share_num) as new_topic_share_num,
                    sum(new_topic_like_num) as new_topic_like_num,
                    sum(PV) as PV,
                    sum(UV) as UV,
                    sum(delete_topic_reply_user_num) as delete_topic_reply_user_num,
                    sum(new_topic_save_num) as new_topic_save_num
                from
                    ads2_soc_topic_detail_statistics
                where
                    date between '${query.startTime}' and '${query.endTime}'
                and
                    topic_id='${query.topic_id}'
                and
                    day_type=1
                group by type
                `;

            return {
                sql,
                params: []
            };
        },
        filter(data) {
            return filter.topicDetailOne(data);
        },
        rows: [
            ["type",
                "UV", "PV",
                "new_topic_reply_num", "new_topic_reply_user_num", "delete_topic_reply_num",
                "delete_topic_reply_user_num",
                "new_topic_share_num", "new_topic_like_num", "new_topic_save_num"]
        ],
        cols: [
            [
                {
                    caption: "平台"
                },
                {
                    caption: "UV",
                    help: "所选日期内,该话题的浏览用户数"
                },
                {
                    caption: "PV",
                    help: "所选日期内,该话题的浏览量"
                },
                {
                    caption: "新增回复数",
                    help: "所选日期内,该话题新增的回复总数(包含一、二级回复)"
                },
                {
                    caption: "新增回复人数",
                    help: "所选日期内,该话题新增的回复用户数(包含一、二级回复的用户)"
                },
                {
                    caption: "删除回复数",
                    help: "所选日期内,该话题删除的回复总数(包含一、二级回复)"
                },
                {
                    caption: "删除回复人数",
                    help: "所选日期内,该话题删除的回复的用户总数(包含一、二级回复)"
                },
                {
                    caption: "新增分享数",
                    help: "所选日期内,该话题新增的分享总数"
                },
                {
                    caption: "新增点赞数",
                    help: "所选日期内,该话题新增的点赞总数"
                },
                {
                    caption: "新增收藏数",
                    help: "所选日期内,该话题新增的收藏总数"
                }
            ]
        ]
    });

    //话题趋势
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailTwo",
        modelName : ["SocialTopicDetailStatistics"],
        platform : false,
        params(query, params) {
            if(params.type == "app") {
                params.type = ["ios", "android"];
            }
            if(!params.date) params.date = util.moment(Date.now());

            return params;
        },
        toggle : {
            show : true
        },
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups : [
                    {
                        key: "all",
                        value: "不限"
                    },
                    {
                        key: "app",
                        value: "APP"
                    },
                    {
                        key: "wap",
                        value: "WAP"
                    },
                    {
                        key: "pc",
                        value: "PC"
                    }
                ]
            }
        ],
        filter(data, query, dates, type) {
            return filter.topicDetailTwo(data, query, dates);
        }
    });

    //圈子数据趋势
    // Router = new api(Router,{
    //     router : "/socialAnalysis/topicDetailThree",
    //     modelName : [ "SocialTopicDetailStatistics" ],
    //     platform : false,
    //     filter_select : [{
    //     //    title: "平台选择",
    //     //    filter_key : 'type',
    //     //    groups: [{
    //     //        key: ['APP','WAP','PC'],
    //     //        value: '全部平台'
    //     //    },{
    //     //        key: 'APP',
    //     //        value: 'APP'
    //     //    },{
    //     //        key: 'WAP',
    //     //        value: 'WAP'
    //     //    },{
    //     //        key: 'PC',
    //     //        value: 'PC'
    //     //    }]
    //     //},{
    //         title: '指标',
    //         filter_key : 'filter_key',
    //         groups: [{
    //             key: 'new_topic_user_num',
    //             value: '新增成员数'
    //         },{
    //             key: 'new_topic_reply_num',
    //             value: '新增回复数'
    //         },{
    //             key: 'new_topic_reply_user_num',
    //             value: '新增回复人数'
    //         },{
    //             key: 'delete_topic_reply_num',
    //             value: '删除回复数'
    //         },{
    //             key: 'new_topic_like_num',
    //             value: '新增点赞数'
    //         },{
    //             key: 'new_topic_save_num',
    //             value: '新增收藏数'
    //         },{
    //             key: 'new_topic_share_num',
    //             value: '新增分享数'
    //         }]
    //     }],
    //     procedure : [{
    //         aggregate : {
    //             value : ["date"]
    //         },
    //         sum : ["new_topic_user_num", "new_topic_reply_num", "new_topic_reply_user_num",
    //             "delete_topic_reply_num", "new_topic_like_num", "new_topic_save_num",
    //             "new_topic_share_num"],
    //         groupBy : ["date"],
    //         get : ""
    //     }],
    //     filter(data, query, dates, type) {
    //         return filter.topicDetailThree(data, query, dates);
    //     }
    // });

    return Router;
};