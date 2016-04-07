/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    moment = require("moment"),
    util = require("../utils");

module.exports = {
    platformOrderOne(data) {
        var source = data.data,
            orderSource = data.orderData,
            oneOne = 0,
            oneTwo = 0,
            oneThree = 0,
            oneFour = 0,
            oneFive = 0,
            one = [],
            two = [],
            three = [],
            objOne = {
                name: "返利订单",
                order_count: 0,
                rebate_order_amount_count: 0,
                participate_seller_count: 0,
                participate_user_count: 0,
                participate_goods_count: 0
            },
            objTwo = {
                rebate_order_count: 0,
                rebate_order_amount_count: 0,
                rebate_order_amount_actual_count: 0,
                rebate_amount_count: 0
            },
            objThree = {
                name: "返利订单",
                spu_count: 0,
                total_spu_num: 0,
                sku_count: 0,
                total_sku_num: 0,
                refund_user_count: 0,
                total_user_num: 0,
                refund_goods_amount_count: 0,
                total_amount: 0,
                refund_goods_amount_actual_count: 0,
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
            objTwo.rebate_order_count += key.rebate_order_count;
            objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
            objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
            objTwo.rebate_amount_count += key.rebate_amount_count;
        }
        for(var key of orderSource) {
            objThree.spu_count += key.spu_count;
            objThree.sku_count += key.sku_count;
            objThree.refund_user_count += key.refund_user_count;
            objThree.refund_goods_amount_count += key.refund_goods_amount_count;
            objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
            objThree.total_spu_num = key.total_spu_num;
            objThree.total_sku_num = key.total_sku_num;
            objThree.total_user_num = key.total_user_num;
            objThree.total_amount = key.total_amount;
            objThree.total_amount_actual = key.total_amount_actual;
        }
        one.push(objOne);
        one.push({
            name: "总占比",
            order_count: util.toFixed(objOne.order_count, oneOne),
            rebate_order_amount_count: util.toFixed(objOne.rebate_order_amount_count, oneTwo),
            participate_seller_count: util.toFixed(objOne.participate_seller_count, oneThree),
            participate_user_count: util.toFixed(objOne.participate_user_count, oneFour),
            participate_goods_count: util.toFixed(objOne.participate_goods_count, oneFive)
        });
        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
        two.push(objTwo);
        three.push(objThree);
        three.push({
            name : "返利退货订单占比",
            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
        });
        return util.toTable([one, two, three], data.rows, data.cols);
    },
    platformOrderTwe(data, filter_key) {
        var source = data.data,
            dates = util.uniq(_.pluck(source, "date")),
            type = "line",
            array = [ "单项单级返利", "平台基础返利", "平台促销返利", "邀请商家入驻返利" ],
            newData = {},
            map = {};
        map[filter_key + "_0"] = array[0];
        map[filter_key + "_1"] = array[1];
        map[filter_key + "_2"] = array[2];
        map[filter_key + "_3"] = array[3];
        for(var date of dates) {
            var obj = {};
            for(var key of source) {
                if(date.getTime() === key.date.getTime()) {
                    for(var i = 0; i < array.length; i++) {
                        if(key.rebate_type === array[i]) {
                            obj[filter_key + "_" + i] += key[filter_key];
                        }
                    }
                }
            }
            newData[moment(date).format("YYYY-MM-DD")] = obj;
        }
        return [{
            type : type,
            map : map,
            config: {
                stack: false
            },
            data : newData
        }];
    }
};