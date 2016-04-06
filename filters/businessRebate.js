/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */
var util = require("../utils");

module.exports = {
    businessAllOne(data) {
        var source = data.data,
            orderSource = data.orderData,
            total_order_num = 0,
            total_order_amount = 0,
            total_shop_num = 0,
            total_user_num = 0,
            total_product_sku_num = 0,
            one = [],
            twe = [],
            three = [],
            objOne = {
                name : "返利订单",
                order_num : 0,
                order_amount : 0,
                shop_num : 0,
                user_num : 0,
                product_sku_num : 0
            },
            objTwe = {
                rebate_order_num : 0,
                rebate_amount_total : 0,
                rebate_amount_actual : 0,
                rebate_amount : 0,
                platform_amount : 0
            },
            objThree = {
                name : "返利订单",
                spu_num : 0,
                total_spu_num : 0,
                sku_num : 0,
                total_sku_num : 0,
                user_num : 0,
                total_user_num : 0,
                amount : 0,
                total_amount : 0,
                amount_actual : 0,
                total_amount_actual : 0
            };
        for(var key of source) {
            total_order_num = key.total_order_num;
            total_order_amount = key.total_order_amount;
            total_shop_num = key.total_shop_num;
            total_user_num = key.total_user_num;
            total_product_sku_num = key.total_product_sku_num;
            objOne.order_num += key.order_num;
            objOne.order_amount += key.order_amount;
            objOne.shop_num += key.shop_num;
            objOne.user_num += key.user_num;
            objOne.product_sku_num += key.product_sku_num;
            objTwe.rebate_order_num += key.rebate_order_num;
            objTwe.rebate_amount_total += key.rebate_amount_total;
            objTwe.rebate_amount_actual += key.rebate_amount_actual;
            objTwe.rebate_amount += key.rebate_amount;
            objTwe.platform_amount += key.platform_amount;
        }
        for(var key of orderSource) {
            objThree.spu_num += key.spu_num;
            objThree.total_spu_num += key.total_spu_num;
            objThree.sku_num += key.sku_num;
            objThree.total_sku_num += key.total_sku_num;
            objThree.user_num += key.user_num;
            objThree.total_user_num += key.total_user_num;
            objThree.amount += key.amount;
            objThree.total_amount += key.total_amount;
            objThree.amount_actual += key.amount_actual;
            objThree.total_amount_actual += key.total_amount_actual;
        }
        one.push(objOne);
        one.push({
            name : "总占比",
            order_num : (objOne.order_num / (total_order_num === 0 ? 1 : total_order_num) * 100).toFixed(1) + "%",
            order_amount : (objOne.order_amount / (total_order_amount === 0 ? 1 : total_order_amount)
                * 100).toFixed(1) + "%",
            shop_num : (objOne.shop_num / (total_shop_num === 0 ? 1 : total_shop_num) * 100).toFixed(1) + "%",
            user_num : (objOne.user_num / (total_user_num === 0 ? 1 : total_user_num) * 100).toFixed(1) + "%",
            product_sku_num : (objOne.product_sku_num / (total_product_sku_num === 0 ? 1 : total_product_sku_num)
                * 100).toFixed(1) + "%"
        });
        objTwe.rate = (objTwe.rebate_amount / (objTwe.rebate_amount_actual === 0 ? 1 : objTwe.rebate_amount_actual)
            * 100).toFixed(1) + "%";
        twe.push(objTwe);
        three.push(objThree);
        three.push({
            name : "返利退货订单占比",
            spu_num : (objThree.spu_num / (objThree.total_spu_num === 0 ? 1 : objThree.total_spu_num)
                * 100).toFixed(1) + "%",
            sku_num : (objThree.sku_num / (objThree.total_sku_num === 0 ? 1 : objThree.total_sku_num)
                * 100).toFixed(1) + "%",
            user_num : (objThree.user_num / (objThree.total_user_num === 0 ? 1 : objThree.total_user_num)
                * 100).toFixed(1) + "%",
            amount : (objThree.amount / (objThree.total_amount === 0 ? 1 : objThree.total_amount)
                * 100).toFixed(1) + "%",
            amount_actual : (objThree.amount_actual / (objThree.total_amount_actual === 0 ? 1 : objThree.total_amount_actual)
                * 100).toFixed(1) + "%"
        });
        return util.toTable([one, twe, three], data.rows, data.cols);
    }
};