/**
 * @author Xisen He
 * @date 20160812
 * @fileoverview 圈子数据->详情
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    util = require("../../../utils"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/index2");

module.exports = (Router) => {
    
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailOne",
        modelName : ["Statistics"],
        platform : false,
        date_picker : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupDetailOne(data);
        },
        procedure : [{
            aggregate : {
                value : ["key"]
            },
            sum : ["value"],
            groupBy : ["key"],
            get : ""
        }],
        params : function(query , params , sendData){
            return {
                "group_id" : params.group_id,
                "key" : ["group_person_num", "group_topic_num",
                    "topic_praise_num", "topic_collect_num", "topic_reply_num",
                    "topic_subreply_num"]
            }
        },
        rows: [
            ["group_person_num", "group_topic_num", "topic_praise_num",
            "topic_collect_num", "reply_num"]
        ],
        cols: [
            [{
                caption: "圈子成员数",
                type: "number"
            }, {
                caption: "圈子话题数",
                type: "number"
            }, {
                caption: "累计话题点赞数",
                type: "number"
            }, {
                caption: "累计话题收藏数",
                type: "number"
            }, {
                caption: "累计话题回复次数",
                type: "number"
            }]
        ]
    });

    //圈子数据统计
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailTwo",
        modelName : ["SocialGroupDetailStatistic"],
        platform : false,
        filter(data) {
            return filter.groupDetailTwo(data);
        },
        procedure : [{
             aggregate : {
                value : ["type"]
            },
            sum : ["new_group_user_num","new_group_share_num","new_group_topic_num","delete_group_topic_num","new_group_reply_num","new_group_reply_user_num","delete_group_reply_num","new_group_like_num","new_group_save_num"],
            groupBy : ["type"],
            get : ""
        }],
        rows: [
            ["type","sum_new_group_user_num","sum_new_group_share_num","sum_new_group_topic_num","sum_delete_group_topic_num","sum_new_group_reply_num","sum_new_group_reply_user_num","sum_delete_group_reply_num","sum_new_group_like_num","sum_new_group_save_num"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "新增成员数",
                type: "number",
            }, {
                caption: "新增分享数",
                type: "number"
            }, {
                caption: "新增话题数",
                type: "number"
            }, {
                caption: "删除话题数",
                type: "number"
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增回复人数",
                type: "number",
            }, {
                caption: "删除回复数",
                type: "number"
            }, {
                caption: "新增点赞数",
                type: "number"
            }, {
                caption: "新增收藏数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailThree",
        modelName : [ "SocialGroupDetailStatistic" ],
        platform : false,
        filter_select : [{
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
        //},{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'new_group_user_num',
                value: '新增成员数'
            },{
                key: 'new_group_share_num',
                value: '新增分享数'
            },{
                key: 'new_group_topic_num',
                value: '新增话题数'
            },{
                key: 'delete_group_topic_num',
                value: '删除话题数'
            },{
                key: 'new_group_reply_num',
                value: '新增回复数'
            },{
                key: 'delete_group_reply_num',
                value: '删除回复数'
            },{
                key: 'new_group_like_num',
                value: '新增点赞数'
            },{
                key: 'new_group_save_num',
                value: '新增收藏数'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.groupDetailThree(data, query, dates);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailFour",
        modelName : [ "SocialGroupDetailList" , "Statistics" ],
        platform : false,
        excel_export : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        procedure : [false, {
            aggregate : {
                value : ["key"]
            },
            sum : ["value"],
            groupBy : ["key"],
            get : ""
        }],
        secondParams(query , params , sendData){
            //Statistics,查询时间，固定为昨天
            var lastday = new Date(+new Date() - 1000*60*60*24),
                date = util.getDate(lastday);
            //Statistics,topic_id数组
            var source = sendData.first.data[0];
            var arr = [];
            for(let item of source){
                arr.push(item.topic_id);
            }

            return {
                date : orm.between(date + " 00:00:00", date + " 23:59:59"),
                "group_id" : params.group_id,
                "topic_id" : arr,
                "key" : ["topic_reply_user_num", "topic_subreply_user_num",
                    "topic_reply_num", "topic_subreply_num", "topic_praise_num",
                    "topic_collect_num"]
            }
        }, 
        rows : [
            ["topic_create_time","topic_name","topic_id","publisher_name","reply_user_num",
                "topic_reply_num","topic_praise_num","topic_collect_num"]
        ],
        cols: [
            [{
                caption: "话题创建日期",
                type: "date"
            },{
                caption: "话题名称",
                type: "string"
            },{
                caption: "话题ID",
                type: "string"
            },{
                caption: "发布人名称",
                type: "string"
            },{
                caption: "累计回复人数",
                type: "number"
            },{
                caption: "累计回复次数",
                type: "number"
            },{
                caption: "累计点赞数",
                type: "number"
            },{
                caption: "累计收藏数",
                type: "number"
            }]
        ],
        filter(data, query, dates, type) {
            return filter.groupDetailFour(data, query);
        }
    });

    return Router;
};