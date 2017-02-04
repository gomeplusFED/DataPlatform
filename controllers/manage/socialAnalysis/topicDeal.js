/**
 * @author Mr.He
 * @date 20170105 , 
 * @fileoverview 话题交易接口
 */

var api = require("../../../base/main"),
    orm = require("orm"),
    util = require("../../../utils"),
    filter = require("../../../filters/socialAnalysis/topicData");

module.exports = (Router) => {
    
    Router.get("/socialAnalysis/topicDeal_One_json" , (req , res , next) => {
        let query = req.query;
        req.models.ads2_soc_topic_item.find({
            day_type : query.day_type,
            date     : orm.between(query.startTime , query.endTime)
        } , (err , data) => {
            let Return = {
                "新增数量" : {
                    "0" : 0,
                    "1" : 0
                },
                "PV"    : {
                    "0" : 0,
                    "1" : 0
                },
                "UV"    : {
                    "0" : 0,
                    "1" : 0
                }
            };

            for(let item of data){
                if(item.is_item_topic == 0){
                    Return["新增数量"]["0"] += item.new_topic_num;
                    Return["PV"]["0"] += item.pv;
                    Return["UV"]["0"] += item.uv;
                }else if(item.is_item_topic == 1){
                    Return["新增数量"]["1"] += item.new_topic_num;
                    Return["PV"]["1"] += item.pv;
                    Return["UV"]["1"] += item.uv;
                }
            }

            let ModelData = [{
                "type": "bar", 
                "map": { 
                    "0": "非带商品话题", 
                    "1": "带商品话题"
                }, 
                "data": Return, 
                "config": { "stack": true } 
            }];

            if(query.main_show_type_filter == "table"){
                let rows = ["Blank" , "new_topic_num" , "pv" , "uv"],
                    cols = [
                        {caption:""}, 
                        {caption:"新增数量",type:"number"},
                        {caption:"PV" , type:"number"},
                        {caption:"UV" , type:"number"}
                    ];
                let TableData = [];
                for(let i=0;i<3;i++){
                    let obj = {};
                    switch(i){
                        case 0:
                        obj.Blank = "话题";
                        obj.new_topic_num = Return["新增数量"]["0"] + Return["新增数量"]["1"];
                        obj.pv            = Return["PV"]["0"] + Return["PV"]["1"];
                        obj.uv            = Return["UV"]["0"] + Return["UV"]["1"];
                        break;
                        case 1:
                        obj.Blank = "带商品话题";
                        obj.new_topic_num = Return["新增数量"]["1"];
                        obj.pv            = Return["PV"]["1"];
                        obj.uv            = Return["UV"]["1"];
                        break;
                        case 2:
                        obj.Blank = "话题";
                        obj.new_topic_num = util.toFixed(Return["新增数量"]["1"] , Return["新增数量"]["0"] + Return["新增数量"]["1"]);
                        obj.pv            = util.toFixed(Return["PV"]["1"] , Return["PV"]["0"] + Return["PV"]["1"]);
                        obj.uv            = util.toFixed(Return["UV"]["1"] , Return["UV"]["0"] + Return["UV"]["1"]);
                        break;
                    }
                    TableData.push(obj);
                }
                ModelData = util.toTable([TableData] , [rows] , [cols]);
            }

            res.json({
                code: 200,
                components: {
                    date_picker:{
                        show: true, 
                        defaultData: 7,
                        name : "startTime",
                        endname: "endTime"
                    },
                    toggle : {
                        show : true
                    },
                    filter_select : []
                },
                modelData: ModelData,
            });
        });
    });



    Router.get("/socialAnalysis/topicDeal_Two_json" , (req , res , next) => {
        let query = req.query;
        req.models.ads2_soc_topic_ordered.find({
            day_type : query.day_type,
            date     : orm.between(query.startTime , query.endTime)
        } , (err , data) => {
            let Translate = {
                "order_mem" : "下单人数",
                "order_num" : "新增订单量",
                "paid_mem"  : "支付人数",
                "paid_num"  : "支付订单量",
                "paid_amount": "支付金额"
            } , Return = {};

            for(let key in Translate){
                Return[Translate[key]] = {
                    "0" : 0,
                    "1" : 0
                }
            }

            for(let item of data){
                for(let key in Translate){
                    Return[Translate[key]][item.is_ordered_topic] += item[key];
                    if(key == "paid_amount"){
                        Return[Translate[key]][item.is_ordered_topic] = Return[Translate[key]][item.is_ordered_topic] / 100;
                    }
                }
            }

            let ModelData = [{
                "type": "bar", 
                "map": { 
                    "0": "非话题交易", 
                    "1": "话题交易"
                }, 
                "data": Return, 
                "config": { "stack": true } 
            }];

            if(query.main_show_type_filter == "table"){
                let rows = Object.keys(Translate),
                    cols = [];

                rows.unshift("Blank");
                for(let key in Translate){
                    cols.push({
                        "caption" : Translate[key],
                        "type"    : "number"
                    });
                }
                cols.unshift({
                    "caption" : "",
                    "type"    : "string"
                });

                let TableData = [];
                for(let i=0;i<3;i++){
                    let obj = {};
                    switch(i){
                        case 0:
                        obj.Blank = "平台交易情况";
                        for(let key in Translate){
                            obj[key] = Return[Translate[key]]["0"] + Return[Translate[key]]["1"];
                        }

                        break;
                        case 1:
                        obj.Blank = "话题交易情况";
                        for(let key in Translate){
                            obj[key] = Return[Translate[key]]["1"];
                        }

                        break;
                        case 2:
                        obj.Blank = "话题交易占比";
                        for(let key in Translate){
                            obj[key] = util.toFixed(Return[Translate[key]]["1"] , Return[Translate[key]]["0"] + Return[Translate[key]]["1"]);
                        }
                        break;
                    }
                    TableData.push(obj);
                }

                ModelData = util.toTable([TableData] , [rows] , [cols]);
            }

            res.json({
                code: 200,
                components: {
                    date_picker:{
                        show: true, 
                        defaultData: 7,
                        name : "startTime",
                        endname: "endTime"
                    },
                    toggle : {
                        show : true
                    },
                    filter_select : []
                },
                modelData: ModelData,
            });
        });
    });

    return Router;
};