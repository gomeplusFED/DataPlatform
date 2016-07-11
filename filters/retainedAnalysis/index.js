/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    retainedOne(data) {
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.last_1_keep = util.toFixed(key.last_1_keep, key.new_user);
            key.last_7_keep = util.toFixed(key.last_7_keep, key.new_user);
            key.last_14_keep = util.toFixed(key.last_14_keep, key.new_user);
            key.last_30_keep = util.toFixed(key.last_30_keep, key.new_user);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};