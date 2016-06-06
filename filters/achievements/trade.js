/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    tradeOne(data) {
        var source = data.data,
            one = [],
            two = [],
            obj = {
                tran_acc_pro_num : 0,
                tran_order_pro_num_spu : 0,
                tran_order_pro_num_sku : 0,
                tran_pay_pro_num_spu : 0,
                tran_pay_pro_num_sku : 0,
                tran_order_user_num : 0,
                tran_order_money_amount : 0,
                tran_pay_user_num : 0,
                tran_pay_money_amount : 0,
                tran_refund_pro_num_spu : 0,
                tran_refund_pro_num_sku : 0,
                tred_deal_money_amount : 0
            };
        for(var key of source) {
            obj.tran_acc_pro_num += key.tran_acc_pro_num;
            obj.tran_order_pro_num_spu += key.tran_order_pro_num_spu;
            obj.tran_order_pro_num_sku += key.tran_order_pro_num_sku;
            obj.tran_pay_pro_num_spu += key.tran_pay_pro_num_spu;
            obj.tran_pay_pro_num_sku += key.tran_pay_pro_num_sku;
            obj.tran_order_user_num += key.tran_order_user_num;
            obj.tran_order_money_amount += key.tran_order_money_amount;
            obj.tran_pay_user_num += key.tran_pay_user_num;
            obj.tran_pay_money_amount += key.tran_pay_money_amount;
            obj.tran_refund_pro_num_spu += key.tran_refund_pro_num_spu;
            obj.tran_refund_pro_num_sku += key.tran_refund_pro_num_sku;
            obj.tred_deal_money_amount += key.tred_deal_money_amount;
        }
        one.push({
            tran_acc_pro_num : obj.tran_acc_pro_num,
            tran_order_pro_num_spu : obj.tran_order_pro_num_spu,
            tran_order_pro_num_sku : obj.tran_order_pro_num_sku,
            tran_pay_pro_num_spu : obj.tran_pay_pro_num_spu,
            tran_pay_pro_num_sku : obj.tran_pay_pro_num_sku
        });
        two.push({
            tran_order_user_num : obj.tran_order_user_num,
            tran_order_money_amount : obj.tran_order_money_amount.toFixed(2),
            tran_pay_user_num : obj.tran_pay_user_num,
            tran_pay_money_amount : obj.tran_pay_money_amount.toFixed(2),
            tran_cus_unit_price : util.division(obj.tran_pay_money_amount, obj.tran_pay_user_num),
            tran_refund_pro_num_spu : obj.tran_refund_pro_num_spu,
            tran_refund_pro_num_sku : obj.tran_refund_pro_num_sku
        });
        return util.toTable([one, two], data.rows, data.cols);
    },
    tradeTwo(data, filter_key, dates) {
        var source = data.data,
            filter_name = {
                tred_acc_shop_num : '浏览店铺数',
                tred_deal_shop_num : '成交店铺数',
                tran_acc_pro_num : '浏览商品数',
                tran_order_money_amount : '下单金额',
                tred_deal_money_amount : '成交金额',
                tran_order_money_amount : '付款金额',
                tred_order_all_amount : '下单总量',
                tred_pay_all_amount : '付款订单量',
                tred_pay_user_num : '付款人数',
                tran_order_pro_num_spu : '下单商品数',
                tran_order_pro_num_sku : '下单商品件数',
                tran_guest_unit_price : '客单价',
                tran_row_unit_price : '笔单价'
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
            if(filter_key === "tran_guest_unit_price") {
                newData[date].value = util.round(key.tran_pay_money_amount, key.tran_pay_user_num);
            } else if(filter_key === "tran_row_unit_price") {
                newData[date].value = util.round(key.tran_pay_money_amount, key.tred_pay_all_amount)
            } else {
                newData[date].value += Math.round(key[filter_key]);
            }
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
    tradeThree(data) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.tran_guest_unit_price = util.division(key.tran_pay_money_amount, key.tran_pay_user_num);
            key.del_use_coupon_rate = key.del_use_coupon_rate.toFixed(2) + "%";
            key.tran_order_money_amount = key.tran_order_money_amount.toFixed(2);
            key.tran_pay_money_amount = key.tran_pay_money_amount.toFixed(2);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    tradeFour(data) {
        var source = data.data,
            count = data.dataCount,
            total = 0;
        for(var key of source) {
            total += key.pay_money_amount;
        }
        for(var key of source) {
            key.pay_money_amount = key.pay_money_amount.toFixed(2);
            key.pay_money_amount_ratio = util.toFixed(key.pay_money_amount, total);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    tradeFive(data) {
        var source = data.data,
            count = data.dataCount,
            pay_ttl = 0,
            product_ttl = 0;
        for (var key of source) {
            pay_ttl += key.deal_money_amount;
            product_ttl += key.deal_pro_num;
        }
        for (var key of source) {
            key.cus_unit_price = util.division(key.deal_money_amount, key.order_number);
            key.deal_money_amount = key.deal_money_amount.toFixed(2);
            key.deal_money_ratio = util.toFixed(key.deal_money_amount, pay_ttl);
            key.deal_pro_ratio = util.toFixed(key.deal_pro_num, product_ttl);
        }
        return util.toTable([source], data.rows, data.cols, [count]);

    }
};