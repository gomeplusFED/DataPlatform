/**
 * @author yanglei
 * @date 20160310
 * @fileoverview 渠道分析
 */

var _ = require('lodash');

module.exports = (data, line_key) => {
    var tabledata = [],
        mapdata = [],
        source = data.data,
        lines = [],
        tableObj = {},
        total_users = 0,
        keys = _.uniq(_.pluck(source, 'channel')),
        topChannel = 10 < keys.length ? 10 : keys.length,
        dates = _.uniq(_.pluck(source, 'date'));

    for(var key of keys) {
        tableObj.new_users = 0;
        tableObj.active_users = 0;
        tableObj.start_up = 0;
        for(var k of source) {
            if(key === k.channel) {
                total_users += k.new_users;
                tableObj.new_users += k.new_users;
                tableObj.active_users += k.active_users;
                tableObj.start_up += k.start_up;
            }
        }
        tabledata.push({
            channel : key,
            new_users : tableObj.new_users,
            active_users : tableObj.active_users,
            start_up : tableObj.start_up
        });
    }
    tabledata.sort((a, b) => {
        return b[line_key] - b[line_key];
    });
    for(var i = 0; i < tabledata.length; i++){
        tabledata[i].new_users_rate = (tabledata[i].new_users / total_users === 0 ? 1 : total_users * 100).toFixed(0) + '%';
    }

    for(var key of dates) {
        var obj = {};
        for(var k of keys) {
            obj[line_key + "_" + k] = 0;
        }
        for(var k of source) {
            obj.date = k;
            for(var i = 0; i < topChannel; i++) {
                lines.push({
                    name : key,
                    type : 'line',
                    key : line_key + "_" + tabledata[i].channel
                });
                if(key === k.date && k.channel === tabledata[i].channel) {
                    obj[line_key + "_" + k] += k[line_key];
                }
            }
        }
        mapdata.push(obj);
    }

    data.tableData = tabledata;
    data.lines = lines;
    data.data = mapdata;
    return data;
};