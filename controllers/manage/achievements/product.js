/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/achievements/product");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/achievements/productOne",
        modelName : ["SalesPerfProductKv"],
        platform : false,
        date_picker_data : 1,
        //fixedParams : {
        //    key_type : [ "products_acc", "products_order",
        //        "products_cars", "products_pay", "products_scan" ]
        //},
        filter_select: [{
            title: '',
            filter_key : 'sku_type',
            groups: [{
                key: 2,
                value: 'SKU'
            }, {
                key: 1,
                value: 'item'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.productOne(data, filter_key);
        },
        cols : [
            [
                {
                    caption: '商品访客数',
                    type: 'number'
                }, {
                    caption: '商品访问量',
                    type: 'number'
                }, {
                    caption: '商品页平均停留时长(s)',
                    type: 'number'
                },{
                    caption: '被访问的商品数',
                    type: 'number'
                },{
                    caption: '加购商品数/件数',
                    type: 'number'
                }, {
                    caption: '下单商品数/件数',
                    type: 'number'
                }, {
                    caption: '支付商品数/件数',
                    type: 'number'
                }
            ]
        ],
        rows : [
            [ 'one', 'two', 'three', "four", "five", "six", "seven" ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/productTwo",
        modelName : ["SalesPerfProductKv"],
        platform : false,
        filter_select: [{
            title: '',
            filter_key : 'sku_type',
            groups: [{
                key: 2,
                value: 'SKU',
                cell : {
                    title: '',
                    filter_key : 'filter_key',
                    groups: [{
                        key: "products_cars",
                        value: '商品访问量'
                    },{
                        key: "products_order",
                        value: '下单商品件数'
                    },{
                        key: "products_pay",
                        value: '支付商品件数'
                    }]
                }
            }, {
                key: 1,
                value: 'item',
                cell : {
                    title: '',
                    filter_key : 'filter_key',
                    groups: [{
                        key: "product_scan",
                        value: '被访问的商品数'
                    },{
                        key: "products_order",
                        value: '下单商品数'
                    },{
                        key: "products_pay",
                        value: '支付商品数'
                    }]
                }
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.productTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/achievements/productThree",
        modelName : ["SalesPerfProductKv"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        filter_select: [{
            title: '',
            filter_key : 'sku_type',
            groups: [{
                key: 2,
                value: 'SKU'
            }, {
                key: 1,
                value: 'item'
            }]
        }],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.productThree(data, filter_key);
        },
        rows : [
            [ 'date', 'product_scan', 'products_order', "products_pay", "products_return",
                "pay_fee", "refund_fee" ]
        ],
        cols : [
            [{
                caption: '日期',
                type: 'string'
            }, {
                caption: '被访问商品数',
                type: 'number'
            }, {
                caption: '下单商品数/件数',
                type: 'number'
            }, {
                caption: '支付商品数/件数',
                type: 'number'
            }, {
                caption: '退货商品数/件数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '退货金额',
                type: 'number'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/productFour",
        modelName : ["SalesProductFlowtTop"],
        paging : true,
        order : ["-access_num"],
        sum : ["access_num", "access_users"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.productFour(data, page);
        },
        rows : [
            [ 'top', 'commodity_name', 'access_num', 'access_num_rate', 'access_users',
                'access_users_rate', 'share_num']
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '商品名称',
                type: 'string'
            }, {
                caption: '商品访问量',
                type: 'number'
            }, {
                caption: '商品访问量占比',
                type: 'string'
            }, {
                caption: '商品访客数',
                type: 'number'
            }, {
                caption: '商品访客数占比',
                type: 'string'
            }, {
                caption: '商品被分享次数',
                type: 'number'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/productFive",
        modelName : ["SalesProductMarketTop"],
        platform : false,
        paging : true,
        order : ["-order_price"],
        sum : ["pay_price"],
        date_picker_data : 1,
        showDayUnit : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.productFive(data, page);
        },
        rows : [
            [ 'top', 'commodity_name', 'order_users', 'oder_products',
                'order_price', 'pay_users', 'pay_products',
                'pay_price', 'pay_price_rate', "refund_num" ]
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '商品名称',
                type: 'string'
            }, {
                caption: '下单人数',
                type: 'number'
            }, {
                caption: '下单件数',
                type: 'number'
            },{
                caption: '下单金额',
                type: 'number'
            },{
                caption: '支付人数',
                type: 'number'
            },{
                caption: '支付件数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '支付金额占比',
                type: 'string'
            }, {
                caption: '退货件数',
                type: 'number'
            }]
        ]
    });

    return Router;
};