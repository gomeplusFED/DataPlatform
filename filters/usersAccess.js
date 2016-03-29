/**
 * @author yanglei
 * @date 20160225
 * @fileoverview 使用分析
 */

var _ = require('lodash');

module.exports = {
    access(data, name) {
        var newdata = [],
            source = data.data,
            keys = _.uniq(_.pluck(source, 'date')),
            urls = _.uniq(_.pluck(source, 'url')),
            tableData = [],
            acc_num_total = 0,
            acc_time_total = 0;
        for(var key of keys) {
            var obj = {};
            obj[name] = 0;
            obj.date = key;
            for(var k of source) {
                if(key === k.date) {
                    acc_num_total += k.acc_num;
                    acc_time_total += k.acc_time;
                    obj[name] += k[name];
                }
            }
            newdata.push(obj);
        }
        for(var i = 0; i < urls.length; i++) {
            var tableObj = {
                id : i + 1,
                url : urls[i],
                url_comment : "",
                acc_num : 0,
                acc_time : 0,
                bounce_rate : 0
            };
            for(var k of source) {
                if(urls[i] === k.url) {
                    tableObj.url_comment = k.url_comment;
                    tableObj.acc_num += k.acc_num;
                    tableObj.acc_time += k.acc_time;
                    tableObj.bounce_rate += k.bounce_rate;
                }
            }
            tableData.push(tableObj);
        }
        data.tableData = tableData;
        data.data = newdata;
        return data;
    },
    access_wap(data, name) {
        var newdata = [],
            tableData = [],
            source = data.data,
            dates = _.uniq(_.pluck(source, "date")),
            urls = _.uniq(_.pluck(source, "page_url"));
        for(var key of dates) {
            var obj = {
                date : key,
                pv : 0,
                uv : 0,
                ip_count : 0,
                entry_page_cut : 0,
                exit_page_cut : 0,
                exit_rate : 0
            };
            for(var k of source){
                if(key === k.date) {
                    obj.pv += k.pv;
                    obj.uv += k.uv;
                    obj.ip_count += k.ip_count;
                    obj.entry_page_cut += k.entry_page_cut;
                    obj.exit_page_cut += k.exit_page_cut;
                    obj.exit_rate += k.exit_rate;
                }
            }
            newdata.push(obj);
        }
        for(var i = 0; i < urls.length; i++) {
            var obj = {
                id : i + 1,
                page_url : url,
                pv : 0,
                uv : 0,
                follow_page_sum : 0,
                entry_page_cut : 0,
                exit_page_cut : 0,
                exit_rate : 0,
                stay_time_avg : 0
            };
            for(var key of source) {
                if(urls[i] === key.page_url) {
                    obj.pv += key.pv;
                    obj.uv += key.uv;
                    obj.follow_page_sum += key.follow_page_sum;
                    obj.entry_page_cut += key.entry_page_cut;
                    obj.exit_page_cut += key.exit_page_cut;
                    obj.exit_rate += key.exit_rate;
                    obj.stay_time_avg += key.stay_time_avg;
                }
            }
            tableData.push(obj);
        }
        data.data = newdata;
        data.tableData = tableData;
        return data;
    },
    inter(data) {
        var newdata = [],
            dates = _.uniq(_.pluck(data, "date"));
        for(var i = 0; i < dates.length; i++) {
            var obj = {
                id : i + 1,
                date : dates[i],
                acc_num : 0,
                acc_time : 0,
                bounce_rate : 0
            };
            for(var key of data) {
                if(dates[i] === key.date) {
                    obj.acc_num += key.acc_num;
                    obj.acc_time += key.acc_time;
                    obj.bounce_rate += key.bounce_rate;
                }
            }
            newdata.push(obj);
        }
        data = newdata;
        return data;
    },
    inter_wap(data) {
        var newdata = [],
            dates = _.uniq(_.pluck(data, "date"));
        for(var date of dates) {
            var obj = {
                date : date,
                page_url : "",
                pv : 0,
                uv : 0,
                follow_page_sum : 0,
                stay_time_avg : 0

            };
            for(var key of data) {
                if(date === key.date) {
                    obj.page_url = key.page_url;
                    obj.pv += key.pv;
                    obj.uv += key.uv;
                    obj.follow_page_sum += key.follow_page_sum;
                    obj.stay_time_avg += key.stay_time_avg;
                }
            }
            newdata.push(obj);
        }
        data = newdata;
        return data;
    }
};