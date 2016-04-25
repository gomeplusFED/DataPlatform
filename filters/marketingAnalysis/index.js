/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
var util = require("../../utils");

module.exports = {
    overviewOne(data) {
        var source = data.data,
            newData = [],
            obj = {
                visitor_cut : 0,
                pv : 0,
                jump_loss_rate : 0,
                h5_conversion_rate : 0
            };
        for(var key of source) {
            obj.visitor_cut += key.visitor_cut;
            obj.pv += key.pv;
            obj.jump_loss_rate += key.jump_loss_rate;
            obj.h5_conversion_rate += key.h5_conversion_rate;
        }
        obj.jump_loss_rate = obj.jump_loss_rate.toFixed(2) + "%";
        obj.h5_conversion_rate = obj.h5_conversion_rate.toFixed(2) + "%";
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    }
};