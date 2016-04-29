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
                acc_time : "平均停留时间(s)",
                bounce_rate : "跳出率(%)"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            if(key.type !== "H5") {
                newData[util.getDate(key.date)].value += key[filter_key];
            }
        }
        if(filter_key === "bounce_rate") {
            Object.keys(newData).forEach((key) => {
                newData[key].value = newData[key].value.toFixed(2);
            });
        }
        if(filter_key === "acc_time") {
            Object.keys(newData).forEach((key) => {
                newData[key].value = Math.round(newData[key].value);
            });
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
            obj = {},
            urls = util.uniq(_.pluck(source, "url"));
        for(var url of urls) {
            obj[url] = {
                url : urls,
                url_comment : "",
                acc_num : 0,
                acc_num_rate : "",
                acc_time : 0,
                acc_time_rate : "",
                bounce_rate : 0
            };
        }
        for(var key of source) {
            if(key.type !== "H5") {
                total_num += key.acc_num;
                total_time += key.acc_time;
                obj[key.url].acc_num += key.acc_num;
                obj[key.url].acc_time += key.acc_time;
                obj[key.url].bounce_rate += key.bounce_rate;
                obj[key.url].url_comment = key.url_comment;
            }
        }
        for(var i = 0; i < urls.length; i++) {
            newData.push({
                id : i + 1,
                url : urls[i],
                url_comment : obj[urls[i]].url_comment,
                acc_num : obj[urls[i]].acc_num,
                acc_time : Math.round(obj[urls[i]].acc_time),
                bounce_rate : obj[urls[i]].bounce_rate.toFixed(2) + "%",
                acc_num_rate : util.toFixed(obj[urls[i]].acc_num, total_num),
                acc_time_rate : util.toFixed(obj[urls[i]].acc_time, total_time),
                operating : "<button class='btn btn-default' url_detail='/useAnalysis/page'>详情>></button>"
            });
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