/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../base/api");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/platformOrderOne",
        modelName : ["Rebate", "RebateRefund"],
        excel_export : false,
        filter(data, filter_key) {
            return data;
        },
        rows : [
            [ "name", "order_count", "" ],
            [ "participate_user_count", "rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count", "rate"],
            [ "name", "" ]
        ],
        cols : [
            [
                {
                    caption : "",
                    type : "string"
                },{
                    caption : "订单数",
                    type : "string"
                },{
                    caption : "订单总金额",
                    type : "string"
                },{
                    caption : "商家数",
                    type : "string"
                },{
                    caption : "用户数",
                    type : "string"
                },{
                    caption : "商品件数",
                    type : "string"
                }
            ],
            [
                {
                    caption : "返利到账订单数",
                    type : "string"
                },{
                    caption : "返利到账订单总金额",
                    type : "string"
                },{
                    caption : "返利到账订单实付金额",
                    type : "string"
                },{
                    caption : "返利到账金额",
                    type : "string"
                },{
                    caption : "返利比率",
                    type : "string"
                }
            ],
            [
                {
                    caption : "",
                    type : "string"
                },{
                    caption : "退货商品数",
                    type : "string"
                },{
                    caption : "退货商品件数",
                    type : "string"
                },{
                    caption : "退货用户数",
                    type : "string"
                },{
                    caption : "退货商品总金额",
                    type : "string"
                },{
                    caption : "实际退货金额",
                    type : "string"
                }
            ]
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