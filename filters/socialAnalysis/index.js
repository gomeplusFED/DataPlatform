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
            channels = util.uniq(_.pluck(source, "channel")),
            array = [],
            type = "line",
            map = {},
            newData = {};
        for(var channel of channels) {
            var obj = {
                channel : channel,
                value : 0
            };
            for(var key of source) {
                if(channel === key.channel) {
                    obj.value += key[filter_key];
                }
            }
            array.push(obj);
        }
        array.sort((a, b) => {
            return b.value - a.value;
        });
        var top = array.length > 10 ? 10 : array.length;
        for(var i = 0; i < top; i++) {
            map[array[i].channel] = array[i].channel;
        }
        for(var date of dates) {
            var obj = {};
            for(var i = 0; i< top; i++) {
                obj[array[i].channel] = 0;
            }
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj[key.channel] += key[filter_key];
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