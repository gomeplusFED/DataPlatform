/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/share");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/share/indexOne",
        modelName : ["ShareAnalyzeOverview"],
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/share/index/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.indexOne(data, dates);
        },
        rows : [
            ["shareTimeSum", "shareUserSum", "clickTimeSum", "clickUserSum", "rate"]
        ],
        cols : [
            [
                {
                    caption : "分享次数",
                    type : "number"
                },{
                    caption : "分享人数",
                    type : "number"
                },{
                    caption : "点击次数",
                    type : "number"
                },{
                    caption : "点击人数",
                    type : "number"
                },{
                    caption : "有效分享占比",
                    type : "string"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/share/indexTwo",
        modelName : ["ShareAnalyzeTrend"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.indexTwo(data, filter_key, dates);
        },
        filter_select: [{
            title: '',
            filter_key: 'filter_key',
            groups: [{
                key: 'share_time_sum',
                value: '分享次数'
            }, {
                key: 'share_user_sum',
                value: '分享人数'
            }, {
                key: 'rate',
                value: '有效分享占比'
            }]
        }]
    });

    Router = new api(Router,{
        router : "/share/indexThree",
        modelName : ["ShareAnalyzeChannel"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.indexThree(data);
        }
    });

    Router = new api(Router,{
        router : "/share/indexFour",
        modelName : ["ShareAnalyzeTrend"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.indexFour(data);
        },
        filter_select: [{
            title: '',
            filter_key: 'sharesource',
            groups: [{
                key: ["商品", "话题", "店铺", "圈子"],
                value: '全部'
            }, {
                key: '商品',
                value: '商品'
            }, {
                key: '话题',
                value: '话题'
            }, {
                key: '店铺',
                value: '店铺'
            }, {
                key: '圈子',
                value: '圈子'
            }]
        }],
        rows : [
            ["id", "sharesource", "share_time_sum", "share_user_sum", "click_time_sum",
                "click_user_sum", "rate", "operating"]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                },
                {
                    caption : "分享来源",
                    type : "string"
                },{
                    caption : "分享次数",
                    type : "number"
                },{
                    caption : "分享人数",
                    type : "number"
                },{
                    caption : "点击次数",
                    type : "number"
                },{
                    caption : "点击人数",
                    type : "number"
                },{
                    caption : "有效分享占比",
                    type : "string"
                },{
                    caption : "操作"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/share/operating",
        modelName : ["ShareAnalyzeChannelTrend"],
        platform : false,
        //paging : true,
        filter(data, filter_key, dates) {
            return filter.operating(data);
        },
        rows : [
            ["share_channel", "share_time_sum", "share_user_sum", "click_time_sum",
                "click_user_sum", "rate"]
        ],
        cols : [
            [
                {
                    caption : "分享渠道",
                    type : "string"
                },{
                    caption : "分享次数",
                    type : "number"
                },{
                    caption : "分享人数",
                    type : "number"
                },{
                    caption : "点击次数",
                    type : "number"
                },{
                    caption : "点击人数",
                    type : "number"
                },{
                    caption : "分享回流率",
                    type : "string"
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/share/index/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "有效分享占比",
                help : "有效点击次数/分享次数"
            },
            {
                name : "分享回流率",
                help : "分享文案中的链接点击次数/分享次数"
            }
        ]
    });

    return Router;
};