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
        }]
    },
    channelTwo(data) {
        var source = data.data,
            orderSource = data.orderData,
            obj = {},
            channel = {},
            newData = [];

        for(var key of orderSource) {
            obj[key.channel_id] = [];
            channel[key.channel_id] = key.channel_name;
        }

        for(key of source) {
            obj[key.channel_id].push(key);
        }

        for(key in obj) {
            var _obj = {
                channel_id : key,
                new_users_num : 0,
                new_account_num : 0,
                active_users_num : 0,
                start_count : 0,
                consume_users_num : 0,
                operating : `
                    <button class='btn btn-default'
                    url_link='/channelAnalysis/operating'
                    url_fixed_params='{"channel_id": "${key}"}'>详细>></button>
                `
            };
            for(var k of obj[key]) {
                _obj.new_users_num += k.new_users_num;
                _obj.new_account_num += k.new_account_num;
                _obj.active_users_num += k.active_users_num;
                _obj.start_count += k.start_count;
                _obj.consume_users_num += k.consume_users_num;
            }
            _obj.channel_name = channel[key];
            _obj.rate = util.toFixed(_obj.consume_users_num, _obj.active_users_num);
            newData.push(_obj);
        }

        return util.toTable([newData], data.rows, data.cols, [newData.length]);
    }
};