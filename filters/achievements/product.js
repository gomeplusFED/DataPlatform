/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var util = require(RootPath+"/utils"),
    moment = require("moment");

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
            obj.names = "昨日";
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
            newData = {};

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
    productFour(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.access_num_rate = util.toFixed(key.access_num, sum[1]);
            key.access_users_rate = util.toFixed(key.access_users, sum[2]);
            source[i] = key;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    productFive(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.order_price = key.order_price.toFixed(2);
            key.pay_price = key.pay_price.toFixed(2);
            key.pay_price_rate = util.toFixed(key.pay_price, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};