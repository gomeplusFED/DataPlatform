/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    accessPageOne(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            filter_name = {
                acc_num : "访问次数",
                acc_time : "平均停留时间",
                bounce_rate : "跳出率"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            var obj = {
                value : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj.value += key[filter_key];
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
    accessPageTwo(data) {
        var source = data.data,
            newData = [],
            total_num = 0,
            total_time = 0,
            urls = util.uniq(_.pluck(source, "url"));
        for(var i = 0; i < urls.length; i++) {
            var obj = {
                id : i + 1,
                url : urls[i],
                url_comment : "",
                acc_num : 0,
                acc_num_rate : "",
                acc_time : 0,
                acc_time_rate : "",
                bounce_rate : 0,
                operating : "<button class='btn btn-default' url_detail='/useAnalysis/page'>详情>></button>"
            };
            for(var key of source) {
                if(urls[i] === key.url) {
                    total_num += key.acc_num;
                    total_time += key.acc_time;
                    obj.url_comment = key.url_comment;
                    obj.acc_num += key.acc_num;
                    obj.acc_time += key.acc_time;
                    obj.bounce_rate += key.bounce_rate;
                }
            }
            newData.push(obj);
        }
        for(var key of newData) {
            key.acc_num_rate = util.toFixed(key.acc_num, total_num);
            key.acc_time_rate = util.toFixed(key.acc_time, total_time);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    page(data) {
        var source = data.data;
        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols);
    }
};