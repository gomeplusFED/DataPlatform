/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 优惠券信息
 */
var _ = require("lodash"),
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
    couponInfoTwo(data) {
        var source = data.data,
            count = data.dataCount;
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};