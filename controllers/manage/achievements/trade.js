/**
 * @author Hao Sun
 * @date 20160518
 * @fileoverview 交易分析
 */

var api = require("../../../base/api"),
    filter = require("../../../filters/achievements/trade");

module.exports = (Router) => {
    
    Router = new api(Router, {
        router : "/achievements/tradeOne",
        modelName : ["SalesPerfKeyValue"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.tradeOne(data, dates);
        },
        rows: [
            ["tran_acc_pro_num", "tran_cart_pro_num", "tran_cart_pro_num_j", "tran_order_pro_num",
                "tran_order_pro_num_j", "participate_seller_count",
                "participate_user_count", "productSku_num"],
            ["tran_order_user_num", "tran_order_money_amount", "tran_pay_user_num",
                "tran_pay_money_amount", "tran_cus_unit_price", "tran_refund_pro_num",
                "tran_refund_pro_num_j"
            ]
        ],
        cols: [
            [{
                caption: "浏览商品数",
                type: "number"
            }, {
                caption: "加购商品数",
                type: "number"
            }, {
                caption: "加购商品件数",
                type: "number"
            }, {
                caption: "下单商品数",
                type: "number"
            }, {
                caption: "下单商品件数",
                type: "number"
            }, {
                caption: "付款商品数",
                type: "number"
            }, {
                caption: "付款商品件数",
                type: "number"
            }],
            [{
                caption: "下单人数",
                type: "number"
            }, {
                caption: "下单金额",
                type: "number"
            }, {
                caption: "支付人数",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }, {
                caption: "客单价",
                type: "number"
            }, {
                caption: "退货商品数",
                type: "number"
            }, {
                caption: "退货商品件数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeTwo",
        modelName : ["SalesPerfKeyValue"],
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'tred_acc_shop_num',
                value: '浏览店铺数'
            }, {
                key: 'tred_deal_shop_num',
                value: '成交店铺数'
            }, {
                key: 'tran_acc_pro_num',
                value: '浏览商品数'
            }, {
                key: 'tran_cart_pro_num',
                value: '加购商品数'
            }, {
                key: 'tran_cart_pro_num_j',
                value: '加购商品件数'
            }, {
                key: 'tran_order_money_amount',
                value: '下单金额'
            }, {
                key: 'tred_deal_money_amount',
                value: '成交金额'
            }, {
                key: 'tred_pay_money_amount',
                value: '付款金额'
            }, {
                key: 'tred_order_all_amount',
                value: '下单总量'
            }, {
                key: 'tred_pay_all_amount',
                value: '付款订单量'
            }, {
                key: 'tred_pay_user_num',
                value: '付款人数'
            }, {
                key: 'tran_order_pro_num',
                value: '下单商品数'
            }, {
                key: 'tran_order_pro_num_j',
                value: '下单商品件数'
            }, {
                key: 'tred_cus_unit_price',
                value: '客单价'
            }, {
                key: 'tred_gro_unit_price',
                value: '笔单价'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.tradeTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        
    })


};