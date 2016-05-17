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
        var source = data.data,
            type = "line",
            filter_name = {
                page_view : "浏览量",
                access_num : "访客数",
                ip_num : "ip数"
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
    accessWapTwo(data) {
        var source = data.data,
            urls = util.uniq(_.pluck(source, "url")),
            newData = [];
        for(var i = 0; i < urls.length; i++) {
            var obj = {
                id : i + 1,
                url : urls[i],
                page_view : 0,
                access_num : 0,
                down_browse : 0,
                avg_stay_time : 0,
                operating : "<button class='btn btn-default' url_detail='/useAnalysis/wap'>详情>></button>"
            };
            for(var key of source) {
                if(urls[i] === key.url) {
                    obj.page_view += key.page_view;
                    obj.access_num += key.access_num;
                    obj.down_browse += key.down_browse;
                    obj.avg_stay_time += Math.round(key.avg_stay_time);
                }
            }
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    wap(data) {
        var source = data.data;
        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols);
    }
};