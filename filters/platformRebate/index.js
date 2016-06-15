/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    config = require("../../utils/config.json"),
    util = require("../../utils");

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
                productSku_num: 0
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
            oneOne += key.total_order_num;
            oneTwo += key.total_order_amount;
            oneThree += key.total_shop_num;
            oneFour += key.total_user_num;
            oneFive += key.total_product_sku_num;
            objOne.order_count += key.order_count;
            objOne.rebate_order_amount_count += key.rebate_order_amount_count;
            objOne.participate_seller_count += key.participate_seller_count;
            objOne.participate_user_count += key.participate_user_count;
            objOne.productSku_num += key.productSku_num;
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
        //objOne.rebate_order_amount_count = Math.round(objOne.rebate_order_amount_count);
        objOne.rebate_order_amount_count = objOne.rebate_order_amount_count.toFixed(2);
        one.push(objOne);
        one.push({
            name: "总占比",
            order_count: util.toFixed(objOne.order_count, oneOne),
            rebate_order_amount_count: util.toFixed(objOne.rebate_order_amount_count, oneTwo),
            participate_seller_count: util.toFixed(objOne.participate_seller_count, oneThree),
            participate_user_count: util.toFixed(objOne.participate_user_count, oneFour),
            productSku_num: util.toFixed(objOne.productSku_num, oneFive)
        });
        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
        objTwo.rebate_amount_count = objTwo.rebate_amount_count.toFixed(2);
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
    platformOrderTwe(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            orderSource = data.orderData,
            newData = {},
            map = {};
        for(var key of orderSource) {
            map[filter_key + "_" + key.type_code] = key.type_name;
        }
        for (var date of dates) {
            newData[date] = {};
            for(var k in map) {
                newData[date][k] = 0;
            }
        }
        for(var key of source) {
            date = util.getDate(key.date);
            newData[date][filter_key + "_" + key.user_party] += Math.round(key[filter_key]);
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
    platformOrderThree(data, filter_key) {
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

        var levelMax = orderSource[0].rebate_level;

        for(var i = 0; i < levelMax; i++) {
            XPie.push({
                key :  i + 1 + "级",
                value : i + 1
            });
            XBar.push({
                key :  i + 1 + "层级",
                value : i + 1
            });
        }
        for (var level of XPie) {
            objPie[level.value] = {
                value : 0
            };
            objBar[level.value] = {};
            for (var n = 0; n < XBar.length; n++) {
                objBar[level.value][n] = 0;
            }
        }
        for(key of source) {
            if(filter_key !== "rebate_amount_count") {
                if(key.grade === "0") {
                    objPie[key.level].value += key[filter_key];
                }
            } else {
                objPie[key.level].value += key[filter_key];
            }
            objBar[key.level][key.grade] += key[filter_key];
        }

        if(filter_key !== "rebate_amount_count") {
            for(var key in objBar) {
                for(var i = 0; i < levelMax - 1; i++) {
                    objBar[key][i] -= objBar[key][i + 1];
                }
            }
        }

        if(filter_key !== "goods_sku_count") {
            for(var key in objPie) {
                objPie[key].value = (objPie[key].value / 100).toFixed(2);
            }
            for(var key in objBar) {
                for(var k in objBar[key]) {
                    objBar[key][k] = (objBar[key][k] / 100).toFixed(2);
                }
            }
        }

        for(level of XPie) {
            newDataPie[level.key] = objPie[level.value];
            newDataBar[level.key] = objBar[level.value];
        }
        for (i = 0; i < XBar.length; i++) {
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
    platformOrderFour(data, filter_key) {
        var source = data.data,
            orderSource = data.orderData,
            newData = {},
            map = {},
            obj = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                goods_sku_count: "商品件数",
                goods_amount_count: "商品总金额",
                rebate_amount_count: "返利到账金额"
            };
        for(var key of orderSource) {
            obj[key.type_code] = {
                value : 0
            };
        }
        for(key of source) {
            if(filter_key !== "rebate_amount_count") {
                if(key.grade === "0") {
                    obj[key.user_party].value += Math.round(key[filter_key]);
                }
            } else {
                obj[key.user_party].value += Math.round(key[filter_key]);
            }
        }

        if(filter_key !== "goods_sku_count") {
            for(var key in obj) {
                obj[key].value = (obj[key].value / 100).toFixed(2);
            }
        }

        for(key of orderSource) {
            newData[key.type_name] = obj[key.type_code];
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
    platformOrderFive(data, page) {
        var source = data.data,
            count = data.dataCount,
            orderSource = data.orderData,
            page = page || 1,
            user_party = {},
            correlate_flow = {};
        for(var key of orderSource) {
            user_party[key.type_code] = key.type_name;
            correlate_flow[key.flow_code] = key.flow_name;
        }
        source.forEach((key, value) => {
            key.id = (page - 1) * 10 + value + 1;
            key.user_party = user_party[key.user_party];
            key.correlate_flow = correlate_flow[key.correlate_flow];
            key.order_rate = key.new_order_count + "/" + key.order_all_count;
            key.price_rate = key.new_order_amount.toFixed(2) + "/" + key.order_all_amount.toFixed(2);
            key.rebate_amount = key.rebate_amount.toFixed(2);
        });
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};
