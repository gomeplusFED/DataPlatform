/**
 * @author yanglei
 * @date 20160608
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    channelOne(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            thirdSource = data.thirdData,
            _orderSource = [],
            _top = 0,
            _newArray = [],
            obj = {},
            _array = [],
            type = "line",
            map = {},
            newData = {};
        for(var key of thirdSource) {
            obj[key.channel_id] = [];
        }

        for(key of orderSource) {
            if(key.keep_type === "0") {
                _orderSource.push(key);
            }
        }

        orderSource = _orderSource;

        for(var date of dates) {
            var _obj = {};
            for(key of thirdSource) {
                _obj[key.channel_id] = 0;
            }
            newData[date] = _obj;
        }

        if(filter_key === "keep_rate") {
            _newArray = sort(orderSource);
            _top = _newArray.length > 10 ? 10 : _newArray.length;
            newData = returnData(_newArray, _top, map);
        } else {
            _newArray = sort(source);
            _top = _newArray.length > 10 ? 10 : _newArray.length;
            newData = returnData(_newArray, _top, map);
        }

        function sort(array) {
            for(key of array) {
                obj[key.channel_id].push(key);
            }
            for(key in obj) {
                if(obj[key].length > 0) {
                    _array.push(obj[key]);
                }
            }
            return _array.sort((a, b) => {
                var total_a = 0,
                    total_b = 0;
                for(key of a) {
                    total_a += key[filter_key];
                }
                for(key of b) {
                    total_b += key[filter_key];
                }
                return total_b - total_a;
            });
        }

        function returnData(array, top, map) {
            var a = [];
            for(var i = 0; i < top; i++) {
                for(var key of array[i]) {
                    a.push(key);
                    if(filter_key === "keep_rate") {
                        map[key.channel_id] = key.channel_name + "(%)";
                    } else {
                        map[key.channel_id] = key.channel_name;
                    }
                }
            }
            for(key of a) {
                var date = util.getDate(key.date);
                if(filter_key === "keep_rate") {
                    newData[date][key.channel_id] = (key[filter_key] * 100).toFixed(0);
                } else {
                    newData[date][key.channel_id] = key[filter_key];
                }
            }
            return newData;
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }];
    },
    channelTwo(data) {
        var source = data.data,
            orderSource = data.orderData,
            count = data.dataCount,
            channel = {};

        for(var key of orderSource) {
            channel[key.channel_id] = key.channel_name;
        }

        for(key of source) {
            key.operating =
                `<button class='btn btn-default' url_link='/channelAnalysis/operating' url_fixed_params='{"channel_id": "${key.channel_id}"}'>详细>></button>`;
            key.rate = util.toFixed(key.consume_users_num, key.active_users_num);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};