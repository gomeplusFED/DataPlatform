/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动流量
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    operatingOne(data, query, dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            filter_name = {
                active_pv : "活动页PV",
                register : "新增注册",
                coupon_get_num : "优惠卷领取数量",
                coupon_use_num : "优惠卷使用数量",
                order_num : "订单总量",
                pay_num : "支付总量",
                order_num_money : "订单总金额",
                pay_num_money : "实际支付总金额"
            },
            config = {},
            newData = {},
            type = "bar",
            map = {},
            filter_keys = query.filter_key.split("-"),
            filter_type = query.filter_type || "date";

        for(let key of filter_keys) {
            map[key] = filter_name[key];
        }

        if(filter_type === "date") {
            for(let date of dates) {
                newData[date] = {};
                for(let key of filter_keys) {
                    newData[date][key] = 0;
                }
            }

            for(let item of source) {
                let date = util.getDate(item.date);
                for(let key of filter_keys) {
                    newData[date][key] += item[key];
                }
            }
        } else {
            let obj = {};
            for(let item of second) {
                config[item.channel_id] = item.channel_name;
                obj[item.channel_id] = {};
                for(let key of filter_keys) {
                    obj[item.channel_id][key] = 0;
                }
            }
            for(let item of source) {
                for(let key of filter_keys) {
                    obj[item.channel_id][key] += item[key];
                }
            }
            for(let key in obj) {
                newData[config[key]] = obj[key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }];
    }
};