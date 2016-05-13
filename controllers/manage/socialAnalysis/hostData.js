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
        router : "/socialAnalysis/hostOne",
        modelName : ["Host"],
        platform : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.hostOne(data);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        rows: [
            ["new_owner_num", "new_owner_rate", "avg_fan", "accum_owner_num"]
        ],
        cols: [
            [{
                caption: "新增圈主数",
                type: "number"
            }, {
                caption: "新圈主占比", // = 首次建圈圈主数 / 当日总建圈圈主数
                type: "string"
            }, {
                caption: "人均粉丝数", // = 总圈主粉丝数 / 总圈主数
                type: "number"
            }, {
                caption: "累计圈主数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostTwo",
        modelName : [ "HostTendency" ],
        platform : false,
        filter_select: [{
            title: '指标',
            filter_key: 'filter_key',
            groups: [{
                key: 'new_owner_num',
                value: '新增圈主数'
            }, {
                key: 'new_owner_rate',
                value: '新圈主占比'
            }, {
                key: 'avg_fan', 
                value: '人均粉丝数' 
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.hostTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{ //暂无头绪。。。
        router : "/socialAnalysis/groupThree",
        modelName : [ "HostDistribution" ],
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
        router : "/socialAnalysis/hostFour",
        modelName : [ "HostTop" ],
        platform : false,
        showDayUnit : true,
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.hostFour(data,dates);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "id", "owner_name", "new_fans_num", "new_group_num",
            "group_num", "fans_num"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "圈主名称",
                type: "string"
            }, {
                caption: "圈主新增粉丝数",
                type: "string"
            }, {
                caption: "新增圈子数",
                type: "number"
            }, {
                caption: "圈子数",
                type: "number"
            }, {
                caption: "粉丝数",
                type: "number"
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