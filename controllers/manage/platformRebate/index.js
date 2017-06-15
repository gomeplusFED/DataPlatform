/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../../base/main"),
    _ = require("lodash"),
    util = require("../../../utils"),
    filter = require("../../../filters/platformRebate");

module.exports = (Router) => {

    Router = Router.get("/rebate/totalZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                flexible_btn: {
                    content: '站点',
                    preMethods: ['show_filter'],
                    customMethods: '',
                    max: 6,
                    key: 'site',
                    groups: [{
                        "text": "站点",
                        "value": 1,
                        options: [
                            {
                                "text": "Plus-PC",
                                "value": "Plus-PC"
                            },
                            {
                                "text": "商城-PC",
                                "value": "商城-PC"
                            },
                            {
                                "text": "Plus-WAP",
                                "value": "Plus-WAP"
                            },
                            {
                                "text": "商城-WAP",
                                "value": "商城-WAP"
                            },
                            {
                                "text": "Plus-APP",
                                "value": "Plus-APP"
                            },
                            {
                                "text": "商城-APP",
                                "value": "商城-APP"
                            }
                        ]
                    }]
                }
            }
        });
    });

    //返利总览
    Router = new api(Router, {
        router : "/rebate/totalOne",
        modelName : ["ads_rebate_v3_rebate_summary"],
        platform : false,
        params(query, params) {
            const site = query.site;
            const _site = ["Plus-PC", "商城-PC", "Plus-WAP", "商城-WAP", "Plus-APP", "商城-APP"];
            params.site = site ? site : _site;
            params.date = params.date || util.moment(Date.now());

            return params;
        },
        filter(data) {
            return filter.totalOne(data);
        },
        rows: [
            ["expect_rebate_amount", "expect_rebate_user_frequency", "cancel_rebate_amount",
                "over_rebate_amount", "expect_rebate_order_num", "over_rebate_order_num"]
        ],
        cols: [
            [{
                caption: "预计返利金额（元）",
                type: "string"
            }, {
                caption: "预计获利人次",
                type: "string"
            }, {
                caption: "已取消预计返利金额（元）",
                type: "string"
            }, {
                caption: "返利到账金额（元）",
                type: "string"
            }, {
                caption: "新增订单数",
                type: "string"
            }, {
                caption: "返利到账订单数",
                type: "string"
            }]
        ]
    });

    //返利订单趋势
    Router = new api(Router, {
        router : "/rebate/totalTwo",
        modelName : ["ads_rebate_v3_rebate_summary"],
        platform : false,
        params(query, params) {
            const site = query.site;
            const _site = ["Plus-PC", "商城-PC", "Plus-WAP", "商城-WAP", "Plus-APP", "商城-APP"];
            params.site = site ? site : _site;
            params.date = params.date || util.moment(Date.now());

            return params;
        },
        filter_select: [{
            title: '指标',
            filter_key : 'filter_key',
            groups: [
                {
                    key: 'expect_rebate_amount',
                    value: '预计返利金额'
                },
                {
                    key: 'cancel_rebate_amount',
                    value: '已取消预计返利金额'
                },
                {
                    key: 'over_rebate_amount',
                    value: '返利到账金额'
                },
                {
                    key: 'expect_rebate_user_frequency',
                    value: '预计获利人次'
                },
                {
                    key: 'expect_rebate_order_num',
                    value: '新增订单数'
                },
                {
                    key: 'over_rebate_order_num',
                    value: '返利到账订单数'
                }
            ]
        }],
        toggle : {
            show : true
        },
        filter(data, query, dates, type) {
            return filter.totalTwo(data, query, dates);
        }
    });

    //返利占比
    Router = new api(Router, {
        router : "/rebate/totalThree",
        modelName : ["ads_rebate_v3_rebate_summary"],
        platform : false,
        params(query, params) {
            const site = query.site;
            const _site = ["Plus-PC", "商城-PC", "Plus-WAP", "商城-WAP", "Plus-APP", "商城-APP"];
            params.site = site ? site : _site;
            params.date = params.date || util.moment(Date.now());

            return params;
        },
        filter_select: [{
            title: '指标',
            filter_key : 'filter_key',
            groups: [
                {
                    key: 'expect_rebate_amount',
                    value: '预计返利金额'
                },
                {
                    key: 'cancel_rebate_amount',
                    value: '已取消预计返利金额'
                },
                {
                    key: 'over_rebate_amount',
                    value: '返利到账金额'
                },
                {
                    key: 'expect_rebate_user_frequency',
                    value: '预计获利人次'
                },
                {
                    key: 'expect_rebate_order_num',
                    value: '新增订单数'
                },
                {
                    key: 'over_rebate_order_num',
                    value: '返利到账订单数'
                }
            ]
        }],
        toggle : {
            show : true
        },
        filter(data, query, dates, type) {
            return filter.totalTwo(data, query, dates);
        }
    });

    //返利功能详情
    Router = new api(Router, {
        router : "/rebate/totalFour",
        modelName : ["ads_rebate_v3_rebate_plantype_rebatetype", "TypeFlow"],
        platform : false,
        paging: [true, false],
        params(query, params) {
            const site = query.site;
            const _site = ["Plus-PC", "商城-PC", "Plus-WAP", "商城-WAP", "Plus-APP", "商城-APP"];
            params.site = site ? site : _site;
            params.date = params.date || util.moment(Date.now());

            return params;
        },
        secondParams() {
            return {};
        },
        filter(data, query, dates, type) {
            return filter.totalFour(data, query, dates);
        },
        rows: [
            [""]
        ],
        cols: [
            [
                {
                    caption: "返利功能",
                    type: "string"
                },
                {
                    caption: "使用方",
                    type: "string"
                },
                {
                    caption: "关联流程",
                    type: "string"
                },
                {
                    caption: "关联流程序号",
                    type: "string"
                },
                {
                    caption: "参与返利人数",
                    type: "number"
                },
                {
                    caption: "预计返利金额（元)",
                    type: "number"
                },
                {
                    caption: "已取消返利金额 (元）",
                    type: "number"
                },
                {
                    caption: "返利到账金额 (元）",
                    type: "number"
                },
                {
                    caption: "参与商品数（SKU）",
                    type: "number"
                },
                {
                    caption: "参与商家数",
                    type: "number"
                },
            ]
        ]
    });

    return Router;
};