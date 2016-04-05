/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 用户分析
 */
var _ = require("lodash"),
    util = require("../utils");

module.exports = {
    newUsers(data) {
        var type = "line",
            source = data.data,
            newData = {},
            data = [],
            map = {
                new_users : "新增用户",
                new_account : "新增账户"
            },
            dates = util.uniq(_.pluck(source, "date"));
        for(var date of dates) {
            var obj = {
                new_users : 0,
                new_account : 0
            };
            for(var key of source) {
                if(date.getTime() === key.date.getTime()) {
                    obj.new_users += key.new_users;
                    obj.new_account += key.new_account;
                }
            }
            newData[date] = obj;
        }
        data.push({
            type : type,
            data : newData,
            map : map,
            config: {
                stack: false
            }
        });
        return data;
    }
};