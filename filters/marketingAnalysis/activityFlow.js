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
                jump_loss_rate : "页面跳失率"
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
    activityFlowTwo(data) {
        var source = data.data,
            urls = util.uniq(_.pluck(source, "page_url")),
            obj = {},
            newData = [];
        for(var url of urls) {
            obj[url] = {
                page_url : url,
                page_name : "",
                visitor_cut : 0,
                pv : 0,
                stay_time_avg : 0,
                jump_loss_rate : 0,
                h5_conversion_rate : 0,
                operating : ""
            };
        }
        for(var i = 0; i < source.length; i++) {
            obj[source[i].page_url].page_name = source[i].page_name;
            obj[source[i].page_url].visitor_cut += source[i].visitor_cut;
            obj[source[i].page_url].pv += source[i].pv;
            obj[source[i].page_url].stay_time_avg += source[i].stay_time_avg;
            obj[source[i].page_url].jump_loss_rate += source[i].jump_loss_rate;
            obj[source[i].page_url].h5_conversion_rate += source[i].h5_conversion_rate;
            obj[source[i].page_url].operating =
                "<button class='btn btn-default' url_detail='/marketingAnalysis/activityFlowThree'>详情>></button>";
        }
        for(var i = 0; i < urls.length; i++) {
            newData.push({
                id : i + 1,
                page_url : urls[i],
                page_name : obj[urls[i]].page_name,
                visitor_cut : obj[urls[i]].visitor_cut,
                pv : obj[urls[i]].pv,
                stay_time_avg : Math.round(obj[urls[i]].stay_time_avg),
                jump_loss_rate : obj[urls[i]].jump_loss_rate.toFixed(2) + "%",
                h5_conversion_rate : obj[urls[i]].h5_conversion_rate.toFixed(2) + "%",
                operating : obj[urls[i]].operating
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    activityFlowThree(data) {
        var source = data.data;
        source.sort((a, b) => {
            return b.date - a.date;
        });
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols);
    }
};