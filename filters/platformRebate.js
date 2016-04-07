/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    moment = require("moment"),
    util = require("../utils");

module.exports = {
    one(data) {
        var source = data.data,
            orderSource = data.orderData,
            oneOne = 0,
            oneTwo = 0,
            oneThree = 0,
            oneFour = 0,
            oneFive = 0,
            one = [],
            twe = [],
            three = [],
            objOne = {
                name: "返利订单",
                order_count: 0,
                rebate_order_amount_count: 0,
                participate_seller_count: 0,
                participate_user_count: 0,
                participate_goods_count: 0
            },
            objTwe = {
                rebate_order_num: 0,
                rebate_amount_total: 0,
                rebate_amount_actual: 0,
                rebate_amount: 0,
                platform_amount: 0
            },
            objThree = {
                name: "返利订单",
                spu_num: 0,
                total_spu_num: 0,
                sku_num: 0,
                total_sku_num: 0,
                user_num: 0,
                total_user_num: 0,
                amount: 0,
                total_amount: 0,
                amount_actual: 0,
                total_amount_actual: 0
            };
        for(var key of source) {
            oneOne = key.total_order_num;
            oneTwo = key.total_order_amount;
            oneThree = key.total_shop_num;
            oneFour = key.participate_user_count;
            oneFive = key.total_product_sku_num;
            objOne.order_count += key.order_count;
            objOne.rebate_order_amount_count += key.rebate_order_amount_count;
            objOne.participate_seller_count += key.participate_seller_count;
            objOne.participate_user_count += key.participate_user_count;
            objOne.participate_goods_count += key.participate_goods_count;
        }
        one.push(objOne);
        one.push({
            name: "总占比",
            order_count: util.toFixed(objOne.order_count, oneOne),
            rebate_order_amount_count: util.toFixed(objOne.rebate_order_amount_count, oneTwo),
            participate_seller_count: util.toFixed(objOne.participate_seller_count, oneThree),
            participate_user_count: util.toFixed(objOne.participate_user_count, oneFour),
            participate_goods_count: util.toFixed(objOne.participate_goods_count, oneFive)
        })
    }
};