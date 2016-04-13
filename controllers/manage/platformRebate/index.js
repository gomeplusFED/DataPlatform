/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/platformRebate");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/platformOrderOne",
        modelName : ["Rebate", "RebateRefund"],
        level_select : true,
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.platformOrderOne(data);
        },
        rows: [
            ["name", "order_count", "rebate_order_amount_count", "participate_seller_count",
                "participate_user_count", "participate_goods_count"],
            ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count", "rate"],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count",
                "refund_goods_amount_actual_count"]
        ],
        cols: [
            [{
                caption: "",
                type: "string"
            }, {
                caption: "订单数",
                type: "string"
            }, {
                caption: "订单总金额",
                type: "string"
            }, {
                caption: "商家数",
                type: "string"
            }, {
                caption: "用户数",
                type: "string"
            }, {
                caption: "商品件数",
                type: "string"
            }],
            [{
                caption: "返利到账订单数",
                type: "string"
            }, {
                caption: "返利到账订单总金额",
                type: "string"
            }, {
                caption: "返利到账订单实付金额",
                type: "string"
            }, {
                caption: "返利到账金额",
                type: "string"
            }, {
                caption: "返利比率",
                type: "string"
            }],
            [{
                caption: "",
                type: "string"
            }, {
                caption: "退货商品数",
                type: "string"
            }, {
                caption: "退货商品件数",
                type: "string"
            }, {
                caption: "退货用户数",
                type: "string"
            }, {
                caption: "退货商品总金额",
                type: "string"
            }, {
                caption: "实际退货金额",
                type: "string"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderTwe",
        modelName : [ "RebatetRedencyDetails" ],
        level_select : true,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'order_count',
                value: '订单数'
            }, {
                key: 'order_amount_count',
                value: '订单总金额'
            }, {
                key: 'goods_sku_count',
                value: '商品件数'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.platformOrderTwe(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderThree",
        modelName : [ "RebatetRedencyDetails" ],
        level_select : true,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'goods_sku_count',
                value: '商品件数'
            }, {
                key: 'goods_amount_count',
                value: '商品总金额'
            }, {
                key: 'rebate_amount_count',
                value: '返利到账金额'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.platformOrderThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFour",
        modelName : [ "RebatetRedencyDetails" ],
        level_select : true,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'goods_sku_count',
                value: '商品件数'
            }, {
                key: 'goods_amount_count',
                value: '商品总金额'
            }, {
                key: 'rebate_amount_count',
                value: '返利到账金额'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.platformOrderFour(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFive",
        modelName : [ "RebatetSheduleDetails" ],
        excel_export : true,
        flexible_btn : [{
            content: '导出',
            preMethods: ['excel_export']
        }],
        filter_select: [{
            title: '使用方',
            filter_key: 'user_party',
            groups: [{
                key: '单项单级返利',
                value: '单项单级返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '固定返利',
                        value: '固定返利'
                    },{
                        key: '比例返利',
                        value: '比例返利'
                    }]
                }
            }, {
                key: '平台基础返利',
                value: '平台基础返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '分享购买',
                        value: '分享购买'
                    },{
                        key: '邀请好友-购买返利',
                        value: '邀请好友-购买返利'
                    },{
                        key: '邀请好友-固定返利',
                        value: '邀请好友-固定返利'
                    }]
                }
            }, {
                key: '平台促销返利',
                value: '平台促销返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '分享购买',
                        value: '分享购买'
                    },{
                        key: '邀请好友-购买返利',
                        value: '邀请好友-购买返利'
                    },{
                        key: '邀请好友-固定返利',
                        value: '邀请好友-固定返利'
                    }]
                }
            }, {
                key: '邀请商家入驻返利',
                value: '邀请商家入驻返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '固定返利',
                        value: '固定返利'
                    }, {
                        key: '分享购买',
                        value: '分享购买'
                    }]
                }
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.platformOrderFive(data);
        },
        rows : [
            [ "id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count",
                "participate_goods_count", "participate_user_count", "order_rate", "price_rate",
                "rebate_amount" ]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                }, {
                    caption : "返利计划名称",
                    type : "string"
                }, {
                    caption : "使用方",
                    type : "string"
                }, {
                    caption : "有效期",
                    type : "string"
                }, {
                    caption : "相关流程",
                    type : "string"
                }, {
                    caption : "层级",
                    type : "string"
                }, {
                    caption : "参与商家数",
                    type : "number"
                }, {
                    caption : "参与商品数",
                    type : "number"
                }, {
                    caption : "参与用户数",
                    type : "number"
                }, {
                    caption : "新增订单数/订单总数",
                    type : "string"
                }, {
                    caption : "新增订单金额/订单总金额",
                    type : "string"
                }, {
                    caption : "返利到账金额",
                    type : "number"
                }
            ]
        ]
    });

    return Router;
};