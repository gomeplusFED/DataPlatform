/**
 * @author yanglei
 * @date 20160408
 * @fileoverview 平台促销返利
 */
var util = require("../../utils"),
    _ = require("lodash"),
    config = require("../../utils/config.json"),
    moment = require("moment");

module.exports = {
    platformPromotionsOne(data) {
        var source = data.data,
            orderSource = data.orderData,
            one = [],
            two = [],
            three = [],
            objOne = {
                defate_plan_count: 0,
                participate_seller_count: 0,
                participate_goods_count: 0,
                order_count: 0,
                participate_user_count: 0
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
        for (var key of source) {
            objOne.defate_plan_count += key.defate_plan_count;
            objOne.participate_seller_count += key.participate_seller_count;
            objOne.participate_goods_count += key.participate_goods_count;
            objOne.order_count += key.order_count;
            objOne.participate_user_count += key.participate_user_count;
            objTwo.rebate_order_count += key.rebate_order_count;
            objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
            objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
            objTwo.rebate_amount_count += key.rebate_amount_count;
        }
        for (var key of orderSource) {
            objThree.spu_count += key.spu_count;
            objThree.sku_count += key.sku_count;
            objThree.refund_user_count += key.refund_user_count;
            objThree.refund_goods_amount_count += key.refund_goods_amount_count;
            objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
            objThree.total_spu_num += key.total_spu_num;
            objThree.total_sku_num += key.total_sku_num;
            objThree.total_user_num += key.total_user_num;
            objThree.total_amount += key.total_amount;
            objThree.total_amount_actual += key.total_amount_actual;
        }
        one.push(objOne);
        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
        objTwo.rebate_amount_count = objTwo.rebate_amount_count.toFixed(2);
        objTwo.rebate_order_amount_count = objTwo.rebate_order_amount_count.toFixed(2);
        two.push(objTwo);
        objThree.refund_goods_amount_count = objThree.refund_goods_amount_count.toFixed(2);
        three.push(objThree);
        three.push({
            name: "返利退货订单占比",
            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
        });
        return util.toTable([one, two, three], data.rows, data.cols);
    },
    platformPromotionsTwo(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            type = "line",
            array = [],
            newData = {},
            map = {};
        for(var key of orderSource) {
            array.push({
                key : key.flow_name,
                value : key.flow_code
            });
            map[filter_key + "_" + key.flow_code] = key.flow_name;
        }
        for(var date of dates) {
            newData[date] = {};
            for(key of array) {
                newData[date][filter_key + "_" + key.value] = 0;
            }
        }
        for(key of source) {
            date = util.getDate(key.date);
            newData[date][filter_key + "_" + key.correlate_flow] += Math.round(key[filter_key]);
        }
        return [{
            type: type,
            map: map,
            config: {
                stack: false
            },
            data: newData
        }];
    },
    platformPromotionsThree(data, filter_key) {
        var source = data.data,
            orderSource = data.orderData,
            typePie = "pie",
            typeBar = "bar",
            mapPie = {},
            mapBar = {},
            newDataPie = {},
            newDataBar = {},
            filter_name = {
                goods_sku_count: "商品件数",
                goods_amount_count: "商品总金额",
                rebate_amount_count: "返利到账金额"
            },
            objPie = {},
            objBar = {},
            XPie = [],
            XBar = [];
        orderSource.sort((a, b) => {
            return b.rebate_level - a.rebate_level;
        });
        for(var i = 0; i < orderSource[0].rebate_level; i++) {
            XPie.push({
                key : i + 1 + "级",
                value : i + 1
            });
            XBar.push({
                key : i + 1 + "层级",
                value : i + 1
            });
        }
        for (var level of XPie) {
            objPie[level.value] = {
                value : 0
            };
            objBar[level.value] = {};
            for (var i = 0; i < XBar.length; i++) {
                objBar[level.value][i] = 0;
            }
        }
        for(var key of source) {
            objPie[key.level].value += Math.round(key[filter_key]);
            objBar[key.level][key.grade] += Math.round(key[filter_key]);
        }
        for(var level of XPie) {
            newDataPie[level.key] = objPie[level.value];
            newDataBar[level.key] = objBar[level.value];
        }
        for (var i = 0; i < XBar.length; i++) {
            mapBar[i] = XBar[i].key;
        }
        mapPie.value = filter_name[filter_key];
        return [{
            type: typePie,
            map: mapPie,
            data: newDataPie,
            config: {
                stack: false
            }
        }, {
            type: typeBar,
            map: mapBar,
            data: newDataBar,
            config: {
                stack: true
            }
        }]
    },
    platformPromotionsFour(data, filter_key) {
        var source = data.data,
            orderSource = data.orderData,
            newData = {},
            map = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                goods_sku_count: "商品件数",
                goods_amount_count: "商品总金额",
                rebate_amount_count: "返利到账金额"
            },
            XData = [];
        for(var key of orderSource) {
            XData.push({
                key : key.flow_name,
                value : key.flow_code
            })
        }
        for (var x of XData) {
            var obj = {
                value: 0
            };
            for (var key of source) {
                if (x.value === key.correlate_flow) {
                    obj.value += Math.round(key[filter_key]);
                }
            }
            newData[x.key] = obj;
        }
        map.value = filter_name[filter_key];
        return [{
            type: typePie,
            map: map,
            data: newData,
            config: {
                stack: false
            }
        }, {
            type: typeBar,
            map: map,
            data: newData,
            config: {
                stack: false
            }
        }]
    },
    platformPromotionsFive(data, page) {
        var source = data.data,
            orderSource = data.orderData,
            count = data.dataCount,
            page = page || 1,
            user_party = {},
            correlate_flow = {};
        for(var key of orderSource) {
            user_party[key.type_code] = key.type_name;
            correlate_flow[key.flow_code] = key.flow_name;
        }
        source.forEach((key, value) => {
            key.id = (page - 1) * 20 + value + 1;
            key.user_party = user_party[key.user_party];
            key.correlate_flow = correlate_flow[key.correlate_flow];
            key.order_rate = key.new_order_count + "/" + key.order_all_count;
            key.price_rate = key.new_order_amount.toFixed(2) + "/" + key.order_all_amount.toFixed(2);
            key.rebate_amount = key.rebate_amount.toFixed(2);
        });
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};