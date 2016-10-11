/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */
var util = require("../../utils")

module.exports = {
    businessAllOne(data, dates) {
        var source = data.first.data[0],
            now = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000)),
            obj = {
                order_num : 0,
                order_amount : 0,
                shop_num : 0,
                buyer_num : 0,
                product_quantity : 0,
                canceled_order_num : 0,
                plan_rebate_amount : 0,
                plan_rebate_user_num : 0,
                canceled_rebate_amount : 0,
                rebate2account_order_num : 0,
                rebate2account_amount : 0,
                rebate2platform_amount : 0,
                return_items_num : 0,
                return_items_quantity : 0,
                return_items_user_num : 0,
                return_items_amount : 0
            },
            total = {
                total_order_num : 0,
                total_order_amount : 0,
                total_shop_num : 0,
                total_buyer_num : 0,
                total_quantity : 0,
                total_canceled_order_num : 0,
                total_return_items_num : 0,
                total_return_items_quantity : 0,
                total_return_items_user_num : 0,
                total_return_items_amount : 0
            };

        for(let item of source) {
            let date = util.getDate(item.date);

            if(date === now) {
                for(let d of dates) {
                    if(d === now) {
                        for(let key in obj) {
                            obj[key] += item[key];
                        }
                    }
                }
                for(let key in total) {
                    total[key] += item[key];
                }
            } else {
                for(let key in obj) {
                    obj[key] += item[key];
                }
            }
        }

        let one = [{
            name : "返利订单",
            order_num : obj.order_num,
            order_amount : obj.order_amount.toFixed(2),
            shop_num : obj.shop_num,
            buyer_num : obj.buyer_num,
            product_quantity : obj.product_quantity,
            canceled_order_num : obj.canceled_order_num
        }, {
            name : "总占比",
            order_num : util.toFixed(obj.order_num, total.total_order_num),
            order_amount : util.toFixed(obj.order_amount, total.total_order_amount),
            shop_num : util.toFixed(obj.shop_num, total.total_shop_num),
            buyer_num : util.toFixed(obj.buyer_num, total.total_buyer_num),
            product_quantity : util.toFixed(obj.product_quantity, total.total_quantity),
            canceled_order_num : util.toFixed(obj.canceled_order_num, total.total_canceled_order_num)
        }],
            twe = [{
                plan_rebate_amount : obj.plan_rebate_amount.toFixed(2),
                plan_rebate_user_num : obj.plan_rebate_user_num,
                canceled_rebate_amount : obj.canceled_rebate_amount.toFixed(2),
                rebate2account_order_num : obj.rebate2account_order_num,
                rebate2account_amount : obj.rebate2account_amount.toFixed(2),
                rebate2platform_amount : obj.rebate2platform_amount.toFixed(2)
            }],
            three = [{
                name : "返利订单",
                return_items_num : obj.return_items_num,
                return_items_quantity : obj.return_items_quantity,
                return_items_user_num : obj.return_items_user_num,
                return_items_amount : obj.return_items_amount.toFixed(2)
            }, {
                name : "返利退货订单占比",
                return_items_num : util.toFixed(obj.return_items_num, total.total_return_items_num),
                return_items_quantity : util.toFixed(obj.return_items_quantity, total.total_return_items_quantity),
                return_items_user_num : util.toFixed(obj.return_items_user_num, total.total_return_items_user_num),
                return_items_amount : util.toFixed(obj.return_items_amount, total.total_return_items_amount)
            }];

        return util.toTable([one, twe, three], data.rows, data.cols);
    },
    businessAllTwe(data, filter_key, dates) {
        var source = data.first.data[0],
            orderSource = data.second.data[0],
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
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            newDataPie = {},
            newDataBar = {},
            objPie = {},
            objBar = {},
            mapPie = {},
            mapBar = {},
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额",
                order_num : "订单数"
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
            objPie[key.rebate_level].value += Math.round(key[filter_key]);
            objBar[key.rebate_level][key.level - 1] += Math.round(key[filter_key]);
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
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            newData = {},
            obj = {},
            map = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                product_sku_num : "商品件数",
                item_amount : "商品总金额",
                rebate_amount : "返利到账金额",
                order_num : "订单数"
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
        var source = data.first.data[0],
            count = data.first.count > 50 ? 50 : data.first.count,
            page = page || 1,
            newData = [],
            length = source.length;

        for(var i = 0; i < length; i++) {
            var obj = {
                id : (page - 1) * 20 + i + 1,
                shop_name : source[i].shop_name,
                plan_num : source[i].plan_num,
                participated_item_num : source[i].participated_item_num,
                buyer_num : source[i].buyer_num,
                pay_rate : source[i].order_num + "/" + source[i].total_order_num,
                pay_price_rate : source[i].order_amount.toFixed(2) + "/" + source[i].total_order_amount.toFixed(2),
                plan_rebate_amount : source[i].plan_rebate_amount.toFixed(2),
                rebate2account_amount : source[i].rebate2account_amount.toFixed(2),
                rebate2platform_amount : source[i].rebate2platform_amount.toFixed(2)
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    businessAllSix(data, page) {
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            count = data.first.count > 50 ? 50 : data.first.count,
            page = page || 1,
            newData = [],
            length = source.length,
            related_flow = {};
        for(var key of orderSource) {
            related_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < length; i++) {
            var obj = {
                id : (page - 1) * 20 + i + 1,
                plan_name : source[i].plan_name,
                shop_name : source[i].shop_name,
                related_flow : related_flow[source[i].related_flow],
                level : source[i].level,
                participated_user_num : source[i].participated_user_num,
                order_num : source[i].order_num,
                plan_rebate_amount : source[i].plan_rebate_amount.toFixed(2),
                rebate2account_amount : source[i].rebate2account_amount.toFixed(2),
                refund_rate : util.toFixed(source[i].return_items_quantity, source[i].sold_items_quantity)
            };
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    businessAllSeven(data) {
        let source = data.first.data[0],
            obj = {
                order_num : 0,
                buyer_num : 0,
                plan_rebate_amount : 0,
                canceled_order_num : 0,
                canceled_rebate_amount : 0,
                rebate_amount : 0
            };

        for(let item of source) {
            for(let key in obj) {
                obj[key] += item[key];
            }
        }

        obj.plan_rebate_amount = obj.plan_rebate_amount.toFixed(2);
        obj.canceled_rebate_amount = obj.canceled_rebate_amount.toFixed(2);
        obj.rebate_amount = obj.rebate_amount.toFixed(2);

        return util.toTable([[obj]], data.rows, data.cols);
    },
    planOne(data, page) {
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            count = data.first.count,
            page = page || 1,
            newData = [],
            related_flow = {};
        for(var key of orderSource) {
            related_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.id = (page - 1) * 20 + i + 1;
            key.related_flow = related_flow[key.related_flow];
            key.plan_rebate_amount = key.plan_rebate_amount.toFixed(2);
            key.rebate2account_amount = key.rebate2account_amount.toFixed(2);
            key.refund_rate = util.toFixed(key.return_items_quantity, key.sold_items_quantity);
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};
