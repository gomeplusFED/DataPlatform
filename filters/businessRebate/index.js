/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */
var util = require("../../utils"),
    config = require("../../utils/config.json")
    _ = require("lodash");

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
                name: "返利订单",
                order_num: 0,
                order_amount: 0,
                shop_num: 0,
                user_num: 0,
                product_sku_num: 0
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
        for (var key of source) {
            total_order_num += key.total_order_num;
            total_order_amount += key.total_order_amount;
            total_shop_num += key.total_shop_num;
            total_user_num += key.total_user_num;
            total_product_sku_num += key.total_product_sku_num;
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
        for (var key of orderSource) {
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
        objOne.order_amount = objOne.order_amount.toFixed(2);
        one.push(objOne);
        one.push({
            name: "总占比",
            order_num: util.toFixed(objOne.order_num, total_order_num),
            order_amount: util.toFixed(objOne.order_amount, total_order_amount),
            shop_num: util.toFixed(objOne.shop_num, total_shop_num),
            user_num: util.toFixed(objOne.user_num, total_user_num),
            product_sku_num: util.toFixed(objOne.product_sku_num, total_product_sku_num)
        });
        objTwe.rate = util.toFixed(objTwe.rebate_amount, objTwe.rebate_amount_actual);
        objTwe.rebate_amount = objTwe.rebate_amount.toFixed(2);
        objTwe.platform_amount = objTwe.platform_amount.toFixed(2);
        twe.push(objTwe);
        objThree.amount = objThree.amount.toFixed(2);
        three.push(objThree);
        three.push({
            name: "返利退货订单占比",
            spu_num: util.toFixed(objThree.spu_num, objThree.total_spu_num),
            sku_num: util.toFixed(objThree.sku_num, objThree.total_sku_num),
            user_num: util.toFixed(objThree.user_num, objThree.total_user_num),
            amount: util.toFixed(objThree.amount, objThree.total_amount),
            amount_actual: util.toFixed(objThree.amount_actual, objThree.total_amount_actual)
        });
        return util.toTable([one, twe, three], data.rows, data.cols);
    },
    businessAllTwe(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            type = "line",
            map = {},
            newDate = {};
        for(var key of orderSource) {
            map[key.flow_code] = key.flow_name;
        }
        for(var date of dates) {
            var obj = {};
            for(key of orderSource) {
                obj[key.flow_code] = 0;
            }
            newDate[date] = obj;
        }
        for(key of source) {
            date = util.getDate(key.date);
            newDate[date][key.rebate_type] += Math.round(key[filter_key]);
        }
        return [{
            type : type,
            map : map,
            config: {
                stack: false
            },
            data : newDate
        }];
    },
    businessAllThree(data, filter_key) {
        var source = data.data,
            orderSource = data.orderData,
            newDataPie = {},
            newDataBar = {},
            objPie = {},
            objBar = {},
            mapPie = {},
            mapBar = {},
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额"
            },
            typePie = "pie",
            typeBar = "bar",
            XPie = [],
            XBar = [];
        for(var i = 0; i < orderSource[0].rebate_level; i++) {
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
            for (var i = 0; i < XBar.length; i++) {
                objBar[level.value][i] = 0;
            }
        }
        for(key of source) {
            objPie[key.grade].value += Math.round(key[filter_key]);
            objBar[key.grade][key.level] += Math.round(key[filter_key]);
        }
        for(level of XPie) {
            newDataPie[level.key] = objPie[level.value];
            newDataBar[level.key] = objBar[level.value];
        }
        for(var i = 0; i < XBar.length; i++) {
            mapBar[i] = XBar[i].key;
        }
        mapPie.value= filter_name[filter_key];
        return [{
            type : typePie,
            map : mapPie,
            data : newDataPie,
            config: {
                stack: false
            }
        }, {
            type : typeBar,
            map : mapBar,
            data : newDataBar,
            config: {
                stack: true
            }
        }]
    },
    businessAllFour(data, filter_key) {
        var source = data.data,
            orderSource = data.orderData,
            newData = {},
            obj = {},
            map = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额"
            },
            XData = [];
        for(var key of orderSource) {
            XData.push({
                key : key.flow_name,
                value : key.flow_code
            });
        }
        for(var x of XData) {
            obj[x.value] = {
                value : 0
            };
        }
        for(var key of source) {
            obj[key.rebate_type].value += key[filter_key];
        }
        for(x of XData) {
            newData[x.key] = obj[x.value];
        }
        map.value = filter_name[filter_key];
        return [{
            type : typePie,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        },{
            type : typeBar,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    businessAllFive(data, page) {
        var source = data.data,
            count = data.dataCount > 50 ? 50 : data.dataCount,
            page = page || 1,
            newData = [],
            length = source.length;
        for(var i = 0; i < length; i++) {
            var obj = {
                id : (page - 1) * 10 + i + 1,
                shop_name : source[i].shop_name,
                plan_num : source[i].plan_num,
                spu_num : source[i].spu_num,
                user_num : source[i].user_num,
                pay_rate : source[i].order_num + "/" + source[i].total_order_num,
                pay_price_rate : source[i].order_amount.toFixed(2) + "/" + source[i].total_order_amount.toFixed(2),
                plan_rebate_amount : source[i].plan_rebate_amount.toFixed(2),
                rebate_amount : source[i].rebate_amount.toFixed(2),
                platform_amount : source[i].platform_amount.toFixed(2)
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    businessAllSix(data, page) {
        var source = data.data,
            orderSource = data.orderData,
            count = data.dataCount > 50 ? 50 : data.dataCount,
            page = page || 1,
            newData = [],
            length = source.length,
            related_flow = {};
        for(var key of orderSource) {
            related_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < length; i++) {
            var obj = {
                id : (page - 1) * 10 + i + 1,
                plan_name : source[i].plan_name,
                shop_name : source[i].shop_name,
                deadline : source[i].deadline,
                related_flow : related_flow[source[i].related_flow],
                level : source[i].level,
                spu_num : source[i].spu_num,
                user_num : source[i].user_num,
                pay_rate : source[i].order_num + "/" + source[i].total_order_num,
                pay_price_rate : source[i].order_amount.toFixed(2) + "/" + source[i].total_order_amount.toFixed(2),
                rebate_amount : source[i].rebate_amount.toFixed(2),
                refund_rate : util.toFixed(source[i].refund_sku_num, source[i].sku_num)
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    planOne(data, page) {
        var source = data.data,
            orderSource = data.orderData,
            count = data.dataCount,
            page = page || 1,
            newData = [],
            related_flow = {};
        for(var key of orderSource) {
            related_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.id = (page - 1) * 10 + i + 1;
            key.related_flow = related_flow[key.related_flow];
            key.pay_rate = key.order_num + "/" + key.total_order_num;
            key.pay_price_rate = key.order_amount.toFixed(2) + "/" + key.total_order_amount.toFixed(2);
            key.rebate_amount = key.rebate_amount.toFixed(2);
            key.refund_rate = util.toFixed(key.refund_sku_num, key.sku_num);
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};
