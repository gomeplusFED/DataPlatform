/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_tradePanel"),
    util = require("../../../utils");

function globalPlatform(type) {
    let all = true;
    let global_platform = {
        show: true,
        key : "type",
        name : "平台选择",
        list : []
    };
    if(type[2] == "1") {
        global_platform.list.push({
            key: "app",
            name: "APP"
        });
    } else {
        all = false;
    }
    if(type[3] == "1") {
        global_platform.list.push({
            key: "pc",
            name: "PC"
        });
    } else {
        all = false;
    }
    if(type[4] == "1") {
        global_platform.list.push({
            key: "wap",
            name: "H5"
        });
    } else {
        all = false;
    }
    if(all) {
        global_platform.list = [{
            key: "ALL",
            name: "全部平台"
        }].concat(global_platform.list);
    }
    return global_platform;
}

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
                }
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelOne(data , query , dates);
        },
        rows: [
            ["access_user" , "order_user" , "order_num" , "order_sum"],
            ["Man_price" , "pay_user" , "pay_num" , "pay_sum"]
        ]
    });

    //交易商品汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelTwo",
        modelName : ["SalesPerfProTotal2"],
        platform : false,
        date_picker : false,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
        ]
    });

    //交易商品汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelTwo_add",
        modelName : ["SalesPerfProTotal2"],
        platform : false,
        date_picker : false,
        // paging : [true],
        toggel : true,
        order : ["-date"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;

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
        order : ["-order_channel"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/achievements/pay">支付分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelThree(data , query , dates);
        }
    });

    //支付方式汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelThree_add",
        modelName : ["SalesPerfPayModeTotal2"],
        platform : false,
        date_picker : false,
        // paging : [true],
        toggel : true,
        order : ["-date","-order_channel"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
            try{
                //rows依据数据库数据生成，不知道前端会发哪个特殊字段。所以过滤所有没有查询意义的字段
                let key = ["starttime" , "endtime" , "day_type" , "type" , "limit" , "page" , "date"];
                for(let n in params){
                    if(key.indexOf(n.toLowerCase()) < 0){
                        delete params[n];
                    }
                }
            }catch(e){}

            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelThree_add(data , query , dates);
        },
        /*rows: [
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
        ]*/
    });

    //国美币汇总
    Router = new api(Router, {
        router : "/achievements/tradePanelFour",
        modelName : ["SalesPerfGuomeibiTotal2"],
        platform : false,
        date_picker : false,
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
        // paging : [true],
        toggel : true,
        order : ["-date"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
            ["used_num" , "used_amount" , "lv" , "operating"],
        ]
    });

    //交易优惠券汇总---补充
    Router = new api(Router, {
        router : "/achievements/tradePanelFive_add",
        modelName : ["SalesPerfCoupleTotal2"],
        platform : false,
        date_picker : false,
        // paging : [true],
        toggel : true,
        order : ["-date"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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
        // paging : [true],
        toggel : true,
        order : ["-date"],
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["36"]);
        },
        params(query , params , sendData){
            if(!query.type) params.type = this.global_platform.list[0].key;
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