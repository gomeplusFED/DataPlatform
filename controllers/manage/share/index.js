/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/main"),
    orm = require("orm"),
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
        filter(data) {
            return filter.indexOne(data);
        },
        rows : [
            ["share_time_sum", "share_user_sum", "click_time_sum", "click_user_sum", "rate"]
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
                    type : "string",
                    help : "有效点击次数/分享次数"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/share/indexTwo",
        modelName : ["ShareAnalyzeTrend"],
        platform : false,
        params : {
            share_source_name : "all"
        },
        filter(data, query, dates) {
            return filter.indexTwo(data, query.filter_key, dates);
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
        filter(data) {
            return filter.indexThree(data);
        }
    });

    Router = new api(Router,{
        router : "/share/indexFour",
        modelName : ["ShareAnalyzeTrend"],
        platform : false,
        paging : [true],
        date_picker_data : 1,
        excel_export : true,
        filter(data, query, dates) {
            return filter.indexFour(data, query.filter_key, query.page);
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query, params) {
            if(query.filter_key === "all") {
                params.share_source_name = ["all"];
                delete params.share_source;
            } else {
                params.share_source = query.filter_key;
                params.share_source_name = orm.not_in(["all"]);
            }
            return params;
        },
        filter_select: [{
            title: '',
            filter_key: 'filter_key',
            groups: [{
                key: "all",
                value: '全部'
            }, {
                key: 'product',
                value: '商品'
            }, {
                key: 'topic',
                value: '话题'
            }, {
                key: 'shop',
                value: '店铺'
            }, {
                key: 'group',
                value: '圈子'
            }]
        }],
        rows : [
            ["id", "share_source", "share_time_sum", "share_user_sum", "click_time_sum",
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
                    type : "string",
                    help : "有效点击次数/分享次数"
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
        paging : [true],
        params(query, params) {
            let filter_key = query.filter_key;
            if(filter_key === "all") {
                params.share_source_name = "all";
            }
            if(query.share_source === "店铺") {
                params.share_source = "shop";
            }
            if(query.share_source === "商品") {
                params.share_source = "product";
            }
            if(query.share_source === "话题") {
                params.share_source = "topic";
            }
            if(query.share_source === "圈子") {
                params.share_source = "group";
            }
            return params;
        },
        filter(data) {
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
                    type : "string",
                    help : "分享文案中的链接点击次数/分享次数"
                }
            ]
        ]
    });

    return Router;
};