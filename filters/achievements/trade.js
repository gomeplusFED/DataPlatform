/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils");

module.exports = {
    tradeOne(data) {
        var source = data.data,
            one = [],
            two = [],
            objOne = {
                tran_acc_pro_num: 0,
                //tran_cart_pro_num: 0,
                //tran_cart_pro_num_j: 0,
                tran_order_pro_num: 0,
                tran_order_pro_num_j: 0,
                tran_pay_pro_num: 0,
                tran_pay_pro_num_j: 0
            },
            objTwo = {
                tran_order_user_num: 0,
                tran_order_money_amount: 0,
                tran_pay_user_num: 0,
                tran_pay_money_amount: 0,
                tran_cus_unit_price: 0,
                tran_refund_pro_num: 0,
                tran_refund_pro_num_j: 0
            };
        for (var key of source) {
            objOne.tran_acc_pro_num += key.tran_acc_pro_num;
            //objOne.tran_cart_pro_num += key.tran_cart_pro_num;
            //objOne.tran_cart_pro_num_j += key.tran_cart_pro_num_j;
            objOne.tran_order_pro_num += key.tran_order_pro_num;
            objOne.tran_order_pro_num_j += key.tran_order_pro_num_j;
            objOne.tran_pay_pro_num += key.tran_pay_pro_num;
            objOne.tran_pay_pro_num_j += key.tran_pay_pro_num_j;
            objTwo.tran_order_user_num += key.tran_order_user_num;
            objTwo.tran_order_money_amount += key.tran_order_money_amount;
            objTwo.tran_pay_user_num += key.tran_pay_user_num;
            objTwo.tran_pay_money_amount += key.tran_pay_money_amount;
            objTwo.tran_cus_unit_price += key.tran_cus_unit_price;
            objTwo.tran_refund_pro_num += key.tran_refund_pro_num;
            objTwo.tran_refund_pro_num_j += key.tran_refund_pro_num_j;
        }
        one.push(objOne);
        two.push(objTwo);
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
                tran_order_pro_num_j : "下单商品件数"
                //tred_cus_unit_price : "客单价",
                //tred_gro_unit_price : "笔单价"
            },
            type = "line",
            map = {
                value : filter_name["tran_order_pro_num_j"]
            },
            newData = {};
        //console.log(filter_key.length);
        //if(filter_key.length === 2) {
        //    console.log("===");
        //}
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            date = util.getDate(key.date);
            newData[date].value += key.value;
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
                tred_pay_money_amount : {
                    value : 0,
                    value2 : 0
                },
                del_use_coupon_rate : {
                    value : 0,
                    value2 : 0
                },
                del_refund_amount : {
                    value : 0,
                    value2 : 0
                },
                tran_refund_pro_num: {
                    value : 0,
                    value2 : 0
                },
                tran_order_money_amount : {
                    value : 0,
                    value2 : 0
                },
                tran_order_user_num : {
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
                tred_order_all_amount : obj[date].tred_order_all_amount.value,
                tred_pay_all_amount : obj[date].tred_pay_all_amount.value,
                tran_order_money_amount : obj[date].tran_order_money_amount.value,
                tran_pay_money_amount : obj[date].tred_pay_money_amount.value,
                tred_cus_unit_price : util.percentage(
                    obj[date].tran_order_money_amount.value,
                    obj[date].tran_order_user_num.value
                ),
                del_use_coupon_rate : util.toFixed(
                    obj[date].del_use_coupon_rate.value2,
                    obj[date].del_use_coupon_rate.value
                ),
                del_refund_amount: obj[date].del_refund_amount.value,
                tran_refund_pro_num : obj[date].tran_refund_pro_num.value
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
            key.deal_money_ratio = util.toFixed(key.deal_money_amount, pay_ttl);
            key.deal_pro_ratio = util.toFixed(key.deal_pro_num, product_ttl);
            key.cus_unit_price = util.percentage(key.order_amount, key.order_number);
        }
        return util.toTable([source], data.rows, data.cols);

    }
};