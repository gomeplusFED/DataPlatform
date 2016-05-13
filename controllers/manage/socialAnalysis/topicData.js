/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/topicsOne",
        modelName : ["Topics"],
        platform : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.topicsOne(data);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        rows: [
            ["new_topic_count", "new_reply_count", "new_reply_rate",
            "reply_rate", "ttl_topics"]
        ],
        cols: [
            [{
                caption: "新增话题数",
                type: "number"
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增话题回复率", // = 被恢复的新增话题数 / 新增话题数
                type: "string"
            }, {
                caption: "话题回复率", // = 被恢复的话题数 / 话题数
                type: "number"
            }, {
                caption: "累计话题数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsTwo",
        modelName : [ "TopicsTendency" ],
        level_select : true,
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'new_group_count',
                value: '新增话题数'
            }, {
                key: 'new_group_user_count',
                value: '话题回复率'
            }, {
                key: 'new_group_topic_count',
                value: '话题点击率'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.topicsTwo(data, filter_key, dates);
        }
    });

    // Router = new api(Router,{ //暂无头绪。。。
    //     router : "/socialAnalysis/topicsThree",
    //     modelName : [ "GroupDataDistribution" ],
    //     level_select : true,
    //     platform : false,
    //     filter_select: [
    //         {
    //             title: '指标选择',
    //             filter_key: 'filter_key',
    //             groups: [{
    //                 key: 'accumulated_group_all_count',
    //                 value: '圈子数'
    //             }, {
    //                 key: 'DAU',
    //                 value: 'DAU'
    //             }]
    //         }
    //     ],
    //     filter(data, filter_key, dates) {
    //         return filter.groupThree(data, filter_key);
    //     }
    // });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsFour",
        modelName : [ "TopicsTop" ],
        platform : false,
        showDayUnit : true,
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.topicsFour(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "id", "topic_name", "click_num", "click_user_num",
                "user_reply_rate", "avg_reply"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "话题名称",
                type: "string"
            }, {
                caption: "点击量", //排名字段
                type: "number"
            }, {
                caption: "点击用户数",
                type: "number"
            }, {
                caption: "回复率", // 回复用户数 / 点击用户数
                type: "string"
            }, {
                caption: "人均回复量", // 话题回复量 / 话题回复人数
                type: "number"
            }]
        ]
    });

    Router = new help(Router, {
        router : "/socialAnalysis/helpTwo",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新增话题数",
                help : "新增的话题数"
            },{
                name : "新增回复数",
                help : "新增的回复数"
            },{
                name : "新增话题回复率",
                help : "被回复的新增话题数/新增话题数"
            },{
                name : "话题回复率",
                help : "被恢复的话题数/话题数"
            },{
                name : "累计话题数",
                help : "累计话题数"
            },{
                name : "话题点击率",
                help : "点击数/浏览数"
            },{
                name : "话题分享率",
                help : "被分享的话题数(去重)/话题数"
            },{
                name : "话题名称",
                help : "话题名称"
            },{
                name : "话题归属圈子分类",
                help : "话题归属的圈子二级分类"
            },{
                name : "点击量", //排名字段
                help : "圈子的名称"
            },{
                name : "点击用户数",
                help : "点击的用户量取宠"
            },{
                name : "回复率",
                help : "回复用户数/点击用户数"
            },{
                name : "人均回复量",
                help : "话题回复量/话题回复人数"
            }
        ]
    });

    return Router;
};