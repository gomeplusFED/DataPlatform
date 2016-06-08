/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    productOne(data, filter_key) {
        var source = data.data,
            newData = {
                one : 0,
                two : 0,
                three : 0,
                four : 0,
                five : 0,
                six : 0,
                seven : 0
            };
        for(var key of source) {
            newData.one += key.product_acc_uv;
            newData.two += key.product_acc_pv;
            newData.three += Math.round(key.product_acc_avg_time);
            newData.four += key.product_scan;
            newData.five += key.products_cars;
            newData.six += key.products_order;
            newData.seven += key.products_pay;
        }
        if(filter_key === "2") {
            data.cols[0][4].caption = "加购商品件数";
            data.cols[0][5].caption = "下单商品件数";
            data.cols[0][6].caption = "支付商品件数";
        }
        if(filter_key === "1") {
            data.cols[0][4].caption = "加购商品数";
            data.cols[0][5].caption = "下单商品数";
            data.cols[0][6].caption = "支付商品数";
        }
        return util.toTable([[newData]], data.rows, data.cols);
    },
    productTwo(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            filter_name = {
                product_scan : "浏览商品数",
                products_cars : "加购商品数",
                products_pay : "支付商品",
                products_order : "下单商品"
            },
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
            newData[util.getDate(key.date)].value += key[filter_key];
        }
        return [{
            map : map,
            type : type,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }]
    },
    productThree(data, filter_key) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.pay_fee = key.pay_fee.toFixed(2);
            key.refund_fee = key.refund_fee.toFixed(2);
        }

        if(filter_key === "2") {
            data.cols[0][2].caption = "下单商品件数";
            data.cols[0][3].caption = "支付商品件数";
            data.cols[0][4].caption = "退货商品件数";
        }

        if(filter_key === "1") {
            data.cols[0][2].caption = "下单商品数";
            data.cols[0][3].caption = "支付商品数";
            data.cols[0][4].caption = "退货商品数";
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    productFour(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 10 + i + 1;
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
            key.top = (page - 1) * 10 + i + 1;
            key.order_price = key.order_price.toFixed(2);
            key.order_price_rate = util.toFixed(key.order_price, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};