/**
 * @author Mr.He
 * @date 20160905
 * @fileoverview 商品分析,销售分析
 */
var util = require(RootPath+"/utils"),
    moment = require("moment");

var prizeRange = {
    "0" : "0~10",
    "2" : "10~20",
    "3" : "20~30",
    "4" : "30~40",
    "5" : "40~50",
    "6" : "50~60"
}

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
    var obj = {},
        result={};

    // console.log(columns);
    // columns = columns.shift(0);
    // console.log(columns);


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
        result[item] = thisObj[item] / (result[item] / n);
        result[item] = util.toFixed( result[item] , 0 );
    }

    result.names = "7日平均环比";

    return result;
}


module.exports = {
    productSaleOne(data, query) {
        var source = data.first.data[0],
            resultArr = [],
            filter_key=query.filter_key,
            num = 0,
            dates = query.dates;

        if(filter_key == "SKU"){
            num = 1;
        }
        var row = [
                "names/names",   
                "product_scan/product_acc_pv",
                "product_collect/product_collect_num",
                "share_commodity/share_commodity_num",
                "product_cart/product_cart_num",
                "order_commodity/order_commodity_num",
                "pay_commodity/pay_commodity_num",
                "products_return/products_return_num"
            ],
            typeRow = ["昨日" , "前日" , "环比" , "7日平均环比"];
        data.rows[0] = [];

        //处理列行的输出
        for(var i=0,len=data.cols[0].length;i<len;i++){
            data.cols[0][i].caption = data.cols[0][i].comment.split("/")[num];
            data.rows[0].push(row[i].split("/")[num]);
        }

        //init data by dates. Keep every date has data. Default 0.
        var initData = {};
        for(let date of dates){
            var obj = {};
            for(let key of data.rows[0]){
                obj[key] = 0;
            }
            initData[date] = obj;
        }

        //select Data, one date and one data , or error.
        for(let item of source){
            initData[item.date] = item;
        }




        // //整理查询数据
        // var result = {};
        // for(let item of source){

        //     result[item.date] = item;
        // }
        // //没查到的数据补空对象
        // for(let date of dates){
        //     if(!result[date]) result[date] = {};
        // }

        // console.log(result);

        //yesterday
        initData[dates[0]].names = "昨日";
        resultArr.push(initData[dates[0]]);

        //before yesterday
        initData[dates[1]].names = "前日";
        resultArr.push(initData[dates[1]]);

        //link relative
        var obj3 = Chain(initData[dates[0]] , initData[dates[1]] , data.rows[0]);
        resultArr.push(obj3);

        //seven link relative
        var obj4 = Chain7(initData[dates[0]] , initData , data.rows[0]);
        // resultArr.push(obj4);


        console.log(data.rows[0]);
        // console.log(data);

        return util.toTable([resultArr], data.rows, data.cols);
    },



































    productSaleTwo(data, query) {
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
    productSaleThree(data, query) {
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
    productSaleFour(data, page , dates) {
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
    productSaleFive(data, query, dates) {
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
    productSaleSix(data , query ,dates){
        var source = data.first.data[0],
            result = [];

       /* console.log(123,dates);
        for(var len=dates.length-1;len>=0;len--){
            console.log(dates[len]);
        }*/


        return util.toTable([source], data.rows, data.cols); 
    }
};