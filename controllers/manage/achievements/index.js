/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/achievements");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/achievements/shopOne",
        modelName : ["SalesPerfShopKv"],
        platform : false,
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'xpop_shops_num_add_al',
                value: '新增注册店铺'
            }, {
                key: 'xpop_shops_num_succ_add_al',
                value: '成功入驻店铺'
            }, {
                key: 'deal_shops_num',
                value: '成功交易店铺'
            }, {
                key: 'xpop_shops_num_acc_al',
                value: '被访问店铺数'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.shopOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/achievements/shopTwo",
        modelName : ["SalesPerfShopKv"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        //fixedParams : {
        //    key_type : [ "xpop_shops_num_add_al", "xpop_shops_num_succ_add_al",
        //        "xpop_shops_num_acc_al", "xpop_shops_num_succ_tot_al", "xpop_shops_num_share_al",
        //        "xpop_shops_num_succ_order_al", "xpop_shops_num_succ_deal_al"]
        //},
        filter(data, filter_key, dates) {
            return filter.shopTwo(data);
        },
        rows : [
            [ 'date', 'xpop_shops_num_add_al', 'xpop_shops_num_succ_add_al', 'xpop_shops_num_succ_tot_al',
                'order_shops_num', 'deal_shops_num', 'xpop_shops_num_acc_al', 'xpop_shops_num_share_al' ]
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
        modelName : ["ShopAccesTop"],
        platform : false,
        showDayUnit : true,
        paging : true,
        order : ["-access_num"],
        sum : ["access_num", "access_users"],
        excel_export : true,
        date_picker_data : 1,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.shopThree(data, page);
        },
        rows : [
            [ 'top', 'shop_name', 'access_num', 'access_num_rate', 'access_users',
                'access_users_rate', 'share_num']
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
                caption: '被分享次数',
                type: 'number'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/shopFour",
        modelName : ["ShopPayTop"],
        platform : false,
        showDayUnit : true,
        paging : true,
        order : ["-pay_price"],
        sum : ["pay_price", "pay_commodity_num"],
        excel_export : true,
        date_picker_data : 1,
        filter_select: [{
            title: '',
            filter_key : 'sku_type',
            groups: [{
                key: '1',
                value: '合并SKU'
            }, {
                key: '2',
                value: 'SKU'
            }]
        }],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.shopFour(data, filter_key, page);
        },
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