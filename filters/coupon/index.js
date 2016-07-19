/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var util = require("../../utils");

module.exports = {
    allOne(data) {
        return util.toTable([[]], data.rows, data.cols);
    }
};