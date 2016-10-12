/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
const util = require("../../utils");

module.exports = {
    marketOne(data, filter_key, dates) {
        const source = data.first.data[0],
            filter_name = {
                active_pv : "活动页面PV",
                register : "活动新增注册",
                coupon_get_num : "优惠券领取数量",
                coupon_use_num : "优惠券使用数量",
                order_num : "订单总量",
                pay_num : "支付总量",
                order_num_money : "订单总金额",
                pay_num_money : "实际支付总金额"
            },
            type = "line",
            map = {
                value : filter_name[filter_key]
            };
        let newData = {};

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            newData[date].value += item[filter_key];
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
    marketTwo(data, page) {
        let source = data.first.data[0],
            count = data.first.count,
            second = data.second.data[0],
            config = {};

        for(let item of second) {
            config[item.channel_id] = item.channel_name;
        }

        for(let i = 0; i < source.length; i++) {
            source[i].top = (page - 1) * 20 + i + 1;
            source[i].channel_name = config[source[i].channel_no];
            source[i].operating =
                `<button class='btn btn-default' url_link='/channelAnalysis/marketOperating' url_fixed_params='{"channel_no": "${source[i].channel_no}"}'>详细>></button>`;
        }

        return util.toTable([source], data.rows, data.cols, [count > 50 ? 50 : count]);
    }
};