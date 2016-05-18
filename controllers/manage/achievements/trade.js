/**
 * @author Hao Sun
 * @date 20160518
 * @fileoverview 交易分析
 */

var api = require("../../../base/api"),
    filter = require("../../../filters/achievements/trade");

model.exports = (Router) => {
    
    Router = new api(Router, {
        router : "/achievements/tradeOne",
        modelName : ["SalesPerfKeyValue"],
        platform : false,
        rows: [
            ["tran_acc_pro_num", "tran_cart_pro_num", "tran_order_pro_num", "participate_seller_count",
                "participate_user_count", "productSku_num"],
            ["rebate_order_count",
                //"rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count", "rate"],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count",
                //"refund_goods_amount_actual_count"
            ]
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
                //}, {
                //    caption: "返利到账订单总金额",
                //    type: "string"
                //}, {
                //    caption: "返利到账订单实付金额",
                //    type: "string"
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
                //}, {
                //    caption: "实际退货金额",
                //    type: "string"
            }]
        ]
    })
}