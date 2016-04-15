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
        modelName : ["ShopList"],
        platform : false,
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'shop_new_num',
                value: '新增注册店铺'
            }, {
                key: 'shop_succ_num',
                value: '成功入驻店铺'
            }, {
                key: 'shop_order_succ_num',
                value: '成功交易店铺'
            }, {
                key: 'shop_access_num',
                value: '被访问店铺数'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.shopOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/achievements/shopTwo",
        modelName : ["ShopList"],
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
        modelName : ["ShopTop"],
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
        modelName : ["ShopList"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.outerTwo(data);
        },
        rows : [
            ['channel','open_num','open_num_rate']
        ],
        cols : [
            [
                {
                    caption: '分享平台',
                    type: 'string'
                },
                {
                    caption: '累计打开次数',
                    type: 'number'
                },
                {
                    caption: '打开次数占比',
                    type: 'string'
                }
            ]
        ]
    });

    return Router;
};