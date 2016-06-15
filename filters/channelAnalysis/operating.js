/**
 * @author yanglei
 * @date 20160612
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    moment = require("moment");

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
            _orderSource = [],
            _channel_id = "",
            type = "line",
            map = {},
            newData = {};

        if(filter_key === "keep_rate") {
            if(orderSource[0]) {
                _channel_id = orderSource[0].channel_id;
                map[_channel_id] = orderSource[0].channel_name + "(%)";
            }
        } else {
            if(source[0]) {
                _channel_id = source[0].channel_id;
                map[_channel_id] = source[0].channel_name;
            }
        }

        for(var date of dates) {
            var obj = {};
            obj[_channel_id] = 0;
            newData[date] = obj;
        }

        for(var key of orderSource) {
            if(key.keep_type === "0") {
                _orderSource.push(key);
            }
        }

        orderSource = _orderSource;

        if(filter_key === "keep_rate") {
            for(key of orderSource) {
                date = util.getDate(key.date);
                newData[date][key.channel_id] += key.keep_rate;
            }
            for(key in newData) {
                newData[key][_channel_id] = (newData[key][_channel_id] * 100).toFixed(0);
            }
        } else {
            for(key of source) {
                date = util.getDate(key.date);
                newData[date][key.channel_id] += key[filter_key];
            }
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
    channelThree(data, dates) {
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.rate = util.toFixed(key.consume_users_num, key.active_users_num);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};