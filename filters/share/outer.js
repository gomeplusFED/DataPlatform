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
            count = data.dataCount,
            sum = data.dataSum;
        for(var key of source) {
            key.open_num_rate = util.toFixed(key.open_num, sum[1]);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};