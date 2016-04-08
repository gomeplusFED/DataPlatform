/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 用户分析
 */
var _ = require("lodash"),
    moment = require("moment"),
    util = require("../../utils");

module.exports = {
    newUsersOne(data) {
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
            newData[moment(date).format("YYYY-MM-DD")] = obj;
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
    },
    newUsersTwe(data) {
        var source = data.data,
            newData = [],
            total_users = 0,
            total_account = 0,
            dates = util.uniq(_.pluck(source, "date"));
        for(var date of dates) {
            var obj = {
                date : moment(date).format("YYYY-MM-DD"),
                new_users : 0,
                new_account : 0
            };
            for(var key of source) {
                if(date.getTime() === key.date.getTime()) {
                    total_users += key.new_users;
                    total_account += key.new_account;
                    obj.new_users += key.new_users;
                    obj.new_account += key.new_account;
                }
            }
            newData.push(obj);
        }
        for(var key of newData) {
            key.new_users_rate = (key.new_users / (total_users === 0 ? 1 : total_users) * 100).toFixed(1) + "%";
            key.new_account_rate = (key.new_account / (total_account === 0 ? 1 : total_account) * 100).toFixed(1) + "%";
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};