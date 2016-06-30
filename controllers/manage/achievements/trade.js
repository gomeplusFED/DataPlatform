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
        modelName : ["SalesPerfTranKv"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.tradeOne(data);
        },
        rows: [
            ["tran_acc_pro_num",
                "tran_order_pro_num_spu",
                "tran_order_pro_num_sku", "tran_pay_pro_num_spu", "tran_pay_pro_num_sku",
                "tran_refund_pro_num_spu", "tran_refund_pro_num_sku"
            ],
            [
                "tran_order_user_num", "tran_order_money_amount",
                "tran_pay_user_num",
                "tran_pay_money_amount", "tran_cus_unit_price",
                "tran_balance", "tran_plat_coupon_price", "tran_turnover"
            ]
        ],
        cols: [
            [{
                caption: "浏览商品数",
                type: "number"
            //}, {
            //    caption: "加购商品数",
            //    type: "number"
            //}, {
            //    caption: "加购商品件数",
            //    type: "number"
            }, {
                caption: "下单商品数",
                type: "number"
            }, {
                caption: "下单商品件数",
                type: "number"
            }, {
                caption: "支付商品数",
                type: "number"
            }, {
                caption: "支付商品件数",
                type: "number"
            }, {
                caption: "退货商品数",
                type: "number"
            }, {
                caption: "退货商品件数",
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
                caption: "国美币使用额",
                type: "number"
            }, {
                caption: "优惠卷使用额",
                type: "number"
            }, {
                caption: "交易额",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeTwo",
        modelName : ["SalesPerfTranKv"],
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
            //}, {
            //    key: 'tran_cart_pro_num',
            //    value: '加购商品数'
            //}, {
            //    key: 'tran_cart_pro_num_j',
            //    value: '加购商品件数'
            }, {
                key: 'tran_order_money_amount',
                value: '下单金额'
            }, {
                key: 'tred_deal_money_amount',
                value: '成交金额'
            }, {
                key: 'tran_order_money_amount',
                value: '付款金额'
            }, {
                key: 'tred_order_all_amount',
                value: '下单总量'
            }, {
                key: 'tred_pay_all_amount',
                value: '支付订单量'
            }, {
                key: 'tred_pay_user_num',
                value: '支付人数'
            }, {
                key: 'tran_order_pro_num_spu',
                value: '下单商品数'
            }, {
                key: 'tran_order_pro_num_sku',
                value: '下单商品件数'
            }, {
                key: "tran_guest_unit_price",
                value: '客单价'
            }, {
                key: "tran_row_unit_price",
                value: '笔单价'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.tradeTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/achievements/tradeThree",
        modelName : ["SalesPerfTranKv"],
        platform : false,
        excel_export : true,
        paging : true,
        order : ["-date"],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.tradeThree(data, dates);
        },
        rows : [
            [ 'date', 'tred_order_all_amount', 'tred_pay_all_amount', 'tran_order_money_amount',
                'tran_pay_money_amount', 'tran_guest_unit_price', 'del_use_coupon_rate',
                'del_refund_amount','del_refund_num']
        ],
        cols : [
            [
                {
                    caption : '日期',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '下单总量',
                    type : 'number'
                },
                {
                    caption : '支付订单量',
                    type : 'number'
                },
                {
                    caption : '下单金额',
                    type : 'number'
                },
                {
                    caption : '支付金额',
                    type : 'number'
                },
                {
                    caption : '客单价',
                    type : 'number'
                },
                {
                    caption : '优惠券使用率',
                    type : 'string'
                },
                {
                    caption : '退款金额',
                    type : 'number'
                },
                {
                    caption : '退货数',
                    type : 'number'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeFour",
        modelName : ["TradeCaty"],
        platform : false,
        paging : true,
        date_picker_data : 1,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter_select: [{
            title: '',
            filter_key : 'caty_level',
            groups: [{
                key: 2,
                value: '二级类目'
            }, {
                key: 3,
                value: '三级类目'
            }, {
                key: 4,
                value: '四级类目'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.tradeFour(data, filter_key);
        },
        rows : [
            [ 'caty_name', 'access_num', 'access_users', 'sales_pro_num',
                'pay_money_amount', 'pay_money_amount_ratio'
            ]
        ],
        cols : [
            [
                {
                    caption : '类目名称',
                    type : 'string'
                },
                {
                    caption : '浏览量',
                    type : 'number'
                },
                {
                    caption : '访客数',
                    type : 'number'
                },
                {
                    caption : '销量',
                    type : 'number'
                },
                {
                    caption : '销售金额',
                    type : 'number'
                },
                {
                    caption : '销售金额占比',
                    type : 'string'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeFive",
        modelName : ["TradeUser"],
        platform : false,
        date_picker_data : 1,
        paging : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.tradeFive(data, dates);
        },
        rows : [
            [ 'area', 'deal_money_amount', 'deal_money_ratio', 'deal_pro_num',
                'deal_pro_ratio', 'cus_unit_price',
                'buyersum', 'quantitysum', 'payordersum'
            ]
        ],
        cols : [
            [
                {
                    caption : '地区',
                    type : 'string'
                },
                {
                    caption : '支付金额',
                    type : 'number'
                },
                {
                    caption : '支付金额占比',
                    type : 'number'
                },
                {
                    caption : '支付商品数',
                    type : 'number'
                },
                {
                    caption : '支付商品数占比',
                    type : 'number'
                },
                {
                    caption: '客单价',
                    type: 'number'
                },
                {
                    caption: '成交人数',
                    type: 'number'
                },
                {
                    caption: '成交件数',
                    type: 'number'
                    },
                    {
                        caption: '成交订单量',
                        type: 'number'
                    }
            ]
        ]
    });

    return Router;
};