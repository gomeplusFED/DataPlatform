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
        var source = data.first.data,
            one = [],
            two = [{
                rebate_order_count : source[10] || 0,
                rebate_amount_count : source[11] || 0
            }],
            three = [];

        one.push({
            name : "返利订单",
            order_count : source[1] || 0,
            rebate_order_amount_count : source[3] || 0,
            participate_seller_count : source[5] || 0,
            participate_user_count : source[7] || 0,
            productSku_num : source[9] || 0
        });
        one.push({
            name : "总占比",
            order_count : util.toFixed(
                one[0].order_count,
                source[0] || 0
            ),
            rebate_order_amount_count : util.toFixed(
                one[0].rebate_order_amount_count,
                source[2] || 0
            ),
            participate_seller_count : util.toFixed(
                one[0].participate_seller_count,
                source[4] || 0
            ),
            participate_user_count : util.toFixed(
                one[0].participate_user_count,
                source[6] || 0
            ),
            productSku_num : util.toFixed(
                one[0].participate_user_count,
                source[8] || 0
            )
        });

        three.push({
            name: "返利订单",
            spu_count: source[13] || 0,
            sku_count: source[15] || 0,
            refund_user_count: source[17] || 0,
            refund_goods_amount_count: source[19] || 0
        });
        three.push({
            name: "返利退货订单占比",
            spu_count: util.toFixed(
                three[0].spu_count,
                source[12] || 0
            ),
            sku_count: util.toFixed(
                three[0].sku_count,
                source[14] || 0
            ),
            refund_user_count: util.toFixed(
                three[0].refund_user_count,
                source[16] || 0
            ),
            refund_goods_amount_count: util.toFixed(
                three[0].refund_goods_amount_count,
                source[18] || 0
            )
        });
        return util.toTable([one, two, three], data.rows, data.cols);
    },
    platformOrderTwe(data, filter_key, dates) {
        var source = data.first.data[0],
            type = "line",
            orderSource = data.second.data[0],
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
            newData[date][filter_key + "_" + key.plan_type] += Math.round(key["sum_" + filter_key]);
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
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            typePie = "pie",
            typeBar = "bar",
            mapPie = {},
            mapBar = {},
            newDataPie = {},
            newDataBar = {},
            filter_name = {
                is_rebate_merchandise_num: "商品件数",
                is_rebate_fee: "商品总金额",
                is_over_rebate_order_amount: "返利到账金额"
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
            objPie[key.level].value += key["sum_" + filter_key];
            objBar[key.level][key.rebate_level] += key["sum_" + filter_key];
        }

        //if(filter_key !== "is_over_rebate_order_amount") {
        //    for(var key in objBar) {
        //        for(var i = 0; i < levelMax - 1; i++) {
        //            objBar[key][i] -= objBar[key][i + 1];
        //        }
        //    }
        //}

        if(filter_key !== "is_rebate_merchandise_num") {
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
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            newData = {},
            map = {},
            obj = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                unique_is_rebate_merchandise_num: "商品件数",
                is_rebate_fee: "商品总金额",
                is_over_rebate_order_amount: "返利到账金额"
            };
        for(var key of orderSource) {
            obj[key.type_code] = {
                value : 0
            };
        }
        for(key of source) {
            obj[key.plan_type].value += Math.round(key["sum_" + filter_key]);
        }

        if(filter_key !== "unique_is_rebate_merchandise_num") {
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
        var source = data.first.data[0],
            count = data.first.count,
            orderSource = data.second.data,
            page = page || 1,
            user_party = {},
            correlate_flow = {};
        for(var key of orderSource) {
            user_party[key.type_code] = key.type_name;
            correlate_flow[key.flow_code] = key.flow_name;
        }
        source.forEach((key, value) => {
            key.id = (page - 1) * 20 + value + 1;
            key.plan_type = user_party[key.plan_type];
            key.rebate_type = correlate_flow[key.rebate_type];
            key.order_rate = key.unique_is_rebate_order_num + "/" + key.unique_order_num;
            key.price_rate = key.is_rebate_fee.toFixed(2) + "/" + key.fee.toFixed(2);
            key.is_over_rebate_order_amount = key.is_over_rebate_order_amount.toFixed(2);
        });
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};
