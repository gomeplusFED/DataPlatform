/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动流量
 */
var util = require("../../utils"),
    _ = require("lodash"),
    moment = require("moment");

module.exports = {
    operatingOne(data, query, dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            channel_ids = _.uniq(_.pluck(source, "channel_no")),
            categoryY = false,
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
            categoryY = true;
            for(let item of second) {
                config[item.channel_id] = item.channel_name;
            }
            for(let id of channel_ids) {
                obj[id] = {};
                for(let key of filter_keys) {
                    obj[id][key] = 0;
                }
            }
            for(let item of source) {
                for(let key of filter_keys) {
                    if(obj[item.channel_no][key]) {
                        obj[item.channel_no][key] += item[key];
                    } else {
                        obj[item.channel_no][key] = item[key];
                    }
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
                stack: false, // 图的堆叠
                categoryY : categoryY
            }
        }];
    },
    operatingTwo(data, query, dates) {
        let source = data.first.data,
            count = data.first.count,
            second = data.second.data[0],
            config = {},
            filter_type = query.filter_type || "date",
            filter_key = query.filter_key,
            rowsObj = {
                flow : ["active_pv", "active_uv", "register", "share_button_uv",
                    "share_button_pv", "product_rate"],
                orderForm : ["product_rate", "order_num", "pay_user", "pay_num_money", "return_user",
                    "return_num_money"],
                coupon : ["product_rate", "coupon_get_user", "coupon_get_num", "coupon_use_user",
                    "coupon_use_num", "rate"],
                product : ["product_pv", "product_rate", "order_num", "order_num_money",
                    "pay_user", "pay_num_money", "pay_rate", "return_user",
                    "return_num_money"]
            },
            colsObj = {
                flow : [
                    {
                        caption : "活动页PV",
                        type : "number",
                        help : "活动页的访问次数"
                    }, {
                        caption : "活动页UV",
                        type : "number",
                        help : "活动页的访问人数"
                    }, {
                        caption : "新增注册",
                        type : "number",
                        help : "通过活动带来的注册数"
                    }, {
                        caption : "分享按钮点击人数",
                        type : "number",
                        help : "分享按钮点击人数"
                    }, {
                        caption : "分享按钮点击次数",
                        type : "number",
                        help : "分享按钮的点击次数"
                    }, {
                        caption : "进入商品页转化率",
                        type : "string",
                        help : "通过活动页跳转商品页的浏览人数/活动页浏览人数"
                    }
                ],
                orderForm : [
                    {
                        caption : "商品页转化率",
                        type : "string",
                        help : "通过活动页跳转商品页的浏览人数/活动页浏览人数"
                    },
                    {
                        caption : "订单总量",
                        type : "number",
                        help : "活动页带来的订单总量（支付成功）"
                    }, {
                        caption : "支付用户数",
                        type : "number",
                        help : "支付成功订单的用户数量"
                    }, {
                        caption : "实际支付金额",
                        type : "number",
                        help : "支付成功订单的实际支付总金额"
                    }, {
                        caption : "退货用户数",
                        type : "number",
                        help : "时间段内活动退货的用户数量"
                    }, {
                        caption : "实际退货总金额",
                        type : "number",
                        help : "时间段内活动退货的总金额"
                    }
                ],
                coupon : [
                    {
                        caption : "领取人数",
                        type : "number"
                    }, {
                        caption : "领取数量",
                        type : "number"
                    }, {
                        caption : "使用人数",
                        type : "number"
                    }, {
                        caption : "使用数量",
                        type : "number"
                    }, {
                        caption : "使用转化率",
                        type : "string",
                        help : "优惠券使用数量/优惠券领取数量"
                    }
                ],
                product : [
                    {
                        caption : "商品页面PV",
                        type : "number"
                    },
                    {
                        caption : "页面转化率",
                        type : "string",
                        help : "通过活动页跳转商品页的浏览人数/活动页浏览人数"
                    }, {
                        caption : "订单总量",
                        type : "number",
                        help : "活动页带来的订单总量（支付成功）"
                    }, {
                        caption : "订单总金额",
                        type : "number"
                    }, {
                        caption : "支付用户数",
                        type : "number",
                        help : "支付成功订单的用户数量"
                    }, {
                        caption : "实际支付总金额",
                        type : "number",
                        help : "支付成功订单的实际支付总金额"
                    }, {
                        caption : "支付转化率",
                        type : "string",
                        help : "支付用户数/活动页UV"
                    }, {
                        caption : "退货用户数",
                        type : "number",
                        help : "时间段内活动退货的用户数量"
                    }, {
                        caption : "退货总金额",
                        type : "number",
                        help : "时间段内活动退货的总金额"
                    }
                ]
            },
            rows,
            cols;

        if(filter_type === "date") {
            rows = [["date"].concat(rowsObj[filter_key])];
            cols = [[{
                caption : "日期",
                type : "string"
            }].concat(colsObj[filter_key])];
        } else {
            rows = [["channel"].concat(rowsObj[filter_key])];
            cols = [[{
                caption : "渠道",
                type : "string"
            }].concat(colsObj[filter_key])];
            for(let key of second) {
                config[key.channel_id] = key.channel_name;
            }
        }

        for(let item of source) {
            if(item.channel_no) {
                item.channel = config[item.channel_no];
            } else {
                item.date = moment(item.date).format("YYYY-MM-DD");
            }
            item.rate = util.toFixed(item.coupon_use_num, item.coupon_get_num);
            item.pay_rate = util.toFixed(item.pay_user, item.active_uv);
            item.product_rate = util.toFixed(item.product_pv, item.active_pv);
        }

        return util.toTable([source], rows, cols, [count]);
    }
};