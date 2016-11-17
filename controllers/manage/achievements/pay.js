/**
 * @author Hao Sun
 * @date 20160518
 * @fileoverview 交易分析
 *
 * 二次开发
 * @time 20161109
 * @author Mr.He
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_pay");

module.exports = (Router) => {
   
    Router = Router.get("/achievements/payZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
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

    //支付趋势
    Router = new api(Router, {
        router : "/achievements/payOne",
        modelName : ["PayTrend2"],
        platform : false,
        /*global_platform: {
            show: true,
            key : "type",
            name : "平台切换（默认全部平台）",
            list : [{
                key: 'ALL',
                name: '全部平台'
            },{
                key: 'APP',
                name: 'APP'
            },{
                key: 'WAP',
                name: 'WAP'
            },{
                key: 'PC',
                name: 'PC'
            }]
        },*/
        toggle: true,
        paging: [true],
        order : ["-date"],

        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.payOne(data , query , dates);
        },
        fixedParams(req, query, cb) {

            if(query.category_id && query.category_id != "all"){
                req.models.ConfCategories.find({
                    id : query.category_id
                } , (err , data) => {
                    if(err){
                        cb(err);
                    }else{
                        let theLevel = data[0].level + 1;
                        switch(theLevel){
                            case 1:   
                                query.category_id_1 = query.category_id;   
                                query.filter_key = 1;
                                break;
                            case 2:   
                                query.category_id_2 = query.category_id;
                                query.filter_key = 2;
                                break;
                            case 3:   
                                query.category_id_3 = query.category_id;
                                query.filter_key = 3;
                                break;
                            case 4:   
                                query.category_id_4 = query.category_id; 
                                query.filter_key = 4;
                        }
                        delete query.category_id;
                        cb(null , query);
                    }
                });
            }else{
                query.category_id_1 = "ALL";
                query.category_id_2 = "ALL";
                query.category_id_3 = "ALL";
                query.category_id_4 = "ALL";
                delete query.category_id;
                cb(null , query);
            }
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        rows: [
            [
                "date",
                "order_sum",
                "pay_sum", 
                "pay_user",
                "pay_num",
                "pay_product", 
                "pay_lv"
            ]
        ],
        cols: [
            [{
                caption: "日期",
                type: "date"
            }, {
                caption: "下单金额",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }, {
                caption: "支付人数",
                type: "number"
            }, {
                caption: "支付订单数",
                type: "number"
            }, {
                caption: "支付商品数",
                type: "number"
            }, {
                caption: "支付转化率(%)",
                type: "number"
            }]
        ]
    });

    //支付方式
    Router = new api(Router,{
        router : "/achievements/payTwo",
        modelName : ["PayWay2"],
        platform : false,
        toggle: true,
        cols: [
            [{
                caption:"日期",
                type: "date"
            }, {
                caption:"微信支付成功次数",
                type: "number"
            }, {
                caption:"支付宝支付成功次数",
                type: "number"
            }, {
                caption:"其他支付成功次数",
                type: "number"
            }, ]
        ],
        rows: [
            ["date" , "weixin" , "alipay" , "other"]
        ],
        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.payTwo(data, query, dates);
        }
    });

    //支付构成
    Router = new api(Router,{
        router : "/achievements/payThree",
        modelName : ["OrderConstitue2"],
        platform : false,
        order : ["-date"],
        toggle : true,
        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.payThree(data , query , dates);
        },
        cols : [
            [{
                caption: "日期",
                type: "date"
            }, {
                type: 'number',
                caption: '仅国美币'
            }, {
                type: 'number',
                caption: '仅现金'
            }, {
                type: 'number',
                caption: '国美币+现金'
            }, {
                type: 'number',
                caption: '国美币+优惠劵'
            }, {
                type: 'number',
                caption: '优惠劵+现金'
            }, {
                type: 'number',
                caption: '国美币+优惠券+现金'
            }]
        ]
    });


    return Router;
};