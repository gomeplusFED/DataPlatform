/**
 * @author Hao Sun
 * @date 20160511 , 
 * @fileoverview 话题数据
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/topicData");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/topicsOne",
        modelName : ["Topics"],
        platform : false,
        date_picker: false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.topicsOne(data);
        },
        /*flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/helpTwo_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],*/
        rows: [
            ["one", "two", "three", "four", "five"]
        ],
        cols: [
            [{
                caption: "话题成员数",
                type: "number"
            }, {
                caption: "累计回复次数",
                type: "number"
            }, {
                caption: "话题回复率", // = 被恢复的话题数 / 话题数
                type: "string"
            }, {
                caption: "累计点赞数",
                type: "number"
            }, {
                caption: "累计收藏数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsTwo",
        modelName : [ "TopicsTendency" ],
        platform : false,
        /*level_select : true,
        level_select_name : "group_type",
        level_select_url : "/api/socialAnalysisCategories",*/
        /*fixedParams(query, filter_key, req, cb) {
            if(query.group_type === undefined) {
                query.group_type = "all";
            }
            cb(null, query);
        },*/
        filter(data, filter_key, dates) {
            return filter.topicsTwo(data, dates);
        },
        rows : [
            ["one" , "two", "three", "four", "five", "six", "seven", "eight"]
        ],
        cols : [
            [{
                caption: "平台",
                type: "string"
            },{
                caption: "新增成员数",
                type: "number"
            },{
                caption: "新增回复数",
                type: "number"
            },{
                caption: "新增回复人数",
                type: "number"
            },{
                caption: "删除回复数",
                type: "number"
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
    
    // Router = new api(Router,{
    //     router : "/socialAnalysis/topicsThree",
    //     modelName : [ "TopicsDistribution", "SocialCategory" ],
    //     platform : false,
    //     orderParams : {
    //         pid : ""
    //     },
    //     fixedParams(query, filter_key, req, cb) {
    //         var group_type = [];
    //         req.models.SocialCategory.find({
    //             pid : ""
    //         }, (err, data) => {
    //             if(!err) {
    //                 for(var key of data) {
    //                     group_type.push(key.id);
    //                 }
    //                 query.group_type = group_type;
    //                 cb(null, query);
    //             } else {
    //                 cb(err);
    //             }
    //         });
    //     },
    //     filter_select: [
    //         {
    //             title: '指标选择',
    //             filter_key: 'filter_key',
    //             groups: [{
    //                 key: 'topic_num',
    //                 value: '话题'
    //             }, {
    //                 key: 'replay_num',
    //                 value: '回复'
    //             }]
    //         }
    //     ],
    //     filter(data, filter_key) {
    //         return filter.topicsThree(data, filter_key);
    //     }
    // });
    
    // Router = new api(Router,{
    //     router : "/socialAnalysis/topicsFour",
    //     modelName : [ "TopicsDistribution", "SocialCategory" ],
    //     platform : false,
    //     orderParams : {},
    //     fixedParams(query, filter_key, req, cb) {
    //         var filter_key = filter_key || "-1",
    //             group_type = [];
    //         req.models.SocialCategory.find({
    //             pid : filter_key
    //         }, (err, data) => {
    //             if(!err) {
    //                 for(var key of data) {
    //                     group_type.push(key.id);
    //                 }
    //                 query.group_type = group_type;
    //                 cb(null, query);
    //             } else {
    //                 cb(err);
    //             }
    //         });
    //     },
    //     selectFilter(req, cb) {
    //         var filter_select = {
    //             title: '一级分类',
    //             filter_key: 'filter_key',
    //             groups: []
    //         };
    //         req.models.SocialCategory.find({
    //             pid : ""
    //         }, (err, data) => {
    //             if(!err) {
    //                 for(var key of data) {
    //                     var obj = {
    //                         key : key.id,
    //                         value : key.name,
    //                         cell : {
    //                             title: '指标',
    //                             filter_key: 'filter_key2',
    //                             groups: [{
    //                                 key: 'topic_num',
    //                                 value: '话题'
    //                             }, {
    //                                 key: 'replay_num',
    //                                 value: '回复'
    //                             }]
    //                         }
    //                     };
    //                     filter_select.groups.push(obj);
    //                 }
    //                 cb(null,[filter_select]);
    //             } else {
    //                 cb(err);
    //             }
    //         });
    //     },
    //     filter_select: [],
    //     filter(data, filter_key, dates, filter_key2) {
    //         return filter.topicsFour(data, filter_key, filter_key2);
    //     }
    // });
    
    // Router = new api(Router,{
    //     router : "/socialAnalysis/topicsFive",
    //     modelName : [ "TopicsTop" ],
    //     platform : false,
    //     showDayUnit : true,
    //     paging : true,
    //     order : ["-click_num"],
    //     date_picker_data: 1,
    //     filter(data, filter_key, dates, filter_key2, page) {
    //         return filter.topicsFive(data, page);
    //     },
    //     excel_export : true,
    //     flexible_btn : [{
    //         content: '<a href="javascript:void(0)">导出</a>',
    //         preMethods: ['excel_export']
    //     }],
    //     rows: [
    //         [ "id", "topic_name", "click_num", "click_user_num","replay_num",
    //             "user_reply_rate", "avg_reply"]
    //     ],
    //     cols: [
    //         [{
    //             caption: "排名",
    //             type: "number"
    //         }, {
    //             caption: "话题名称",
    //             type: "string"
    //         }, {
    //             caption: "点击量", //排名字段
    //             type: "number"
    //         }, {
    //             caption: "点击用户数",
    //             type: "number"
    //         }, {
    //             caption: "新增回复数",
    //             type: "number"
    //         }, {
    //             caption: "回复率", // 回复用户数 / 点击用户数
    //             type: "string"
    //         }, {
    //             caption: "人均回复量", // 话题回复量 / 话题回复人数
    //             type: "number"
    //         }]
    //     ]
    // });

    // Router = new help(Router, {
    //     router : "/socialAnalysis/helpTwo",
    //     rows : config.help.rows,
    //     cols : config.help.cols,
    //     data : [
    //         {
    //             name : "新增话题数",
    //             help : "新增的话题数"
    //         },{
    //             name : "新增回复数",
    //             help : "新增的回复数"
    //         },{
    //             name : "新增话题回复率",
    //             help : "被回复的新增话题数/新增话题数"
    //         },{
    //             name : "话题回复率",
    //             help : "被恢复的话题数/话题数"
    //         },{
    //             name : "累计话题数",
    //             help : "累计话题数"
    //         },{
    //             name : "话题点击率",
    //             help : "点击数/浏览数"
    //         },{
    //             name : "话题分享率",
    //             help : "被分享的话题数(去重)/话题数"
    //         },{
    //             name : "话题名称",
    //             help : "话题名称"
    //         },{
    //             name : "话题归属圈子分类",
    //             help : "话题归属的圈子二级分类"
    //         },{
    //             name : "点击量", //排名字段
    //             help : "圈子的名称"
    //         },{
    //             name : "点击用户数",
    //             help : "点击的用户量取宠"
    //         },{
    //             name : "回复率",
    //             help : "回复用户数/点击用户数"
    //         },{
    //             name : "人均回复量",
    //             help : "话题回复量/话题回复人数"
    //         }
    //     ]
    // });

    return Router;
};