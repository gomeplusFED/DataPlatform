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
        router : "/socialAnalysis/groupOne",
        modelName : ["Group"],
        platform : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupOne(data);
        },
        rows: [
            ["new_group_count", "new_group_user_count", "new_group_user_rate",
            "accumulated_group_all_count", "accumulated_group_user_all_count",
            "user_join_group_rate"]
        ],
        cols: [
            [{
                caption: "新增圈子数",
                type: "number"
            }, {
                caption: "新增入圈户数",
                type: "number"
            }, {
                caption: "新增入圈用户率", // = 新增入圈用户数 / 注册用户数
                type: "string"
            }, {
                caption: "累计圈子数",
                type: "number"
            }, {
                caption: "累计入圈用户数",
                type: "number"
            }, {
                caption: "用户入圈率", // = 累计入圈用户数 / 注册用户数
                type: "string"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupTwo",
        modelName : [ "GroupDataTendency" ],
        level_select : true,
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'new_group_count',
                value: '新增圈子数'
            }, {
                key: 'new_group_user_count',
                value: '新增入圈户数'
            }, {
                key: 'new_group_topic_count', //"圈子新增话题数"
                value: '新增话题数' //"圈子新增话题数"
            }, {
                key: 'DAU',
                value: 'DAU'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.groupTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{ //暂无头绪。。。
        router : "/socialAnalysis/groupThree",
        modelName : [ "GroupDataDistribution" ],
        level_select : true,
        platform : false,
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'accumulated_group_all_count',
                    value: '圈子数'
                }, {
                    key: 'DAU',
                    value: 'DAU'
                }]
            }
        ],
        filter(data, filter_key, dates) {
            return filter.groupThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupFour",
        modelName : [ "GroupTop100" ],
        level_select : true,
        platform : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupFour(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            ["group_ranking", "group_name", "group_type", "group_new_member",
            "group_new_topics", "group_participation"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "圈子名称",
                type: "string"
            }, {
                caption: "圈子归属分类",
                type: "string"
            }, {
                caption: "圈子新增成员数",
                type: "number"
            }, {
                caption: "圈子新增话题数",
                type: "number"
            }, {
                caption: "圈子参与度", // （发布/回复）任意行为用户去重后数量 / 圈子成员数
                type: "string"
            }]
        ]
    });

    return Router;
};