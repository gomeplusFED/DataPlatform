/**
 * @author yanglei
 * @date 20160612
 * @fileoverview 渠道分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    channelOne(data, filter_key, dates) {
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
            twoObj[key] = twoObj[key].toFixed(2) + "%";
        }

        return util.toTable([[oneObj], [twoObj]], data.rows, data.cols);
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
                operating :
                "<button class='btn btn-default' " +
                "url_link='/channelAnalysis/operating' " +
                'url_fixed_params=' + '{"channel_id":' + key + "}" +
                ">详细>></button>"
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