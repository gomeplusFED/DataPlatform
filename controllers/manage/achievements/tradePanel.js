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
            content: `<a href="#!/achievements/trade">交易分析</a>`, 
            preMethods: [], 
            customMethods: ""
        },{
            content: `<a href="#!/achievements/order">订单分析</a>`, 
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
                caption: ""
            }]
        ]
    });

    //交易商品汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelTwo_add",
        modelName : ["SalesPerfProTotal2"],
        platform : false,
        date_picker : false,
        paging : [true],
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";

            delete params.order_user;
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelTwo_add(data , query , dates);
        },
        rows: [
            ["date" ,"access_user" , "order_user" , "order_num"]
        ],
        cols: [
            [{
                caption: "日期",
                type   : "date"
            }, {
                caption: "浏览商品数",
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


     //支付方式汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelThree",
        modelName : ["SalesPerfPayModeTotal2"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/achievements/pay">支付分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelThree(data , query , dates);
        },
        rows: [
            ["all_pay_num" , "aliy_pay" , "weixin_pay" , "other_pay" , "operating"]
        ],
        cols: [
            [{
                caption: "总支付笔数",
                type: "number"
            }, {
                caption: "支付宝支付笔数",
                type: "number"
            }, {
                caption: "微信支付笔数",
                type: "number"
            }, {
                caption: "其它支付笔数",
                type: "number"
            }, {
                caption: ""
            }]
        ]
    });

    //支付方式汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelThree_add",
        modelName : ["SalesPerfPayModeTotal2"],
        platform : false,
        date_picker : false,
        paging : [true],
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            delete params.aliy_pay;
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelThree_add(data , query , dates);
        },
        rows: [
            ["date" , "all_pay_num" , "aliy_pay" , "weixin_pay" , "other_pay"]
        ],
        cols: [
            [{
                caption: "日期",
                type: "date"
            }, {
                caption: "总支付笔数",
                type: "number"
            }, {
                caption: "支付宝支付笔数",
                type: "number"
            }, {
                caption: "微信支付笔数",
                type: "number"
            }, {
                caption: "其它支付笔数"
            }]
        ]
    });


    //国美币汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelFour",
        modelName : ["SalesPerfGuomeibiTotal2"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelFour(data , query , dates);
        },
        rows: [
            ["newadd_guomeibi" , "consume_guomeibi" , "drawcash_guomeibi" , "operating"]
        ],
        cols: [
            [{
                caption: "新增国美币",
                type: "number"
            }, {
                caption: "消费国美币",
                type: "number"
            }, {
                caption: "提现国美币",
                type: "number"
            }, {
                caption: ""
            }]
        ]
    });

    //国美币汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelFour_add",
        modelName : ["SalesPerfGuomeibiTotal2"],
        platform : false,
        date_picker : false,
        paging : [true],
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            delete params[sendData.rows[0][2]];
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelFour_add(data , query , dates);
        },
        rows: [
            ["date" , "newadd_guomeibi" , "consume_guomeibi" , "drawcash_guomeibi"]
        ],
        cols: [
            [{
                caption: "日期",
                type: "date"
            }, {
                caption: "新增国美币",
                type: "number"
            }, {
                caption: "消费国美币",
                type: "number"
            }, {
                caption: "提现国美币",
                type: "number"
            }]
        ]
    });


    //交易优惠券汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelFive",
        modelName : ["SalesPerfCoupleTotal2"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/coupon">优惠劵分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelFive(data , query , dates);
        },
        rows: [
            ["used_num" , "used_amount" , "lv"],
            ["used_num" , "used_amount" , "lv" , "operating"],
        ],
        cols: [
            [{
                caption: "平台优惠券使用张数",
                type: "number"
            }, {
                caption: "平台优惠券使用金额",
                type: "number"
            }, {
                caption: "平台优惠券使用占比",
                type: "number"
            }, {
                caption: ""
            }],

            [{
                caption: "商家优惠券使用张数",
                type: "number"
            }, {
                caption: "商家优惠券使用金额",
                type: "number"
            }, {
                caption: "商家优惠券使用占比",
                type: "number"
            }, {
                caption: ""
            }]
        ]
    });

    //交易优惠券汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelFive_add",
        modelName : ["SalesPerfCoupleTotal2"],
        platform : false,
        date_picker : false,
        paging : [true],
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            delete params[sendData.rows[0][2]];            
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelFive_add(data , query , dates);
        },
        rows: [
            ["date" , "used_num" , "used_amount" , "lv" , "used_num_2" , "used_amount_2" , "lv_2"]
        ],
        cols: [
            [{
                caption : "日期",
                type : "date"
            }, {
                caption: "平台优惠券使用张数",
                type: "number"
            }, {
                caption: "平台优惠券使用金额",
                type: "number"
            }, {
                caption: "平台优惠券使用占比(%)",
                type: "number"
            }, {
                caption: "商家优惠券使用张数",
                type: "number"
            }, {
                caption: "商家优惠券使用金额",
                type: "number"
            }, {
                caption: "商家优惠券使用占比(%)",
                type: "number"
            }]
        ]
    });








    //转化率
    Router = new api(Router, {
        router : "/achievements/tradePanelSix",
        modelName : ["SalesPerfConversion2"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelSix(data , query , dates);
        },
        rows: [
            ["scan_order" , "scan_pay" , "order_pay" , "pay_lv" , "operating"],
        ],
        cols: [
            [{
                caption: "浏览-下单转化率",
                type: "number"
            }, {
                caption: "浏览-支付转化率",
                type: "number"
            }, {
                caption: "下单-支付转化率",
                type: "number"
            }, {
                caption: "支付成功率",
                type: "number"
            }, {
                caption: ""
            }]
        ]
    });

    //转化率---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelSix_add",
        modelName : ["SalesPerfConversion2"],
        platform : false,
        date_picker : false,
        paging : [true],
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            delete params[sendData.rows[0][2]]; 
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelSix_add(data , query , dates);
        },
         rows: [
            ["date" , "scan_order" , "scan_pay" , "order_pay" , "pay_lv"],
        ],
        cols: [
            [{
                caption: "日期",
                type: "number"
            }, {
                caption: "浏览-下单转化率(%)",
                type: "number"
            }, {
                caption: "浏览-支付转化率(%)",
                type: "number"
            }, {
                caption: "下单-支付转化率(%)",
                type: "number"
            }, {
                caption: "支付成功率(%)",
                type: "number"
            }]
        ]
    });


    return Router;
};