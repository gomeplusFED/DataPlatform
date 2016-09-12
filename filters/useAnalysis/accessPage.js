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
        var source = data.first.data[0],
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
    accessPageTwo(data, page) {
        var source = data.first.data[0],
            count = data.first.count,
            sum = data.first.sum,
            page = page || 1,
            newData = [];

        for(var key of sum) {
            sum[key] = sum[key] || 0;
        }
        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.id = (page - 1) * 20 + i + 1;
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.acc_time = Math.round(key.acc_time);
            key.bounce_rate = key.bounce_rate.toFixed(2) + "%";
            key.acc_num_rate = util.toFixed(key.acc_num, sum[0]);
            key.acc_time_rate = util.toFixed(key.acc_time, sum[1]);
            key.operating = "<button class='btn btn-default' url_detail='/useAnalysis/page'>详情>></button>";
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    page(data, page) {
        var source = data.first.data[0],
            count = data.first.count,
            page = page || 1;
        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 10 + i + 1;
            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};