/**
 * @author yanglei
 * @date 201600405
 * @fileoverview 商家返利汇总
 */
var api = require("../../../base/api"),
    moment = require("moment"),
    businessRebate = require("../../../filters/businessRebate");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/businessRebate/businessAllOne",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        date_picker_data: 1,
        filter(data, filter_key) {
            return businessRebate.businessAllOne(data);
        },
        rows: [
            ["name", "order_num", "order_amount", "shop_num", "user_num", "product_sku_num"],
            ["rebate_order_num", "rebate_amount_total", "rebate_amount_actual", "rebate_amount", "rate", "platform_amount"],
            ["name", "spu_num", "sku_num", "user_num", "amount", "amount_actual"]
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
            }, {
                caption: "平台到账金额",
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
        router : "/businessRebate/businessAllTwo",
        modelName : [ "RebateShopTredencyDetails" ],
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'order_num',
                value: '订单数'
            }, {
                key: 'order_amount',
                value: '订单总金额'
            }, {
                key: 'product_sku_num',
                value: '商品件数'
            }]
        }],
        filter(data, filter_key) {
            return businessRebate.businessAllTwe(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllThree",
        modelName : [ "RebateShopTredencyDetails" ],
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'product_sku_num',
                    value: '商品件数'
                }, {
                    key: 'item_amount',
                    value: '商品总金额'
                }, {
                    key: 'rebate_amount',
                    value: '返利到账金额'
                }]
            }
        ],
        filter(data, filter_key) {
            return businessRebate.businessAllThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllFour",
        modelName : [ "RebateShopTredencyDetails" ],
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'product_sku_num',
                    value: '商品件数'
                }, {
                    key: 'item_amount',
                    value: '商品总金额'
                }, {
                    key: 'rebate_amount',
                    value: '返利到账金额'
                }]
            }
        ],
        filter(data, filter_key) {
            return businessRebate.businessAllFour(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllFive",
        modelName : [ "RebateShopTop" ],
        date_picker_data: 1,
        filter(data, filter_key) {
            return businessRebate.businessAllFive(data);
        },
        rows : [
            [ "id", "shop_name", "plan_num", "spu_num", "user_num", "pay_rate", "pay_price_rate",
                "plan_rebate_amount", "rebate_amount", "platform_amount" ]
        ],
        cols : [
            [
                {
                    caption : "排名",
                    type : "number"
                },{
                caption : "商家名称",
                type : "string"
            },{
                caption : "计划数",
                type : "number"
            },{
                caption : "参与商品数",
                type : "number"
            },{
                caption : "参与用户数",
                type : "number"
            },{
                caption : "新增订单数/订单总数",
                type : "string"
            },{
                caption : "新增订单金额/订单总金额",
                type : "string"
            },{
                caption : "预计返利金额",
                type : "number"
            },{
                caption : "返利到账金额",
                type : "number"
            },{
                caption : "平台到账金额",
                type : "number"
            }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllSix",
        modelName : [ "RebateShopPlanTop" ],
        date_picker_data: 1,
        flexible_btn : [
            {
                content: '<a href="/businessRebate/plan" target="_blank">更多</a>',
                preMethods: [],
                customMethods: ''
            }
        ],
        filter(data, filter_key) {
            return businessRebate.businessAllSix(data);
        },
        rows : [
            [ "id", "plan_name", "shop_name", "deadline", "related_flow", "level", "spu_num", "user_num",
                "pay_rate", "pay_price_rate", "rebate_amount", "refund_rate" ]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                },{
                caption : "返利计划名称",
                type : "string"
            },{
                caption : "商家名称",
                type : "string"
            },{
                caption : "有效期",
                type : "string"
            },{
                caption : "相关流程",
                type : "string"
            },{
                caption : "层级",
                type : "string"
            },{
                caption : "参与商品数",
                type : "number"
            },{
                caption : "参与用户数",
                type : "number"
            },{
                caption : "新增订单数/订单总数",
                type : "string"
            },{
                caption : "新增订单金额/订单总金额",
                type : "string"
            },{
                caption : "返利到账金额",
                type : "number"
            },{
                caption : "退出率",
                type : "string"
            }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/planOne",
        modelName : [ "RebateShopPlanTop" ],
        excel_export : true,
        flexible_btn : [{
            content: '导出',
            preMethods: ['excel_export'],
            customMethods: ''
        }],
        date_picker_data: 1,
        filter(data, filter_key) {
            return businessRebate.planOne(data);
        },
        rows : [
            [ "id", "plan_name", "shop_name", "deadline", "related_flow", "level", "spu_num", "user_num",
                "pay_rate", "pay_price_rate", "rebate_amount", "refund_rate" ]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                },{
                caption : "返利计划名称",
                type : "string"
            },{
                caption : "商家名称",
                type : "string"
            },{
                caption : "有效期",
                type : "string"
            },{
                caption : "相关流程",
                type : "string"
            },{
                caption : "层级",
                type : "string"
            },{
                caption : "参与商品数",
                type : "number"
            },{
                caption : "参与用户数",
                type : "number"
            },{
                caption : "新增订单数/订单总数",
                type : "string"
            },{
                caption : "新增订单金额/订单总金额",
                type : "string"
            },{
                caption : "返利到账金额",
                type : "number"
            },{
                caption : "退出率",
                type : "string"
            }
            ]
        ]
    });

    return Router;
};
