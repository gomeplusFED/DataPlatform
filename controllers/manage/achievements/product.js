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
        modelName : ["KeyValue"],
        platform : false,
        fixedParams : {
            key_type : [ "products_acc", "products_order",
                "products_cars", "products_pay", "products_scan" ]
        },
        filter_select: [{
            title: '',
            filter_key : 'key_name',
            groups: [{
                key: ['sku', "sku_spu"],
                value: 'SKU'
            }, {
                key: ['spu', "sku_spu"],
                value: '合并SKU'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.productOne(data, filter_key, dates);
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
        modelName : ["KeyValue"],
        platform : false,
        filter_select: [{
            title: '',
            filter_key : 'key_name',
            groups: [{
                key: 'sku',
                value: 'SKU',
                cell : {
                    title: '',
                    filter_key : 'key_type',
                    groups: [{
                        key: "products_cars",
                        value: '加购商品件数'
                    },{
                        key: "products_order",
                        value: '下单商品件数'
                    },{
                        key: "products_pay",
                        value: '支付商品件数'
                    }]
                }
            }, {
                key: ['spu', "sku_spu"],
                value: '合并SKU',
                cell : {
                    title: '',
                    filter_key : 'key_type',
                    groups: [{
                        key: "products_scan",
                        value: '浏览商品数'
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
        modelName : ["KeyValue"],
        platform : false,
        excel_export : true,
        filter_select: [{
            title: '',
            filter_key : 'key_name',
            groups: [{
                key: ['sku', "sku_spu"],
                value: 'SKU'
            }, {
                key: ['spu', "sku_spu"],
                value: '合并SKU'
            }]
        }],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.productThree(data, dates);
        },
        rows : [
            [ 'one', 'two', 'three', "four", "five", "six", "seven" ]
        ],
        cols : [
            [{
                caption: '日期',
                type: 'date'
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
        router : "/achievements/shopFour",
        modelName : [""],
        platform : false,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopFour(data);
        },
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: '1',
                value: '合并SKU'
            }, {
                key: '2',
                value: 'SKU'
            }]
        }],
        rows : [
            [ 'top', 'shop_name', 'pay_price', 'pay_price_rate', 'pay_commodity_num',
                'pay_commodity_rate', 'share_commodity_num']
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '店铺名称',
                type: 'string'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '支付金额占比',
                type: 'string'
            }, {
                caption: '支付商品数',
                type: 'number'
            }, {
                caption: '支付商品数占比',
                type: 'string'
            }, {
                caption: '被分享商品数',
                type: 'number'
            }]
        ]
    });

    return Router;
};