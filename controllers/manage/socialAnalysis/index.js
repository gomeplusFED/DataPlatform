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
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
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
        platform : false,
        filter_select: [{
            title: '指标',
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
        modelName : [ "GroupDataTop" ],
        platform : false,
        showDayUnit : true,
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupFour(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "id", "group_name", "group_type", "group_new_member",
            "group_new_topics", "rate"]
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
                caption: "圈子参与度(%)", // （发布/回复）任意行为用户去重后数量 / 圈子成员数
                type: "string"
            }]
        ]
    });

    Router = new help(Router, {
        router : "/socialAnalysis/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新增圈子数",
                help : "新增圈子的数量"
            },{
                name : "新增入圈用户数",
                help : "首次加入圈子的用户去重"
            },{
                name : "新增用户入圈率",
                help : "新增入圈用户数/当天新增注册用户数"
            },{
                name : "累计圈子数",
                help : "圈子总数"
            },{
                name : "累计入圈用户数",
                help : "入圈用户数去重"
            },{
                name : "用户入圈率",
                help : "累计入圈用户数/注册用户数"
            },{
                name : "新增话题数",
                help : "圈子新增的话题数"
            },{
                name : "DAU",
                help : "（发布话题/回复）任一一个行为的用户去重"
            },{
                name : "被分享圈子数",
                help : "被分享的圈子数去重"
            },{
                name : "圈子名称",
                help : "圈子的名称"
            },{
                name : "圈子归属分类",
                help : "圈子归属的二级分类"
            },{
                name : "圈子新增成员数",
                help : "圈子新增成员数"
            },{
                name : "圈子新增话题数",
                help : "本期圈子的新增话题数"
            },{
                name : "圈子参与度【%】（排名字段）",
                help : "（发布话题/回复）任一一个行为的用户去重/圈子成员数"
            },
        ]
    });

    return Router;
};