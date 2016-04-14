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
                stay_time_avg : "平均停留时长",
                jump_loss_rate : "页面跳失率"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            var obj = {
                value : 0
            };
            for(var key of source){
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
            config: {  // 配置信息
                stack: false  // 图的堆叠
            }
        }]
    },
    activityFlowTwo(data) {
        var source = data.data;
        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].operating =
                "<button class='btn btn-default' url_detail='/marketingAnalysis/activityFlowThree'>详情>></button>";
        }
        return util.toTable([source], data.rows, data.cols);
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