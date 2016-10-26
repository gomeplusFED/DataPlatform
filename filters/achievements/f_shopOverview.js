/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    shopOverviewOne(data, query, dates) {
        // console.log(123,data);
        var source = data.first.data[0];

        for(var item of source) {
            item.all = 0;
            for(let key of data.rows[0]){
                if(key == "all") continue;
                item.all += item[key];
            }
        }

        return util.toTable([source], data.rows, data.cols);
    },
    shopOverviewTwo(data , query , dates){
        
    },

    shopThree(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 50 ? 50 : data.dataCount,
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
    shopFour(data, sku_type, page) {
        var source = data.data,
            sum = data.dataSum,
            page = page || 1,
            count = data.dataCount > 50 ? 50 : data.dataCount;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.pay_price = key.pay_price.toFixed(2);
            key.pay_price_rate = util.toFixed(key.pay_price, sum[1]);
            key.pay_commodity_rate = util.toFixed(key.pay_commodity_num, sum[2]);
            source[i] = key;
        }

        if(sku_type === "2") {
            data.cols[0][4].caption = "支付商品件数";
            data.cols[0][5].caption = "支付商品件数占比";
            data.cols[0][6].caption = "商品被分享次数";
        } else {
            data.cols[0][4].caption = "支付商品数";
            data.cols[0][5].caption = "支付商品数占比";
            data.cols[0][6].caption = "被分享商品数";
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};