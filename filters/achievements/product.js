/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */

var util = require("../../utils"),
    moment = require("moment");

var prizeRange = {
    "0" : "0~10",
    "2" : "10~20",
    "3" : "20~30",
    "4" : "30~40",
    "5" : "40~50",
    "6" : "50~60"
}


module.exports = {
    productOne(data, filter_key) {

        var source = data.first.data[0];
        return util.toTable([source], data.rows, data.cols);
    },
    productTwo(data, query) {
        var source = data.first.data[0],
            rows   = ["昨日" , "前日" , "环比" , "7日平均环比"],
            result = [],
            configRow = data.rows[0],
            dates = query.date;

        //给默认值0.
        for(let key of rows){
            var obj = {};
            for(let item of configRow){
                obj[item] = 0;
            }
            obj.names = key;
            result.push(obj);
        }
        
        //整理数据
        var sourceObj = {};
        for(let item of source){
            sourceObj[item.date] = item;
        }

        //昨日
        var data1 = sourceObj[dates[1]];
        if(data1){
            var obj = {};
            for(let item of configRow){
                obj[item] = data1[item];
            }
            obj.names = "昨日";
            result.push(obj);
        }

        //前日
        var data2 = sourceObj[dates[2]];
        if(data2){
            var obj = {};
            for(let item of configRow){
                obj[item] = data1[item];
            }
            obj.names = "前日";
            result.push(obj);
        }

        //环比


        //7日平均环比


       return util.toTable([result], data.rows, data.cols);
    },
    productThree(data, query) {
        var source = data.first.data[0],
            type   = "pie",
            map    = {
                value : "总商品数(万)"
            },
            newData = {
                "gg" : { value: 12 },
                "gg1": { value: 13 },
                "gg2": { value: 14 }
            };

        var n = 0;
        for(let item of source){
            newData["gg"+n] = {
                value : item.items_count
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },
    productFour(data, page , dates) {
        var source = data.first.data[0],
            type   = "pie",
            map    = {
                value : "新增商品数"
            },
            newData = {
                "gg" : { value: 12 },
                "gg1": { value: 13 },
                "gg2": { value: 14 }
            };

        var n = 0;
        for(let item of source){
            if(item.isnew == 0) continue;
            newData["gg"+n] = {
                value : item.items_count
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },
    productFive(data, query, dates) {
        var source = data.first.data[0],
            type   = "line",
            map    = {
                "items_add"   : "新增商品数",
                "items_put"   : "上架商品数",
                "items_down"  : "下架商品数",
                "items_frost" : "冻结商品数",
                "items_delete": "删除商品数"
            },
            newData = {};

        //初始化数据为0.
        for(let date of dates){
            newData[date] = { 
                "items_add" : 0,
                "items_put" : 0,
                "items_down": 0,
                "items_frost": 0,
                "items_delete":0
            };
        }

        for(let item of source){
            for(var key in newData[item.date]){
                newData[item.date][key] += item[key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },
    productSix(data , query ,dates){
        var source = data.first.data[0],
            result = [];

       /* console.log(123,dates);
        for(var len=dates.length-1;len>=0;len--){
            console.log(dates[len]);
        }*/


        return util.toTable([source], data.rows, data.cols); 
    }
};