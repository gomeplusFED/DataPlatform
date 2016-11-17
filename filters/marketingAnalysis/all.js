/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 优惠券信息
 */
var moment = require("moment"),
    util = require("../../utils");

module.exports = {
    allOne(data) {
        let source = data.first.data,
            obj = {};
        for(let i = 0; i < source.length; i++) {
            obj[data.rows[0][i]] = source[i] || 0;
        }

        return util.toTable([[obj]], data.rows, data.cols);
    },
    allTwo(data, query, dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            newData = {},
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
            type,
            map = {},
            filter_keys = query.filter_key.split("-"),
            filter_type = query.filter_type;

        for(let key of filter_keys) {
            map[key] = filter_name[key];
        }

        if(filter_type === "date") {
            type = "line";
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
            type = "bar";
            let obj = {};
            for(let key of second) {
                obj[key.activity_id] = {
                    name : key.activity_name
                };
                for(let key of filter_keys) {
                    obj[key.activity_id][key] = 0;
                }
            }
            for(let item of source) {
                for(let key of filter_keys) {
                    obj[item.active_no][key] += item[key];
                }
            }
            for(let key in obj) {
                newData[obj[key].name] = obj[key];
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
    },
    allThree(data) {
        let source = data.first.data,
            count = data.first.count,
            second = data.second.data[0],
            config = {};

        for(let item of second) {
            config[item.activity_id.substr(0, 5)] = {
                name : item.activity_name,
                start : item.activity_start_time,
                end : item.activity_end_time
            }
        }

        for(let item of source) {
            let obj = config[item.active_no];
            item.name = obj.name;
            item.date = `${moment(obj.start).format("YYYY-MM-DD HH:mm:ss")}到${moment(obj.end).format("YYYY-MM-DD HH:mm:ss")}`;
            item.rate = util.toFixed(item.product_pv, item.active_pv);
            item.operating =
                `<button class='btn btn-default' url_link='/marketingAnalysis/operating' url_fixed_params='{"active_no": "${item.active_no}"}'>详细>></button>`;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};