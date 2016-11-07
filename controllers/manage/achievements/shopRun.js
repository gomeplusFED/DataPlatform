/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_shopRun"),
    util = require("../../../utils");
let orm = require("orm");
let NumberReg = /\D/i;


module.exports = (Router) => {

    //运营--店铺总览
    Router = new api(Router, {
        router : "/achievements/shopRunOne",
        modelName : ["ShopRunOverview" , "ShopRunAnalyze"],     
        platform : false,
        global_platform: {
            show: true,
            key: 'shop_type',
            name : "商家类型：",
            list: [{
                key: 'ALL',
                name: '全部商家'
            }, {
                key: '1',
                name: 'XPOP商家'
            }, {
                key: '2',
                name: 'O2M商家'
            }]
        },
        params(query , params , sendData){
            let shop_type = params.shop_type;
            params.shop_type = shop_type ? shop_type : "all";
            return params;
        },
        secondParams(query , params , sendData){
            return params;
        },
        rows : [
            [ 'shop_uv', 'shop_pv', 'shop_visit_lv', 'shop_deep',
                "shop_collect_num",'shop_share',"shop_like","Man_price" ],
            [ "shop_order", "shop_pay_all", "shop_pay_order", "shop_success", "shop_pay" , "shop_return" , "shop_return_money" , "Every_price"]
        ],
        cols : [
            [
                {
                    caption : '店铺UV',
                    type : 'number'
                },
                {
                    caption : '店铺PV',
                    type : 'number'
                },
                {
                    caption : '平均访问店铺数',
                    type : 'number'
                },
                {
                    caption : '平均访问深度',
                    type : 'number'
                },
                {
                    caption : '收藏店铺次数',
                    type : 'number'
                },
                {
                    caption : '分享店铺次数',
                    type : 'number'
                },
                {
                    caption : '点赞店铺次数',
                    type : 'number'
                },
                {
                    caption : '客单价',
                    type : 'number'
                }
            ],

            [
                {
                    caption : '下单总量',
                    type : 'number'
                },
                {
                    caption : '下单总金额',
                    type : 'number'
                },
                {
                    caption : '支付订单量',
                    type : 'number'
                },
                {
                    caption : '成交总金额',
                    type : 'number'
                },
                {
                    caption : '支付总金额',
                    type : 'number'
                },
                {
                    caption : '退货订单量',
                    type : 'number'
                },
                {
                    caption : '退货总金额',
                    type : 'number'
                },
                {
                    caption : '笔单价',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopRunOne(data, query, dates);
        }
    });

    //运营--店铺趋势分析
    Router = new api(Router,{
        router : "/achievements/shopRunTwo",
        modelName : ["ShopRunAnalyze" , "ShopRunOverview"],
        platform : false,
        toggle : {
            show : true
        },
        paging : [true , true],
        order : ["-date"],
        params(query , params , sendData){
            let shop_type = params.shop_type;
            params.shop_type = shop_type ? shop_type : "all";
            return params;
        },
        secondParams(query , params , sendData){
            if(!query.shop_type){
                params.shop_type = "ALL";
            }
            return params;
        },
        rows : [
            [ 'date', 'shop_order_num', 'shop_order_success', 'shop_order_return',
                "shop_like_num" , "shop_visit_num" , "shop_share_num" , "shop_collect_num" ]
        ],
        cols : [
            [
                {
                    caption : '日期',
                    type : 'date'
                },
                {
                    caption : '下单店铺数',
                    type : 'number'
                },
                {
                    caption : '支付店铺数',
                    type : 'number'
                },
                {
                    caption : '退货店铺数',
                    type : 'number'
                },
                {
                    caption : '被点赞店铺数',
                    type : 'number'
                },
                {
                    caption : '被访问店铺数',
                    type : 'number'
                },
                {
                    caption : '被分享店铺数',
                    type : 'number'
                },
                {
                    caption : '被收藏店铺数',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopRunTwo(data, query, dates);
        }
    });

    //运营--店铺流量排行TOP50
    Router = new api(Router,{
        router : "/achievements/shopRunThree",
        modelName : ["ShopRunTopMuil"],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        search : {
            show : true,
            title : "请输入店铺名称或ID",
            key : "search_key"
        },
        order : ["-shop_pv"],
        sum : ["shop_pv" , "shop_uv"],
        params(query , params , sendData){
            let shop_type = params.shop_type;
            params.shop_type = shop_type ? shop_type : "all";

            if(query.search_key && NumberReg.test(query.search_key)){
                //店铺名
                params.shop_name = query.search_key;
            }else if(query.search_key){
                //店铺ID
                params.shop_id = query.search_key;
            }else{
                params.shop_name = orm.not_in(["ALL"]);
            }

            delete params.search_key; 
            return params;
        },
        rows : [
            [ 'sort', 'shop_name', 'shop_pv', 'shop_pv_lv',
                "shop_uv",'shop_uv_lv',"item_share" , "show_col_user" , "shop_like" ]
        ],
        cols : [
            [
                {
                    caption : '排名',
                    type : "number"
                },
                {
                    caption : '店铺名称',
                    type : 'number'
                },
                {
                    caption : '店铺访问量',
                    type : 'number'
                },
                {
                    caption : '访问量占比',
                    type : 'string'
                },
                {
                    caption : '店铺访客数',
                    type : 'number'
                },
                {
                    caption : '访客数占比',
                    type : 'string'
                },
                {
                    caption : '被分享次数',
                    type : 'number'
                },
                {
                    caption : '收藏用户数',
                    type : 'number'
                },
                {
                    caption : '点赞用户数',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopRunThree(data, query, dates);
        }
    });

    //运营--店铺交易排行TOP50
    Router = new api(Router,{
        router : "/achievements/shopRunFour",
        modelName : ["ShopRunTopDeal"],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        order : ["-shop_pay_order"],
        search : {
            show : true,
            title : "请输入店铺名称或ID",
            key : "search_key"
        },
        sum : ["shop_pay_order"],
        params(query , params , sendData){
            let shop_type = params.shop_type;
            params.shop_type = shop_type ? shop_type : "all";

            if(query.search_key && NumberReg.test(query.search_key)){
                //店铺名
                params.shop_name = query.search_key;
            }else if(query.search_key){
                //店铺ID
                params.shop_id = query.search_key;
            }else{
                params.shop_name = orm.not_in(["ALL"]);
            }

            delete params.search_key; 
            return params;
        },
        rows : [
            [ 'sort', 'shop_name', 'shop_pay_order', 'shop_pay_order_lv',

                "shop_pay",'shop_num',"shop_order" , "track_item_num" , "Every_price" , "Every_Man_price" ]
        ],
        cols : [
            [
                {
                    caption : '排名',
                    type : 'number'
                },
                {
                    caption : '店铺名称',
                    type : 'number'
                },
                {
                    caption : '支付订单量',
                    type : 'number'
                },
                {
                    caption : '支付订单占比',
                    type : 'string'
                },
                //gg
                {
                    caption : '支付金额',
                    type : 'number'
                },
                {
                    caption : '支付商品件数',
                    type : 'number'
                },
                {
                    caption : '下单总量',
                    type : 'number'
                },
                {
                    caption : '退货商品件数',
                    type : 'number'
                },
                {
                    caption : '笔单价',
                    type : 'number'
                },
                {
                    caption : '客单价',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopRunFour(data, query, dates);
        }
    });

    return Router;
};