/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动流量
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    activityFlowOne(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            filter_name = {
                visitor_cut : "访问用户数",
                pv : "访问次数",
                stay_time_avg : "平均停留时长(s)",
                jump_loss_rate : "页面跳失率(%)"
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
            newData[util.getDate(key.date)].value += key[filter_key];
        }
        if(filter_key === "stay_time_avg") {
            Object.keys(newData).forEach((key) => {
                newData[key].value = Math.round(newData[key].value);
            });
        }
        if(filter_key === "jump_loss_rate") {
            Object.keys(newData).forEach((key) => {
                newData[key].value = newData[key].value.toFixed(2);
            });
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {  // 配置信息
                stack: false  // 图的堆叠
            }
        }]
    },
    activityFlowTwo(data, page) {
        var source = data.data,
            count = data.dataCount,
            page = page || 1,
            newData = [];
        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.id = (page - 1) * 10 + i + 1;
            key.stay_time_avg = Math.round(key.stay_time_avg);
            key.jump_loss_rate = key.jump_loss_rate.toFixed(2) + "%";
            key.h5_conversion_rate = key.h5_conversion_rate.toFixed(2) + "%";
            key.operating =
                "<button class='btn btn-default' url_detail='/marketingAnalysis/activityFlowThree'>详情>></button>";
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    activityFlowThree(data) {
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};