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
            content: `<a href="#!/achievements/productSale">支付分析</a>`, 
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
        flexible_btn : [{
            content: `<a href="#!/achievements/productSale">支付分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
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
            delete params.aliy_pay;
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelFour_add(data , query , dates);
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


    return Router;
};