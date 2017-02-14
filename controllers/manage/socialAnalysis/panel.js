/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/socialAnalysis/f_panel"),
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

    //圈子汇总
    Router = new api(Router, {
        router : "/socialAnalysis/panelOne",
        modelName : ["GroupStatistics"],
        platform : false,
        date_picker : false,
        flexible_btn : [{
            content: `<a href="#!/socialAnalysis/group">圈子分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            params.category_id = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelOne(data , query , dates);
        },
        rows: [
            ["new_group_num" , "new_join_group_num" , "new_group_user_num" , "quit_group_user"]
        ]
    });

    //话题汇总
    Router = new api(Router, {
        router : "/socialAnalysis/panelTwo",
        modelName : ["SocialTopicStatistics"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            params.category_id = "ALL";
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/socialAnalysis/topics">话题分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelTwo(data , query , dates);
        },
        rows: [
            ["A" , "B" , "C" , "D"]
        ]
    });

    //话题交易汇总
    Router = new api(Router, {
        router : "/socialAnalysis/panelThree",
        modelName : ["SocialTopicStatistics"],
        platform : false,
        date_picker : false,
        rows: [
            ["A" , "B" , "C" , "D" , "operating"]
        ],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        flexible_btn : [{
            content: `<a href="#!/socialAnalysis/topicDeal">话题交易分析</a>`, 
            preMethods: [], 
            customMethods: ""
        }],
        filter(data, query, dates) {
            return filter.tradePanelThree(data , query , dates);
        }
    });

    //话题交易汇总---补充
    Router = new api(Router, {
        router : "/socialAnalysis/panelThree_add",
        modelName : ["SocialTopicStatistics"],
        platform : false,
        date_picker : false,
        toggel : true,
        order : ["-date"],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
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
        rows: [
            ["date" , "is_topic_order_mem" , "is_topic_paid_mem" , "is_topic_order_num" , "is_topic_paid_num" , "is_topic_paid_amount"]
        ],
        cols: [
            [{
                caption: "日期",
                type: "date"
            }, {
                caption: "下单人数",
                type: "number"
            }, {
                caption: "支付人数",
                type: "number"
            }, {
                caption: "新增订单量",
                type: "number"
            }, {
                caption: "支付订单量",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }]
        ]
    });


    //好友关系汇总
    Router = new api(Router, {
        router : "/socialAnalysis/panelFour",
        modelName : ["GroupStatistics"],
        platform : false,
        date_picker : false,
        rows: [
            ["A" , "B" , "C" , "D"]
        ],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        // flexible_btn : [{
        //     content: `<a href="#!/achievements/pay">好友数据分析</a>`, 
        //     preMethods: [], 
        //     customMethods: ""
        // }],
        filter(data, query, dates) {
            return filter.tradePanelFour(data , query , dates);
        }
    });

    //兴趣点汇总
    Router = new api(Router, {
        router : "/socialAnalysis/panelFive",
        modelName : ["GroupStatistics"],
        platform : false,
        date_picker : false,
        rows: [
            ["A" , "B" , "C" , "D"]
        ],
        params(query , params , sendData){
            if(!query.type) params.type = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.tradePanelFive(data , query , dates);
        }
    });

    return Router;
};