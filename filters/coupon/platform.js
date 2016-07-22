/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 平台优惠券
 */
var util = require("../../utils");

module.exports = {
    platformCouponThree(data) {
        var source = data.data,
            type = "bar",
            map = {
                receive_rate : "领取占比（%）",
                used_rate : "使用占比（%）",
                rate : "使用率（%）"
            },
            array = ["1-10", "11-20", "21-30", "31-50", "51-100", "101-500"],
            newData = {},
            obj = {},
            total_receive = 0,
            total_used = 0;

        for(var key of array) {
            obj[key] = {
                receive_num : 0,
                used_num : 0
            };
        }

        for(var key of source) {
            total_receive += key.receive_num;
            total_used += key.used_num;
            obj[key.discount_interrgional].receive_num += key.receive_num;
            obj[key.discount_interrgional].used_num += key.used_num;
        }

        for(var key in obj) {
            newData[key + "元"] = {
                receive_rate : util.toRound(obj[key].receive_num, total_receive),
                used_rate : util.toRound(obj[key].used_num, total_used),
                rate : util.toRound(obj[key].used_num, obj[key].receive_num)
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    platformCouponFour(data) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.receive_rate = util.toFixed(key.receive_num, key.create_quantity_num);
            key.used_rate = util.toFixed(key.used_num, key.receive_num);
            key.expired_rate = util.toFixed(key.used_num, key.receive_num);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};