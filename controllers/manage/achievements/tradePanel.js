/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_tradePanel"),
    util = require("../../../utils");

module.exports = (Router) => {
   

    Router = Router.get("/achievements/tradePanelZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                date_picker:{
                    show: true, 
                    defaultData: 7,
                    name : "startTime",
                    endname: "endTime"
                },
                filter_select: [{
                    title: "平台选择",
                    filter_key: "type",
                    groups: [{
                        key: "ALL",
                        value: "全部平台"
                    }, {
                        key: "app",
                        value: "APP"
                    }, {
                        key: "wap",
                        value: "WAP"
                    }, {
                        key: "pc",
                        value: "PC"
                    }]
                }]
            }
        });
    });

    //交易汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelOne",
        modelName : ["SalesPerfTotal2"],
        platform : false,
        date_picker : false,
        flexible_btn : [{
            content: `<a href="#!/businessRebate/plan">交易分析</a>`, 
            preMethods: [], 
            customMethods: ""
        },{
            content: `<a href="#!/businessRebate/plan">订单分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelOne(data , query , dates);
        },
        rows: [
            ["access_user" , "order_user" , "order_num" , "order_sum"],
            ["Man_price" , "pay_user" , "pay_num" , "pay_sum"]
        ],
        cols: [
            [{
                caption: "访客数",
                type: "number"
            }, {
                caption: "下单人数",
                type: "number"
            }, {
                caption: "下单总量",
                type: "number"
            }, {
                caption: "下单金额",
                type: "number"
            }],

            [{
                caption: "客单价",
                type: "number"
            }, {
                caption: "支付人数",
                type: "number"
            }, {
                caption: "支付总量",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }]
        ]
    });

    //交易商品汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelTwo",
        modelName : ["SalesPerfProTotal2"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/achievements/productSale">商品分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelTwo(data , query , dates);
        },
        rows: [
            ["access_user" , "order_user" , "order_num" , "operating"]
        ],
        cols: [
            [{
                caption: "浏览商品数",
                type: "number"
            }, {
                caption: "下单商品件数",
                type: "number"
            }, {
                caption: "支付商品件数",
                type: "number"
            }, {
                caption: "操作"
            }]
        ]
    });

    //交易商品汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelTwo_add",
        modelName : ["SalesPerfProTotal2"],
        platform : false,
        // date_picker : false,
        // toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";

            console.log(params);
            delete params.order_user;
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelTwo_add(data , query , dates);
        },
        rows: [
            ["date" , "XXX" , "order_user" , "order_num" , "operating"]
        ],
        cols: [
            [{
                caption: "日期",
                type   : "date"
            }, {
                caption: "被访问商品数",
                type: "number"
            }, {
                caption: "下单商品件数",
                type: "number"
            }, {
                caption: "支付商品件数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeThree",
        modelName : ["SalesPerfTranKv"],
        platform : false,
        excel_export : true,
        paging : [true],
        order : ["-date"],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
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
                    caption : '退货件数',
                    type : 'number'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/tradeFour",
        modelName : ["DealCaty"],
        platform : false,
        paging : [true],
        sum : ["pay_money_amount"],
        date_picker_data : 1,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        //fixedParams(query, filter_key, req, cb) {
        //    var _ids = [],
        //        category_id = query.category_id || 0;
        //    req.models.ConfCategories.find({
        //        pid : category_id,
        //        status : 1
        //    }, (err, data) => {
        //        if(err) {
        //            cb(err);
        //        } else {
        //            for(var key of data) {
        //                _ids.push(key.id);
        //            }
        //            query.category_id = _ids;
        //            cb(null, query);
        //        }
        //    });
        //},
        //level_select : true,
        //level_select_name : "category_id",
        //level_select_url : "/api/categories",
        filter(data, query) {
            return filter.tradeFour(data, query);
        },
        rows : [
            [ 'category_name', 'access_num', 'access_users', 'sales_pro_num',
            'pay_money_amount', 'pay_money_amount_ratio']
        ],
        cols : [
            [
                {
                    caption : '类目名称',
                    type : 'string'
                },
                {
                    caption : '类目商品访问量',
                    type : 'number'
                },
                {
                    caption : '类目商品访客数',
                    type : 'number'
                },
                {
                    caption : '支付商品件数',
                    type : 'number'
                },
                {
                    caption : '支付金额',
                    type : 'number'
                },
                {
                    caption : '支付金额占比',
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
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
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
                    caption: '支付人数',
                    type: 'number'
                },
                {
                    caption: '支付件数',
                    type: 'number'
                },
                {
                    caption: '支付订单量',
                    type: 'number'
                }
            ]
        ]
    });

    return Router;
};