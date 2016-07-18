/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    shopOne(data, filter_key, dates) {
        var source = data.data,
            filter_name = {
                xpop_shops_num_add_al : "新增注册店铺",
                xpop_shops_num_succ_add_al : "成功入驻店铺",
                deal_shops_num : "成功交易店铺",
                xpop_shops_num_acc_al : "被访问店铺数"
            },
            type = "line",
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            date = util.getDate(key.date);
            newData[date].value += key[filter_key];
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    },
    shopTwo(data, dates) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }

        return util.toTable([source], data.rows, data.cols, [count]);
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