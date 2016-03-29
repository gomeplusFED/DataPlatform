/**
 * @author yanglei
 * @date 20160304
 * @fileoverview 营销分析
 */

var _ = require('lodash');

module.exports = {
    activityFlow(data) {
        var source = data.data;
        source.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].infos = "<a href='Javascript:void(0)' class='infos'>详情</a>"
        }
        data.data = source;
        return data;
    },
    couponInfo(data) {
        var source = data.data;
        source.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        var Xdata = [];
        var newdata = [];
        var mapdata = [];
        var keys = _.uniq(_.pluck(source, "coupon_facevalue"));
        for(var key of keys) {
            Xdata.push(key);
            var get_coupon_cut_total = 0;
            var used_coupon_cut_total = 0;
            for(var k of mapdata) {
                if(k.coupon_facevalue === key) {
                    get_coupon_cut_total = get_coupon_cut_total + key.get_coupon_cut;
                    used_coupon_cut_total = used_coupon_cut_total + key.used_coupon_cut;
                }
            }
            mapdata.push({
                get_coupon_cut : get_coupon_cut_total,
                used_coupon_cut : used_coupon_cut_total
            });
        }
        data.mapdata = mapdata;
        data.Xdata = Xdata;
        data.diff = true;
        data.data = source;
        return data;
    },
    overview(data) {
        var newdata = [],
            obj = {
                visitor_cut : 0,
                pv : 0,
                jump_loss_rate : 0,
                h5_conversion_rate : 0
            };
        for(var key of data) {
            obj.visitor_cut += key.visitor_cut;
            obj.pv += key.pv;
            obj.jump_loss_rate += key.jump_loss_rate;
            obj.h5_conversion_rate += key.h5_conversion_rate;
        }
        obj.jump_loss_rate = obj.jump_loss_rate.toFixed(2) + "%";
        obj.h5_conversion_rate = obj.h5_conversion_rate.toFixed(2) + "%";
        newdata.push(obj);
        data = newdata;
        return data;
    }
};