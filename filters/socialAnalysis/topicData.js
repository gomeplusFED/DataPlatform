/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    config = require("../../utils/config.json").socialCategory,
    _ = require("lodash");

module.exports = {
    topicsOne(data) {
        var source = data.data,
            newData = {
                new_topic_count : 0,
                new_reply_count : 0,
                new_reply_rate : 0,
                reply_rate : 0,
                new_reply_new_topic_count : 0,
                reply_topic_all_count : 0,
                topic_all_count : 0,
                accumulated_topic_all_count : 0
            };
        
        for(var key of source) {
            newData.new_topic_count += key.new_topic_count;
            newData.new_reply_count += key.new_reply_count;
            newData.new_reply_new_topic_count += key.new_reply_new_topic_count;
            newData.reply_topic_all_count += key.reply_topic_all_count;
            newData.topic_all_count += key.topic_all_count;
            newData.accumulated_topic_all_count += key.accumulated_topic_all_count;
        }
        newData.new_reply_rate = util.toFixed(newData.new_reply_new_topic_count,
            newData.new_topic_count);
        newData.reply_rate = util.toFixed(newData.reply_topic_all_count,
            newData.topic_all_count);
        return util.toTable([[newData]], data.rows, data.cols);
    },
    topicsTwo(data, dates) {
        var source = data.data,
            type = "line",
            newData = {},
            map = {
                new_topic_count: "新增话题数",
                topic_reply_rate: "话题回复率",
                topic_click_rate: "话题点击率"
            };
        for (var date of dates) {
            newData[date] = {
                new_topic_count: 0,
                topic_reply_rate: 0,
                topic_click_rate: 0
            };
        }

        for (var key of source) {
            var date = util.getDate(key.date);
            newData[date].new_topic_count += key.new_topic_count;
            newData[date].reply_topic_all_count += key.reply_topic_all_count;
            newData[date].topic_all_count += key.topic_all_count;
            newData[date].topic_clicked_count += key.topic_clicked_count;
            newData[date].topic_viewed_count += key.topic_viewed_count;
        }

        for (var key in newData) {
            newData[key].topic_reply_rate = util.toFixed(newData[key].reply_topic_all_count,
                newData[key].topic_all_count);
            newData[key].topic_click_rate = util.toFixed(newData[key].topic_clicked_count,
                newData[key].topic_viewed_count);
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

    topicsThree(data, filter_key) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                topic_num : "话题",
                replay_num : "回复"
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
            newData[key.name] = {
                value : obj[key.id].value
            };
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

    topicsFour(data, filter_key, filter_key2) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                topic_num : "话题",
                replay_num : "回复"
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
                newData[key.name] = {
                    value : obj[key.id].value
                };
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
    topicsFive(data, page) {
        var source = data.data,
            count = data.dataCount,
            page = page || 1,
            newData = [];
        for(var i = 0; i < source.lenght; i++) {
            var key = source[i];
            key.id = (page - 1) * 10 + i + 1;
            key.user_reply_rate = util.division(key.replay_user_num, key.click_user_num);
            key.avg_reply = util.division(key.replay_num, key.replay_user_num);
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};