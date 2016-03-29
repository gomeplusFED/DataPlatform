/**
 * @author yanglei
 * @date 20160225
 * @fileoverview 分享数据
 */

var _ = require('lodash');

module.exports = {
    inside(data) {
        return data;
    },
    outer(data) {
        var tableData = [],
            mapData = [],
            source = data.data,
            keys = _.uniq(_.pluck(source, 'channel')),
            dates = _.uniq(_.pluck(source, 'date')),
            tableObj = {},
            total_time = 0,
            lines = [];
        for(var key of keys) {
            lines.push({
                name : key,
                type : "line",
                key : key + "_" + "share_time"
            });
            tableObj.channel = key;
            tableObj.share_time = 0;
            for(var k of source) {
                if(key === k.channel) {
                    total += k.share_time;
                    tableObj.share_time += k.share_time;
                }
            }
            tableData.push({
                channel : key,
                share_time : tableObj.share_time
            });
        }
        for(var i = 0; i < tableData.length; i++) {
            tableData[i].share_time_rate =
                (tableData[i].share_time / total_time === 0 ? 1 : total_time * 100).toFixed(0) + "%";
        }
        for(var date of dates) {
            var mapObj = {
                date : date
            };
            for(var k of keys) {
                mapObj[k + "_" + "share_time"] = 0;
            }
            for(var k of source) {
                if(date === k.date) {
                    mapObj[k.channel + "_" + "share_time"] += k.share_time;
                }
            }
            mapData.push(mapObj);
        }
        data.tableData = tableData;
        data.data = mapData;
        return data;
    }
};