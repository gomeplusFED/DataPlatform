/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    topicsOne(data) {
        var source = data.data,
            newData = {
                new_topic_count : 0,
                new_reply_count : 0,
                new_reply_rate : 0,
                reply_rate : 0,
                ttl_topics : 0
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
    topicsTwo(data,filter_key) {
        var source = data.data,
            type = "line",
            array = [{
                key : "新增话题数",
                value: "1"
            }, {
                key : "话题回复率",
                value: "2"
            }, {
                key : "话题点击率",
                value: "3"
            }],
            newData = {},
            map = {};
        map[filter_key + "_0"] = array[0].key;
        map[filter_key + "_1"] = array[1].key;
        map[filter_key + "_2"] = array[2].key;
        for(var date of dates) {
            var obj = {};
            obj[filter_key + "_0"] = 0;
            obj[filter_key + "_1"] = 0;
            obj[filter_key + "_2"] = 0;
            for(var key of source) {
                newData[util.getDate(key.date)].value += key[filter_key];
            }
            newData[date] = obj;
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
        for(var key in config) {
            obj[key] = {
                value : 0
            }
        }
        for(var key of source) {
            obj[key.group_type].value += key[filter_key];
        }
        for(var key in obj) {
            newData[config[key].name] = obj[key].value;
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
            newData = {},
            cell = config[filter_key].cell;
        for(var key in cell) {
            obj[key] = {
                value : 0
            }
        }
        for(var key of source) {
            obj[key.group_type].value += key[filter_key2];
        }
        for(var key in cell) {
            newData[cell[key]] = obj[key].value;
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

    topicsFive(data) {
        var source = data.data,
            newData = [],
            top = source.length > 100 ? 100 : source.length;
        for(var key of source) {
            key.user_reply_rate = (key.replay_user_num / key.click_user_num * 100).toFixed(2);
            key.avg_reply = (key.replay_num / key.replay_user_num).toFixed(2);
        }
        source.sort((a, b) => {
            return b.click_num - a.click_num;
        });
        for(var i = 0; i < top; i++) {
            source[i].id = i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};