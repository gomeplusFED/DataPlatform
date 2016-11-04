/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面-wap
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    accessWapOne(data, filter_key, dates) {
        var source = data.first.data[0],
            type = "line",
            filter_name = {
                sum_page_view : "浏览量",
                sum_access_num : "访客数",
                sum_ip_num : "ip数"
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
        source.forEach((key) => {
            newData[util.getDate(key.date)].value += key[filter_key];
        });
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    },
    accessWapTwo(data, page) {
        var source = data.first.data[0],
            count = data.first.count,
            page = page || 1,
            newData = [];
        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.id = (page - 1) * 20 + i + 1;
            key.operating = "<button class='btn btn-default' url_detail='/useAnalysis/wap'>详情>></button>";
            key.avg_stay_time = Math.round(key.avg_stay_time);
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    wap(data, dates) {
        var source = data.first.data[0],
            count = data.first.count;
        for(var i = 0; i < source.length; i++) {
            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
            source[i].avg_stay_time = Math.round(source[i].avg_stay_time);
        }

        return util.toTable([source], data.rows, data.cols, [count]).concat([{}]);
    }
};