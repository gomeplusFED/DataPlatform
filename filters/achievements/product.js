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
    }
};