/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */

var util = require("../../utils"),
    moment = require("moment");

/* 环比计算 , 昨天－前天  ／  前天 */
function Chain(lastObj , bObj , columns){
    var obj = {};
    for(let key of columns){
        if(key == "names"){
            obj[key] = "日环比";
            continue;
        }
        if(!lastObj[key] || !bObj[key]){
            obj[key] = "0%";
        }else{
            obj[key] = (lastObj[key] - bObj[key]) / bObj[key];
            obj[key] = util.toFixed(obj[key] , 0);
        }        
    }
    return obj;
}

/* 7日环比, 传入7天的数据 */
function Chain7(thisObj , allObj , columns){
    var result={};

    for(let item of columns){
        if(item == "names") continue;
        result[item] = 0;
    }
    var n = 0;
    for(let key in allObj){
        n++;
        for(let item of columns){
            if(item == "names") continue;
            result[item] += allObj[key][item];
        }
    }

    for(let item of columns){
        if(item == "names") continue;
        if(result[item] == 0){
            result[item] = "0%";
            continue;
        }
        var averg = result[item] / n;

        result[item] = thisObj[item] / averg;
        result[item] = util.toFixed( result[item] , 0 );

    }

    result.names = "7日平均环比";
    return result;
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
        var sourceObj = {};
        for(let date of dates){
            var obj = {};
            for(let item of configRow){
                obj[item] = 0;
            }
            sourceObj[date] = obj;
        }
        //整理数据
        for(let item of source){
            item.date = util.getDate(item.date);
            sourceObj[item.date] = item;
        }

        //昨日
        result[0] = sourceObj[dates[1]];
        result[0].names = "昨日";

        //前日
        result[1] = sourceObj[dates[2]];
        result[1].names = "前日";

        //环比
        result[2] = Chain(sourceObj[dates[1]] ,sourceObj[dates[2]] , data.rows[0]);

        //7日平均环比
        result[3] = Chain7(sourceObj[dates[1]] ,sourceObj , data.rows[0]);

       return util.toTable([result], data.rows, data.cols);
    },
    productThree(data, query) {
        var source = data.first.data[0],
            type   = "pie",
            map    = {
                value : "总商品数(万)"
            },
            newData = {};

        var n = 0;
        for(let item of source){
            newData[util.prizeRange[item.tag]] = {
                value : item.items_count / 10000
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
            newData = {};

        var n = 0;
        for(let item of source){
            if(item.isnew == 0) continue;
            if(!newData[util.prizeRange[item.tag]]){
                newData[util.prizeRange[item.tag]] = {
                    value : 0
                }
            }
            newData[util.prizeRange[item.tag]] = {
                value : item.items_count / 10000 + newData[util.prizeRange[item.tag]].value / 1
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
            item.date = util.getDate(item.date);
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

        for(let item of source){
            item.date = util.getDate(item.date);
        }

        return util.toTable([source], data.rows, data.cols); 
    }
};