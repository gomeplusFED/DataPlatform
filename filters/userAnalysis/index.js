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
            count = data.dataCount,
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
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    startUp(data, dates) {
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.startup_per = util.division(key.start_up, key.active_users);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    versionOne(data, filter_key, dates) {
        var source = data.data,
            vers = util.uniq(_.pluck(source, "ver")),
            newData = {},
            array = [],
            type = "line",
            filter_name = {
                new_users : "新增用户",
                active_users : "活跃用户",
                start_up : "启动次数"
            },
            map = {};
        for(var ver of vers) {
            if(ver !== "ALL") {
                var obj = {
                    ver : ver,
                    value : 0
                };
                for(var key of source) {
                    if(key.ver === ver) {
                        obj.value += key[filter_key];
                    }
                }
                array.push(obj);
            }
        }
        array.sort((a, b) => {
            return b.value - a.value;
        });
        var top = array.length > 10 ? 10 : array.length;
        for(var i = 0; i < top; i++) {
            map[array[i].ver] = array[i].ver + "版本";
        }
        for(var date of dates) {
            var obj = {};
            for(var i = 0; i < top; i++) {
                obj[array[i].ver] = 0;
            }
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj[key.ver] += key[filter_key];
                }
            }
            newData[date] = obj;
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
        var source = data.data,
            count = data.dataCount,
            sum = data.dataSum[1] ? data.dataSum[1] : 1;
        for(var key of source) {
            key.total_users_rate = util.toFixed(key.total_users, sum);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};