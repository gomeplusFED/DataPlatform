/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    groupOne(data) {
        var source = data.data,
            groupDataArr = util.uniq(_.pluck(source, "channel")),
            total_new_users = 0,
            obj = {},
            newData = [];
        for(var groupData of groupDataArr) {
            obj[groupData] = {
                new_group_count : 0,
                new_group_user_count : 0,
                new_group_user_rate : 0, // str, needs calculation
                accumulated_group_all_count : 0,
                accumulated_group_user_all_count : 0,
                user_join_group_rate : 0 //str, needs calculation
            }
        }
        for(var key of source) {
            //...
        }
        for(var groupData of groupDataArr) {
            newData.push({
            //...
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};