/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils");

module.exports = {
    tradeOne(data, array) {
        var source = data.data,
            one = [],
            two = [],
            obj = {};
        for(var key of array) {
            obj[key] = 0;
        }
        for (var key of source) {
            obj[key.key_type] += key.value;
        }
        one.push({
            tran_acc_pro_num : obj.tran_acc_pro_num,
            tran_order_pro_num : obj.tran_order_pro_num,
            tran_order_pro_num_j : obj.tran_order_pro_num_j,
            tran_pay_pro_num : obj.tran_pay_pro_num,
            tran_pay_pro_num_j : obj.tran_pay_pro_num_j
        });
        two.push({
            tran_order_user_num : obj.tran_order_user_num,
            tran_order_money_amount : obj.tran_order_money_amount.toFixed(2),
            tran_pay_user_num : obj.tran_pay_user_num,
            tran_pay_money_amount : obj.tran_pay_money_amount.toFixed(2),
            tran_cus_unit_price : util.percentage(
                obj.tran_pay_money_amount,
                obj.tran_pay_user_num
            ),
            tran_refund_pro_num : obj.tran_refund_pro_num,
            tran_refund_pro_num_j : obj.tran_refund_pro_num_j
        });
        return util.toTable([one, two], data.rows, data.cols);
    },
    tradeTwo(data, filter_key, dates) {
        var source = data.data,
            filter_name = {
                tred_acc_shop_num : "浏览店铺数",
                tred_deal_shop_num : "成交店铺数",
                tran_acc_pro_num : "浏览商品数",
                //tran_cart_pro_num : "加购商品数",
                //tran_cart_pro_num_j : "加购商品件数",
                tran_order_money_amount : "下单金额",
                tred_deal_money_amount : "成交金额",
                tred_pay_money_amount : "付款金额",
                tred_order_all_amount : "下单总量",
                tred_pay_all_amount : "付款订单量",
                tred_pay_user_num : "付款人数",
                tran_order_pro_num : "下单商品数",
                tran_order_pro_num_j : "下单商品件数",
                tran_guest_unit_price : "客单价",
                tran_row_unit_price : "笔单价"
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
            newData[date].value += Math.round(key.value);
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
    tradeThree(data, dates) {
        var source = data.data,
            obj = {},
            newData = [];

        dates.sort((a, b) => {
            return new Date(b) - new Date(a);
        });

        for(var date of dates) {
            obj[date] = {
                tred_order_all_amount : {
                    value : 0,
                    value2 : 0
                },
                tred_pay_all_amount : {
                    value : 0,
                    value2 : 0
                },
                tran_order_money_amount : {
                    value : 0,
                    value2 : 0
                },
                tran_pay_money_amount : {
                    value : 0,
                    value2 : 0
                },
                tran_guest_unit_price : {
                    value : 0,
                    value2 : 0
                },
                del_use_coupon_rate : {
                    value : 0,
                    value2 : 0
                },
                del_refund_amount: {
                    value : 0,
                    value2 : 0
                }
            };
        }

        for(var key of source) {
            date = util.getDate(key.date);
            obj[date][key.key_type].value += key.value;
            obj[date][key.key_type].value2 += key.value2;
        }

        for(var date of dates) {
            newData.push({
                date: date,
                one : obj[date].tred_order_all_amount.value,
                two : obj[date].tred_pay_all_amount.value,
                three : obj[date].tran_order_money_amount.value.toFixed(2),
                four : obj[date].tran_pay_money_amount.value.toFixed(2),
                five : obj[date].tran_guest_unit_price.value.toFixed(2),
                six : util.toFixed(
                    obj[date].del_use_coupon_rate.value2,
                    obj[date].del_use_coupon_rate.value
                ),
                seven: obj[date].del_refund_amount.value.toFixed(2),
                eight : obj[date].del_refund_amount.value2
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    tradeFour(data) {
        var source = data.data,
            total = 0;
        for(var key of source) {
            total += key.pay_money_amount;
        }
        for(var key of source) {
            key.pay_money_amount = key.pay_money_amount.toFixed(2);
            key.pay_money_amount_ratio = util.toFixed(key.pay_money_amount, total);
        }
        return util.toTable([source], data.rows, data.cols);
    },
    tradeFive(data) {
        var source = data.data,
            pay_ttl = 0,
            product_ttl = 0;
        for (var key of source) {
            pay_ttl += key.deal_money_amount;
            product_ttl += key.deal_pro_num;
        }
        for (var key of source) {
            key.deal_money_amount = key.deal_money_amount.toFixed(2);
            key.deal_money_ratio = util.toFixed(key.deal_money_amount, pay_ttl);
            key.deal_pro_ratio = util.toFixed(key.deal_pro_num, product_ttl);
            key.cus_unit_price = util.percentage(key.order_amount, key.order_number);
        }
        return util.toTable([source], data.rows, data.cols);

    }
};