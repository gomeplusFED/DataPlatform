/**
 * @author yanglei
 * @date 20160408
 * @fileoverview 平台促销返利
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/platformRebate/platformPromotions");

module.exports = (Router) => {
    Router = new api(Router, {
        router : "/platformRebate/platformPromotionsOne",
        modelName : ["Rebate", "RebateRefund"],
        platform : false,
        fixedParams : {
            user_party : "平台促销返利"
        },
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.platformPromotionsOne(data);
        },
        rows: [
            ["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count",
                "participate_user_count" ],
            ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count", "rate"],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count",
                "refund_goods_amount_actual_count"]
        ],
        cols: [
            [{
                caption: "返利计划书",
                type: "string"
            }, {
                caption: "参与商户数",
                type: "number"
            }, {
                caption: "参与商品数",
                type: "number"
            }, {
                caption: "订单数",
                type: "number"
            }, {
                caption: "用户数",
                type: "number"
            }],
            [{
                caption: "返利到账订单数",
                type: "string"
            }, {
                caption: "返利订单总金额",
                type: "string"
            }, {
                caption: "返利订单实付金额",
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

    Router = new api(Router, {
        router : "/platformRebate/platformPromotionsTwo",
        modelName : [ "RebatetRedencyDetails" ],
        platform : false,
        level_select : true,
        fixedParams : {
            user_party : "平台促销返利"
        },
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
            return filter.platformPromotionsTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformPromotionsThree",
        modelName : [ "RebatetRedencyDetails" ],
        platform : false,
        level_select : true,
        fixedParams : {
            user_party : "平台促销返利"
        },
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
            return filter.platformPromotionsThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformPromotionsFour",
        modelName : [ "RebatetRedencyDetails" ],
        platform : false,
        level_select : true,
        fixedParams : {
            user_party : "平台促销返利"
        },
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
            return filter.platformPromotionsFour(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformPromotionsFive",
        modelName : [ "RebatetSheduleDetails" ],
        platform : false,
        fixedParams : {
            user_party : "平台促销返利"
        },
        excel_export : true,
        //flexible_btn : [{
        //    content: '<a href="javascript:woid(0)">导出</a>',
        //    preMethods: ['excel_export']
        //}],
        filter(data, filter_key, dates) {
            return filter.platformPromotionsFive(data);
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