/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 用户分析
 */
var _ = require("lodash"),
    moment = require("moment"),
    util = require("../../utils");

module.exports = {
    One(data, mapKey, mapName, dates) {
        var type = "line",
            source = data.data,
            newData = {},
            data = [],
            map = {};
        for(var i = 0; i < mapKey.length; i++) {
            map[mapKey[i]] = mapName[i];
        }
        for(var date of dates) {
            var obj = {
                new_users : 0,
                new_account : 0,
                active_account : 0,
                active_users : 0,
                start_up : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj.new_users += key.new_users;
                    obj.new_account += key.new_account;
                    obj.active_account += key.active_account;
                    obj.active_users += key.active_users;
                    obj.start_up += key.start_up;
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
    },
    newUsersTwe(data, dates) {
        var source = data.data,
            newData = [],
            total_users = 0,
            total_account = 0;
        for(var date of dates) {
            var obj = {
                date : date,
                new_users : 0,
                new_account : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
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
        newData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return util.toTable([newData], data.rows, data.cols);
    },
    activeUsersTwe(data, dates) {
        var source = data.data,
            newData = [],
            total_users = 0,
            total_account = 0;
        for(var date of dates) {
            var obj = {
                date : date,
                active_users : 0,
                active_account : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    total_users += key.active_users;
                    total_account += key.active_account;
                    obj.active_users += key.active_users;
                    obj.active_account += key.active_account;
                }
            }
            newData.push(obj);
        }
        for(var key of newData) {
            key.active_users_rate = util.toFixed(key.active_users, total_users);
            key.active_account_rate = util.toFixed(key.active_account, total_account);
        }
        newData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return util.toTable([newData], data.rows, data.cols);
    },
    startUp(data, dates) {
        var source = data.data,
            newData = [];
        dates.sort((a, b) => {
            return new Date(b) - new Date(a);
        });
        for(var date of dates) {
            var obj = {
                date : date,
                start_up : 0,
                active_users : 0,
                active_account : 0,
                startup_per : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj.start_up += key.start_up;
                    obj.active_users += key.active_users;
                    obj.active_account += key.active_account;
                    obj.startup_per += key.startup_per;
                }
            }
            newData.push(obj);
        }
        for(var key of newData) {
            key.startup_per = key.startup_per.toFixed(2);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    versionOne(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            map = {},
            filter_name = {
                new_users : "新增用户",
                active_users : "活跃用户",
                start_up : "启动次数"
            };
    }
};