/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 圈子数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    groupOne(data) {
        var source = data.data,
            newData = {
                new_group_count : 0,
                new_group_user_count : 0,
                accumulated_group_all_count : 0,
                accumulated_group_user_all_count : 0,
                user_join_group_rate : 0,
                new_register_user_count : 0,
                register_user_all_count : 0
            };
        for(var key of source) {
            newData.new_group_count += key.new_group_count;
            newData.new_group_user_count += key.new_group_user_count;
            newData.new_register_user_count += key.new_register_user_count;
            newData.accumulated_group_all_count += key.accumulated_group_all_count;
            newData.accumulated_group_user_all_count += key.accumulated_group_user_all_count;
            newData.register_user_all_count += key.register_user_all_count;
        }
        newData.new_group_user_rate = util.toFixed(newData.new_group_user_count,
            newData.new_register_user_count);
        newData.user_join_group_rate = util.toFixed(newData.accumulated_group_user_all_count,
            newData.register_user_all_count);
        return util.toTable([[newData]], data.rows, data.cols);
    },
    groupTwo(data, dates) {
        var source = data.data,
            type = "line",
            newData = {},
            map = {
                new_group_count : "新增圈子数",
                new_group_user_count : "新增入圈户数",
                new_group_topic_count : "新增话题数",
                DAU : "DAU"
            };
        for(var date of dates) {
            newData[date] = {
                new_group_count : 0,
                new_group_user_count : 0,
                new_group_topic_count : 0,
                DAU : 0
            };
        }
        for(var key of source) {
            var date = util.getDate(key.date);
            newData[date].new_group_count += key.new_group_count;
            newData[date].new_group_user_count += key.new_group_user_count;
            newData[date].new_group_topic_count += key.new_group_topic_count;
            newData[date].DAU += key.DAU;
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },
    groupThree(data, filter_key) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                accumulated_group_all_count : "圈子数",
                DAU : "DAU"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var key of orderData) {
            obj[key.id] = {
                value : 0
            }
        }
        for(var key of source) {
            obj[key.group_type].value += key[filter_key];
        }
        for(var key of orderData) {
            newData[key.name] = obj[key.id].value;
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    groupFour(data, filter_key, filter_key2) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                accumulated_group_all_count : "圈子数",
                DAU : "DAU"
            },
            filter_key = filter_key || "-1",
            map = {
                value : filter_name[filter_key2]
            },
            newData = {};
        for(var key of orderData) {
            if(key.pid === filter_key) {
                obj[key.id] = {
                    value : 0
                }
            }
        }
        for(var key of source) {
            obj[key.group_type].value += key[filter_key2];
        }
        for(var key of orderData) {
            if(key.pid === filter_key) {
                newData[key.name] = obj[key.id].value;
            }
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    groupFive(data) {
        var source = data.data,
            newData = [],
            top = source.length > 100 ? 100 : source.length;
        for(var key of source) {
            key.rate = (key.DAU /
                (key.accumulated_group_user_all_count === 0 ? 1 : key.accumulated_group_user_all_count) * 100)
                .toFixed(2);
        }
        source.sort((a, b) => {
            return b.rate - a.rate;
        });
        for(var i = 0; i < top; i++) {
            source[i].id = i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};