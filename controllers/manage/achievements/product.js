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
                    caption: '加购商品（数/件数）',
                    type: 'number'
                }, {
                    caption: '下单商品（数/件数）',
                    type: 'number'
                }, {
                    caption: '支付商品（数/件数）',
                    type: 'number'
                }
            ]
        ],
        rows : [
            [ 'one', 'two', 'three', "four", "five", "six", "seven" ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/shopTwo",
        modelName : [""],
        platform : false,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopTwo(data, dates);
        },
        rows : [
            [ 'date', 'shop_new_num', 'shop_succ_num', 'shop_total_num', 'shop_order_num',
                'shop_order_succ_num', 'shop_access_num', 'shop_share_num' ]
        ],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '新增注册店铺',
                    type : 'number'
                },
                {
                    caption : '成功入驻店铺',
                    type : 'number'
                },
                {
                    caption : '累计店铺数',
                    type : 'number'
                },
                {
                    caption : '生成订单店铺数',
                    type : 'number'
                },
                {
                    caption : '成功交易店铺数',
                    type : 'number'
                },
                {
                    caption : '被访问的店铺数',
                    type : 'number'
                },
                {
                    caption : '被分享的店铺数',
                    type : 'number'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/shopThree",
        modelName : [""],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopThree(data);
        },
        rows : [
            [ 'top', 'shop_name', 'access_num', 'access_num_rate', 'access_users', 'access_users_rate',
                'share_commodity_num']
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '店铺名称',
                type: 'string'
            }, {
                caption: '浏览量',
                type: 'number'
            }, {
                caption: '浏览量占比',
                type: 'string'
            }, {
                caption: '访客数',
                type: 'number'
            }, {
                caption: '访客数占比',
                type: 'string'
            }, {
                caption: '被分享商品数',
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