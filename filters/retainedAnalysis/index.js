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
            count = data.dataCount,
            keep_type = {
                "0" : "次日留存率",
                "1" : "7日留存率",
                "2" : "14日留存率",
                "3" : "30日留存率"
            };
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.keep = util.toFixed(key.keep_num, key.new_user);
            key.keep_type = keep_type[key.keep_type];
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};