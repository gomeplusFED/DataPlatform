/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 * @二次开发 20161025 Mr.He
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_shopOverview"),
    util = require("../../../utils");

module.exports = (Router) => {

    //全页面
    Router.get("/achievements/shopOverviewZero_json" , (req , res , next) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                filter_select: [{
                    title: '商家类型',
                    filter_key : 'shop_type',
                    groups: [{
                        key: 'shop_type_all',
                        value: '全部商家'
                    }, {
                        key: '2',
                        value: 'XPOP商家'
                    }, {
                        key: '3',
                        value: 'O2M商家'
                    }]
                }]
            }
        });
    });

    Router = new api(Router,{
        router : "/achievements/shopOverviewOne",
        modelName : ["ShopOverview"],
        platform : false,
        date_picker: false,
        params(query , params , sendData){
            params.date = util.beforeDate(new Date , 2)[1];
            if(!query.shop_type){
                params.shop_type = "shop_type_all";
            }
            return params;
        },
        rows : [
            [ 'all', 'shop_check', 'shop_run', 'shop_rest',
                "shop_frost",'shop_stop' ]
        ],
        cols : [
            [
                {
                    caption : '累计店铺',
                    type : 'number'
                },
                {
                    caption : '入驻中店铺',
                    type : 'number'
                },
                {
                    caption : '运营中店铺',
                    type : 'number'
                },
                {
                    caption : '休店店铺',
                    type : 'number'
                },
                {
                    caption : '冻结店铺',
                    type : 'number'
                },
                {
                    caption : '关闭店铺',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopOverviewOne(data, query, dates);
        }
    });

    //店铺申请运营
    Router = new api(Router,{
        router : "/achievements/shopOverviewTwo",
        modelName : ["ShopOverview"],
        platform : false,
        params(query , params , sendData){
            if(!query.shop_type){
                params.shop_type = "shop_type_all";
            }
            return params;
        },
        rows : [
            [ 'shop_run', 'shop_rest', 'shop_frost', 'shop_stop',
                "shop_success" ]
        ],
        cols : [
            [
                {
                    caption : '新增营运店铺',
                    type : 'number'
                },
                {
                    caption : '新增休店店铺',
                    type : 'number'
                },
                {
                    caption : '新增冻结店铺',
                    type : 'number'
                },
                {
                    caption : '新增关闭店铺',
                    type : 'number'
                },
                {
                    caption : '入驻成功店铺',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopOverviewTwo(data, query, dates);
        }
    });

    //店铺运营趋势
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
                caption: '店铺访问量',
                type: 'number'
            }, {
                caption: '店铺访问量占比',
                type: 'string'
            }, {
                caption: '店铺访客数',
                type: 'number'
            }, {
                caption: '店铺访客数占比',
                type: 'string'
            }, {
                caption: '店铺被分享次数',
                type: 'number'
            }]
        ]
    });

    //店铺评级分布
    Router = new api(Router,{
        router : "/achievements/shopOverviewFour",
        modelName : ["ShopLevel"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            return params;
        },
        filter(data , query) {
            return filter.shopOverviewFour(data, query);
        }
    });

    return Router;
};