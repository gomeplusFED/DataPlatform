/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 优惠券信息
 */
var _ = require("lodash"),
    util = require("../../utils");

module.exports = {
    couponInfoOne(data) {
        var source = data.data,
            type = "bar",
            map = {
                get_coupon_cut : "领取数量",
                used_coupon_cut : "使用数量"
            },
            newData = {},
            coupons = util.uniq(_.pluck(source, "coupon_facevalue")),
            length = coupons.length;
        coupons.sort((a, b) => {
            return a - b;
        });
        for(var i = 0; i < length; i++) {
            if(isNaN(new Number(coupons[i]))) {
                var obj = coupons[i];
                for(var x = i; x < length; x++) {
                    coupons[x] = coupons[x + 1];
                }
                coupons[length - 1] = obj;
            }
        }
        for(var coupon of coupons) {
            var obj = {
                get_coupon_cut : 0,
                used_coupon_cut : 0
            };
            for(var key of source) {
                if(coupon === key.coupon_facevalue) {
                    obj.get_coupon_cut += key.get_coupon_cut;
                    obj.used_coupon_cut += key.used_coupon_cut;
                }
            }
            newData[coupon] = obj;
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {  // 配置信息
                stack: false  // 图的堆叠
            }
        }]
    },
    couponInfoTwo(data) {
        var source = data.data;
        source.sort((a, b) => {
            return b.date - a.date;
        });
        return util.toTable([source], data.rows, data.cols);
    }
};