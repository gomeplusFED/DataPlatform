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
            source = data.first.data[0],
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
        var source = data.first.data[0],
            count = data.first.count,
            newData = [];
        for(var key of source) {
            newData.push({
                date : moment(key.date).format("YYYY-MM-DD"),
                new_users : key.new_users,
                new_users_rate : util.toFixed(key.new_users, key.active_users),
                new_account : key.new_account,
                new_account_rate : util.toFixed(key.new_account, key.active_account)
            });
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    activeUsersTwe(data, dates) {
        var source = data.first.data[0],
            count = data.first.count;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    startUp(data, dates) {
        var source = data.first.data[0],
            count = data.first.count;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.startup_per = util.division(key.start_up, key.active_users);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    versionOne(data, filter_key, dates) {
        var source = data.first.data[0],
            second = data.second.data[0],
            versions = [],
            newData = {},
            type = "line",
            map = {};

        second.sort((a, b) => {
            return b['sum_' + filter_key] - a['sum_' + filter_key];
        });

        for(let i = 0; i < second.length; i++) {
            if(i < 10) {
                versions.push(second[i].version);
            }
        }

        for(let version of versions) {
            map[version] = version + "版本";
        }

        for(let date of dates) {
            newData[date] = {};
            for(let version of versions) {
                newData[date][version] = 0;
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            if(newData[date][item.version]) {
                newData[date][item.version] += item[filter_key];
            } else {
                newData[date][item.version] = item[filter_key];
            }

        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    },
    versionTwo(data) {
        var source = data.first.data[0],
            count = data.first.count,
            sum = data.first.sum[0] ? data.first.sum[0] : 0;

        for(var key of source) {
            key.total_users_rate = util.toFixed(key.total_users, sum);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};