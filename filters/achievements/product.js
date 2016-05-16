/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var util = require("../../utils");

module.exports = {
    productOne(data) {
        var source = data.data,
            obj = {
                products_acc : {
                    value : 0,
                    value2 : 0,
                    value3 : 0
                },
                products_scan : {
                    value : 0,
                    value2 : 0,
                    value3 : 0
                },
                products_cars : {
                    value : 0,
                    value2 : 0,
                    value3 : 0
                },
                products_order : {
                    value : 0,
                    value2 : 0,
                    value3 : 0
                },
                products_pay : {
                    value : 0,
                    value2 : 0,
                    value3 : 0
                }
            },
            newData = {};
        for(var key of source) {
            obj[key.key_type].value += key.value;
            obj[key.key_type].value2 += key.value2;
            obj[key.key_type].value3 += key.value3;
        }
        newData.one = obj.products_acc.value;
        newData.two = obj.products_acc.value2;
        newData.three = obj.products_acc.value3;
        newData.four = obj.products_scan.value;
        newData.five = obj.products_cars.value;
        newData.six = obj.products_order.value;
        newData.seven = obj.products_pay.value;
        return util.toTable([[newData]], data.rows, data.cols);
    },
    productTwo(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            filter_name = {
                products_scan : "浏览商品数",
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
            newData[util.getDate(key.date)].value += key.value;
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
    productThree(data, dates) {
        var source = data.data,
            obj = {},
            newData = [];
        for(var date of dates) {
            obj[date] = {
                products_scan : {
                    value : 0,
                    value2 : 0
                },
                products_order : {
                    value : 0,
                    value2 : 0
                },
                products_pay : {
                    value : 0,
                    value2 : 0
                },
                products_return : {
                    value : 0,
                    value2 : 0
                },
                products_fee : {
                    value : 0,
                    value2 : 0
                }
            };
        }
        for(var key of source) {
            var date = util.getDate(key.date);
            obj[date][key.key_type].value += key.value;
            obj[date][key.key_type].value2 += key.value2;
        }
        for(var date of dates) {
            newData.push({
                one : date,
                two : obj[date].products_scan.value,
                three : obj[date].products_order.value,
                four : obj[date].products_pay.value,
                five : obj[date].products_return.value,
                six : obj[date].products_fee.value,
                seven : obj[date].products_fee.value2
            })
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    productFour(data) {
        var source = data.data,
            newData = [],
            access_num_total = 0,
            access_users_total = 0,
            length = source.length,
            top = length > 100 ? 100 : length;
        source.sort((a, b) => {
            return b.access_num - a.access_num;
        });
        for(var key of source) {
            access_num_total += key.access_num;
            access_users_total += key.access_users;
        }
        for(var i = 0; i < top; i++) {
            source[i].id = i + 1;
            source[i].access_num_rate = util.toFixed(source[i].access_num, access_num_total);
            source[i].access_users_rate = util.toFixed(source[i].access_users, access_users_total);
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    productFive(data) {
        var source = data.data,
            newData = [],
            order_price_total = 0,
            length = source.length,
            top = length > 100 ? 100 : length;
        source.sort((a, b) => {
            return b.order_price - a.order_price;
        });
        for(var key of source) {
            order_price_total += key.order_price;
        }
        for(var i = 0; i < top; i++) {
            source[i].id = i + 1;
            source[i].order_price_rate = util.toFixed(source[i].order_price, order_price_total);
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};