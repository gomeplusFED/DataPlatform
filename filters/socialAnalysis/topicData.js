/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    /*topicsOne(data) {
        var source = data.data,
            length = source.length,
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

        source.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        
        for(var key of source) {
            newData.new_topic_count += key.new_topic_count;
            newData.new_reply_count += key.new_reply_count;
            newData.new_reply_new_topic_count += key.new_reply_new_topic_count;
            newData.reply_topic_all_count += key.reply_topic_all_count;
            newData.topic_all_count += key.topic_all_count;
            newData.accumulated_topic_all_count += key.accumulated_topic_all_count;
        }

        if(source[length - 1]) {
            newData.accumulated_topic_all_count = source[length - 1].accumulated_topic_all_count
        }

        newData.new_reply_rate = util.toFixed(newData.new_reply_new_topic_count,
            newData.new_topic_count);
        newData.reply_rate = util.toFixed(newData.reply_topic_all_count,
            newData.topic_all_count);
        return util.toTable([[newData]], data.rows, data.cols);
    },*/
    topicsOne(data){
        var source = data.first.data[0],
            newData = {
                one : 0,
                two : 0,
                three : 0,
                four : 0,
                five : 0
            };

        return util.toTable([[newData]], data.rows, data.cols);
    },
    /*topicsTwo(data, dates) {
        var source = data.data,
            type = "line",
            newData = {},
            map = {
                new_topic_count: "新增话题数",
                topic_reply_rate: "话题回复率(%)",
                topic_click_rate: "话题点击率(%)"
            };
        for (var date of dates) {
            newData[date] = {
                new_topic_count: 0,
                reply_topic_all_count : 0,
                topic_all_count : 0,
                topic_clicked_count : 0,
                topic_viewed_count : 0
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
            newData[key].topic_reply_rate = util.toRound(newData[key].reply_topic_all_count,
                newData[key].topic_all_count);
            newData[key].topic_click_rate = util.toRound(newData[key].topic_clicked_count,
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
    },*/
    topicsTwo(data){
        var source = data.first.data[0],
            newData = [],
            array = ["APP", "WAP", "PC", "总计"];

        for(let key of array) {
            newData.push({
                one : key,
                two : 0,
                three : 0,
                four : 0,
                five : 0,
                six : 0,
                seven:0,
                eight:0,
                nine:0,
                ten:0
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    topicsThree(data, query, dates) {
        var filter_key = query.filter_key;
        var source = data.first.data[0],
            type = "line",
            // obj = {},
            filter_name = {
                "one" : "新增话题数",
                "two" : "删除话题数",
                "three" : "新增回复数",
                "four" : "删除回复数",
                "five" : "新增点赞数",
                "six" : "新增收藏数",
                "seven" : "新增分享数"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
       
        for(let date of dates){
            newData[date] = {
                value : 0
            };
        }

        // for(var key of source) {
        //     obj[key.group_type].value += key[filter_key];
        // }
        // for(var key of orderData) {
        //     newData[key.name] = {
        //         value : obj[key.id].value
        //     };
        // }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    topicsFour(data, filter_key) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                one : "话题",
                two : "回复",
                three : "点赞",
                four: "收藏",
                five: "分享"
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
    topicsFive(data , query){

        var group_type = query.group_type,
            source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie";

        var obj = {},
            filter_name = {
                one : "话题",
                two : "回复",
                three : "点赞",
                four : "收藏",
                five : "分享"
            },
            map = {
                value : filter_name[query.filter_key2]
            },
            newData = {};
        var showData = [];
        for(var key of orderData) {
            for(var ss=0;ss<group_type.length;ss++){
                if(group_type[ss] == key.id){
                    showData.push(key);
                }
                obj[key.id] = {
                    value : 0
                }
            }
        }

        for(var key of source) {
            obj[key.group_type].value += key[query.filter_key];
        }
        for(var key of showData) {
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
    topicsSix(data, page) {
        var source = data.first.data,
            count = data.first.count[0].count > 100 ? 100 : data.first.count[0].count,
            page = page || 1,
            newData = [{
                "one" : 11,
                "two" : 11,
                "three" : 11,
                "four" : 11,
                "five" : 11,
                "six" : 11,
                "seven" : 11,
                "eight" : '<a target="_blank" href="http://www.baidu.com">查看</a>'    
            }];

        for(var i = 0; i < source.length; i++) {
           source[i].id = (page - 1) * 20 + i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};