/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../base/api"),
    filter = require("../../filters/platformRebate");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/platformOrderOne",
        modelName : ["Rebate", "RebateRefund"],
        date_picker_data: 1,
        filter(data, filter_key) {
            return filter.one(data);
        },
        rows: [
            ["name", "order_num", "order_amount", "shop_num", "user_num", "product_sku_num"],
            ["rebate_order_num", "rebate_amount_total", "rebate_amount_actual", "rebate_amount", "rate"],
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
        modelName : "Rebate"
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderThree",
        modelName : "Rebate"
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFour",
        modelName : "Rebate"
    });

    return Router;
};