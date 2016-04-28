/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */
var util = require("../../utils"),
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
        twe.push(objTwe);
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
            type = "line",
            array = [ {
                key : "分销购买",
                value : "14"
            },{
                key : "分享购买",
                value : "13"
            },{
                key : "组合返利",
                value : ""
            } ],
            map = {},
            newDate = {};
        map[filter_key + "_0"] = "分销购买";
        map[filter_key + "_1"] = "分享购买";
        map[filter_key + "_2"] = "组合返利";
        for(var date of dates) {
            var obj = {};
            for(var i = 0; i < array.length; i++) {
                obj[filter_key + "_" + i] = 0;
            }
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    for(var i = 0; i < array.length; i++) {
                        if(key.rebate_type === array[i].value) {
                            obj[filter_key + "_" + i] += key[filter_key];
                        }
                    }
                }
            }
            newDate[date] = obj;
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
            newDataPie = {},
            newDataBar = {},
            mapPie = {},
            mapBar = {},
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额"
            },
            typePie = "pie",
            typeBar = "bar",
            XPie = [
                {
                    key : "1级",
                    value : "1"
                },
                {
                    key : "2级",
                    value : "2"
                },
                {
                    key : "3级",
                    value : "3"
                },
                {
                    key : "4级",
                    value : "4"
                }
            ],
            XBar = [
                {
                    key : "层级1",
                    value : "1"
                },
                {
                    key : "层级2",
                    value : "2"
                },
                {
                    key : "层级3",
                    value : "3"
                },
                {
                    key : "层级4",
                    value : "4"
                }
            ];
        for(var level of XPie) {
            var obj = {};
            obj.value = 0;
            for(var key of source) {
                if(level.value === key.grade) {
                    obj.value += key[filter_key];
                }
            }
            newDataPie[level.key] = obj;
        }
        for(var level of XPie) {
            var obj = {};
            for(var i = 0; i < XBar.length; i++) {
                obj[i] = 0;
            }
            for(var key of source) {
                if(key.level === level.value) {
                    for(var i = 0; i < XBar.length; i++) {
                        if(key.grade === XBar[i].value) {
                            obj[i] += key[filter_key];
                        }
                    }
                }
            }
            newDataBar[level.key] = obj;
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
            newData = {},
            map = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额"
            },
            XData = [ {
                key : "分销购买",
                value :"14"
            },{
                key : "分享购买",
                value :"13"
            } ];
        for(var x of XData) {
            var obj = {
                value : 0
            };
            for(var key of source) {
                if(x.value === key.rebate_type) {
                    obj.value += key[filter_key];
                }
            }
            newData[x.key] = obj;
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
    businessAllFive(data) {
        var source = data.data,
            newData = [],
            length = source.length,
            top = length > 50 ? 50 : length;
        source = util.sort(source, "order_num", "pay_order_num");
        for(var i = 0; i < top; i++) {
            var obj = {
                id : i + 1,
                shop_name : source[i].shop_name,
                plan_num : source[i].plan_num,
                spu_num : source[i].spu_num,
                user_num : source[i].user_num,
                pay_rate : source[i].order_num + "/" + source[i].total_order_num,
                pay_price_rate : source[i].order_amount + "/" + source[i].total_order_amount,
                plan_rebate_amount : source[i].plan_rebate_amount,
                rebate_amount : source[i].rebate_amount,
                platform_amount : source[i].platform_amount
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    businessAllSix(data) {
        var source = data.data,
            newData = [],
            length = source.length,
            top = length > 50 ? 50 : length,
            related_flow = {
                13 : "分享购买",
                14 : "分销购买"
            },
            level ={
                1 : "1级",
                2 : "2级",
                3 : "3级",
                4 : "4级"
            };
        source = util.sort(source, "order_num", "pay_order_num");
        for(var i = 0; i < top; i++) {
            var obj = {
                id : i + 1,
                plan_name : source[i].plan_name,
                shop_name : source[i].shop_name,
                deadline : source[i].deadline,
                related_flow : related_flow[source[i].related_flow],
                level : level[source[i].level],
                spu_num : source[i].spu_num,
                user_num : source[i].user_num,
                pay_rate : source[i].order_num + "/" + source[i].total_order_num,
                pay_price_rate : source[i].order_amount + "/" + source[i].total_order_amount,
                rebate_amount : source[i].rebate_amount,
                refund_rate : util.toFixed(source[i].refund_sku_num, source[i].sku_num)
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    planOne(data) {
        var source = data.data,
            plan_names = util.uniq(_.pluck(source, "plan_name")),
            newData = [],
            obj = {},
            related_flow = {
                13 : "分享购买",
                14 : "分销购买"
            },
            level ={
                1 : "1级",
                2 : "2级",
                3 : "3级",
                4 : "4级"
            };
        for(var plan_name of plan_names) {
            obj[plan_name] = {
                spu_num : 0,
                user_num : 0,
                order_num : 0,
                total_order_num : 0,
                order_amount : 0,
                total_order_amount : 0,
                rebate_amount : 0,
                refund_sku_num : 0,
                sku_num : 0
            };
        }
        for(var key of source) {
            var plan_name = key.plan_name;
            obj[plan_name].shop_name = key.shop_name;
            obj[plan_name].deadline = key.deadline;
            obj[plan_name].related_flow = key.related_flow;
            obj[plan_name].level = key.level;
            obj[plan_name].spu_num += key.spu_num;
            obj[plan_name].user_num += key.user_num;
            obj[plan_name].order_num += key.order_num;
            obj[plan_name].total_order_num += key.total_order_num;
            obj[plan_name].order_amount += key.order_amount;
            obj[plan_name].total_order_amount += key.total_order_amount;
            obj[plan_name].rebate_amount += key.rebate_amount;
            obj[plan_name].refund_sku_num += key.refund_sku_num;
            obj[plan_name].sku_num += key.sku_num;
        }
        Object.keys(obj).forEach((key, value) => {
            newData.push({
                id : value + 1,
                plan_name : key,
                shop_name : obj[key].shop_name,
                deadline : obj[key].deadline,
                related_flow : related_flow[obj[key].related_flow],
                level : level[obj[key].level],
                spu_num : obj[key].spu_num,
                user_num : obj[key].user_num,
                pay_rate : obj[key].order_num + "/" + obj[key].total_order_num,
                pay_price_rate : obj[key].order_amount + "/" + obj[key].total_order_amount,
                rebate_amount : obj[key].rebate_amount,
                refund_rate : util.toFixed(obj[key].refund_sku_num, obj[key].sku_num)
            });
        });
        return util.toTable([newData], data.rows, data.cols);
    }
};
