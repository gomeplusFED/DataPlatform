/**
 * @author yanglei
 * @date 20160302
 * @fileoverview 数据概览
 */
var _ = require('lodash');

module.exports = {
    tableData(data, users, rows) {
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        var obj = {
            name : '对比效果'
        };
        if(data.length === 2) {
            data[0].name = '前天';
            data[0].users = users[0].kpi_value;
            data[1].name = '昨天';
            data[1].users = users[1].kpi_value;
            for(var key of rows) {
                if(key.indexOf("avg") > 0 ) {
                    obj[key] = ((data[1][key] - data[0][key]) / data[1][key] === 0 ? 1 : data[1][key] * 100).toFixed(0)
                        + "%";
                } else if(key.indexOf("rate") > 0) {
                    obj[key] = data[1][key].replace("%", "") - data[0][key].replace("%", "") + "%";
                } else {
                    obj[key] = ((data[1][key] - data[0][key]) / data[0][key] === 0 ? 1 : data[0][key] * 100).toFixed(0)
                        + '%';
                }
            }
            data.push(obj);
        }
        return data;
    },
    accessPage(data) {
        for(var i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        return data;
    },
    dataTrends(data, rows) {
        var newdata = [],
            source = data.data,
            lines = [],
            dates = _.uniq(_.pluck(source, "date"));
        for(var date of dates) {
            var obj = {
                date : date,
                open_user_total : 0,
                open_total : 0,
                new_user : 0,
                new_account : 0,
                register_rate : 0,
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                visit_time_avg : 0
            };
            for(var key of data) {
                if(date === key.date) {
                    obj.open_user_total += key.open_user_total;
                    obj.open_total += key.open_total;
                    obj.new_user += key.new_user;
                    obj.new_account += key.new_account;
                    obj.register_rate += key.register_rate;
                    obj.using_time_avg += key.using_time_avg;
                    obj.uv += key.uv;
                    obj.pv += key.pv;
                    obj.ip_count += key.ip_count;
                    obj.visit_time_avg += key.visit_time_avg;
                }
            }
            newdata.push(obj);
        }
        for(var i = 0; i < data.rows.length; i++) {
            lines.push({
                name : data.cols[i],
                type : 'line',
                key : data.rows[i]
            });
        }
        data.lines = lines;
        data.data = newdata;
        return data;
    }
};