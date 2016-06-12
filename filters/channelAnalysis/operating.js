/**
 * @author yanglei
 * @date 20160612
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    channelOne(data) {
        var source = data.data,
            orderSource = data.orderData,
            oneObj = {
                "0" : 0,
                "1" : 0,
                "2" : 0
            },
            twoObj = {
                "0" : 0,
                "1" : 0,
                "2" : 0
            };
        for(var key of source) {
            oneObj[key.active_type] += key.active_num;
        }
        for(key of orderSource) {
            twoObj[key.keep_type] += key.keep_rate;
        }
        for(key in twoObj) {
            twoObj[key] = (twoObj[key] * 100).toFixed(2) + "%";
        }

        return util.toTable([[oneObj], [twoObj]], data.rows, data.cols);
    },
    channelTwo(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            type = "line",
            map = {},
            newData = {};

        for(var date of dates) {
            var _obj = {};
            if(filter_key === "keep_rate") {
                if(orderSource[0]) {
                    _obj[orderSource[0].channel_id] = 0;
                }
            } else {
                if(source[0]) {
                    _obj[source[0].channel_id] = 0;
                }
            }
            newData[date] = _obj;
        }

        if(filter_key === "keep_rate") {
        } else {
        }


        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    }
};