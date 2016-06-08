/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    channelOne(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            thirdSource = data.thirdData,
            _top = 0,
            _newArray = [],
            obj = {},
            _array = [],
            type = "line",
            map = {},
            newData = {};
        for(var key of thirdSource) {
            obj[key.channel_id] = [];
        }

        for(var date of dates) {
            var _obj = {};
            for(key of thirdSource) {
                _obj[key.channel_id] = 0;
            }
            newData[date] = _obj;
        }

        if(filter_key === "keep_rate") {
            _newArray = sort(orderSource);
            _top = _newArray.length > 10 ? 10 : _newArray.length;
            newData = returnData(_newArray, _top, map);
        } else {
            _newArray = sort(source);
            _top = _newArray.length > 10 ? 10 : _newArray.length;
            newData = returnData(_newArray, _top, map);
        }

        function sort(array) {
            for(key of array) {
                obj[key.channel_id].push(key);
            }
            for(key in obj) {
                if(obj[key].length > 0) {
                    _array.push(obj[key]);
                }
            }
            return _array.sort((a, b) => {
                var total_a = 0,
                    total_b = 0;
                for(key of a) {
                    total_a += key[filter_key];
                }
                for(key of b) {
                    total_b += key[filter_key];
                }
                return total_b - total_a;
            });
        }

        function returnData(array, top, map) {
            var a = [];
            for(var i = 0; i < top; i++) {
                for(var key of array[i]) {
                    a.push(key);
                    if(filter_key === "keep_rate") {
                        map[key.channel_id] = key.channel_name + "(%)";
                    } else {
                        map[key.channel_id] = key.channel_name;
                    }
                }
            }
            for(key of a) {
                var date = util.getDate(key.date);
                if(filter_key === "keep_rate") {
                    newData[date][key.channel_id] = (key[filter_key] * 100).toFixed(2);
                } else {
                    newData[date][key.channel_id] = key[filter_key];
                }
            }
            return newData;
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
    channelTwo(data) {
        var source = data.data,
            channels = util.uniq(_.pluck(source, "channel")),
            total_new_users = 0,
            obj = {},
            newData = [];
        for(var channel of channels) {
            obj[channel] = {
                new_users : 0,
                active_users : 0,
                start_up : 0
            }
        }
        for(var key of source) {
            total_new_users += key.new_users;
            obj[key.channel].new_users += key.new_users;
            obj[key.channel].active_users += key.active_users;
            obj[key.channel].start_up += key.start_up;
        }
        for(var channel of channels) {
            newData.push({
                channel : channel,
                new_users : obj[channel].new_users,
                active_users : obj[channel].active_users,
                start_up : obj[channel].start_up,
                new_users_rate : util.toFixed(obj[channel].new_users, total_new_users)
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};