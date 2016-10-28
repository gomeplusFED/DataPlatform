/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_shopRun"),
    util = require("../../../utils");

let NumberReg = /\D/i;


module.exports = (Router) => {

    //全页面
    Router.get("/achievements/shopRunZero_json" , (req , res , next) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                filter_select: [{
                    title: '商家类型',
                    filter_key : 'shop_type',
                    groups: [{
                        key: 'All',
                        value: '全部商家'
                    }, {
                        key: '1',
                        value: 'XPOP商家'
                    }, {
                        key: '2',
                        value: 'O2M商家'
                    }]
                }]
            }
        });
    });

    //运营--店铺总览
    Router = new api(Router, {
        router : "/achievements/shopRunOne",
        modelName : ["ShopRunOverview" , "ShopRunAnalyze"],     
        platform : false,
        params(query , params , sendData){
            console.log(params);
            if(!query.shop_type){
                params.shop_type = "All";
            }
            return params;
        },
        secondParams(query , params , sendData){
            console.log(params);
            return params;
        },
        rows : [
            [ 'shop_uv', 'shop_pv', 'shop_visit', 'shop_deep',
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



    //运营--店铺流量排行TOP50
    Router = new api(Router,{
        router : "/achievements/shopRunThree",
        modelName : ["ShopRunTopMuil"],
        platform : false,
        excel_export : true,
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
        params(query , params , sendData){
            if(!query.shop_type) params.shop_type = "All";

            if(query.search_key && NumberReg.test(query.search_key)){
                //店铺名
                params.shop_name = query.search_key;
            }else if(query.search_key){
                //店铺ID
                params.shop_id = query.search_key;
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
                    type : 'number'
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
                    type : 'number'
                },
                {
                    caption : '店铺访客数',
                    type : 'number'
                },
                {
                    caption : '访客数占比',
                    type : 'number'
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
        params(query , params , sendData){
            if(!query.shop_type) params.shop_type = "All";

            if(query.search_key && NumberReg.test(query.search_key)){
                //店铺名
                params.shop_name = query.search_key;
            }else if(query.search_key){
                //店铺ID
                params.shop_id = query.search_key;
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
                    type : 'number'
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