/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    outerOne(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            map = {},
            channels = util.uniq(_.pluck(source, "channel")),
            newData = {};
        for(var channel of channels) {
            map[channel] = channel;
        }
        for(var date of dates) {
            newData[date] = {};
            for(var channel of channels) {
                newData[date][channel] = 0;
            }
        }
        for(var key of source) {
            newData[util.getDate(key.date)][key.channel] += key.open_num;
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
    outerTwo(data) {
        var source = data.data,
            obj = {},
            total_open_num = 0,
            newData = [],
            channels = util.uniq(_.pluck(source, "channel"));
        for(var channel of channels) {
            obj[channel] = {
                open_num : 0
            };
        }
        for(var key of source) {
            total_open_num += key.open_num;
            obj[channel].open_num += key.open_num;
        }
        for(var channel of channels) {
            newData.push({
                channel : channel,
                open_num : obj[channel].open_num,
                open_num_rate : util.toFixed(obj[channel.open_num, total_open_num])
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};