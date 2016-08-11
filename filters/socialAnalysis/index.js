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
            length = source.length,
            newData = {
                new_group_count : 0,
                new_group_user_count : 0,
                accumulated_group_all_count : 0,
                accumulated_group_user_all_count : 0,
                user_join_group_rate : 0,
                new_register_user_count : 0,
                register_user_all_count : 0,
                new_group_user_rate: 0
            };

        source.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        for(var key of source) {
            newData.new_group_count += key.new_group_count;
            newData.new_group_user_count += key.new_group_user_count;
            newData.new_register_user_count += key.new_register_user_count;
            newData.accumulated_group_all_count += key.accumulated_group_all_count;
            newData.accumulated_group_user_all_count += key.accumulated_group_user_all_count;
            newData.register_user_all_count += key.register_user_all_count;
        }

        if(source[length - 1]) {
            var key = source[length - 1];
            newData.accumulated_group_all_count = key.accumulated_group_all_count;
            newData.accumulated_group_user_all_count = key.accumulated_group_user_all_count;
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
                new_group_user_count : "新增入圈用户数",
                //new_group_topic_count : "新增话题数",
                DAU : "DAU"
            };
        for(var date of dates) {
            newData[date] = {
                //new_group_count : 0,
                new_group_count : 0,
                new_group_user_count : 0,
                DAU : 0
            };
        }
        for(var key of source) {
            var date = util.getDate(key.date);
            //newData[date].new_group_count += key.new_group_count;
            newData[date].new_group_count += key.new_group_count;
            newData[date].new_group_user_count += key.new_group_user_count;
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
                group_count : "圈子数",
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
    groupFour(data, filter_key, filter_key2) {
        var source = data.data,
            orderData = data.orderData,
            total = 0,
            type = "pie",
            obj = {},
            filter_name = {
                group_count : "圈子数",
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
    groupFive(data, page) {
        var source = data.data,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            orderData = data.orderData,
            page = page || 1,
            newData = [],
            type = {};
        for(var key of orderData) {
            type[key.id] = key.name;
        }
        for(var i = 0; i < source.length; i++) {
            key = source[i];
            key.id = (page - 1) * 20 + i +1;
            key.group_type = type[key.group_type];
            key.rate = util.toFixed(key.DAU, key.accumulated_group_user_all_count);
            newData.push(key);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },
    groupSix(data){
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
    groupSeven(data){
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
                eight:0
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
     groupEight(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},
            filter_name = {
                one : "新增圈子数",
                two : "新增加圈次数",
                three : "新增退圈次数",
                four : "新增入圈用户数",
                five: "首次入圈用户数",
                six: "DAU"
            },
            map = {
                value : filter_name[query.filter_key]
            };

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            var date = util.getDate(key.date);
            newData[date].value = key.query.filter_key;
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
     groupNine(data, filter_key) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                one : "圈子数",
                two : "DAU",
                three : "话题数"
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
     groupTen(data, filter_key) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                one : "圈子数",
                two : "DAU",
                three : "话题数"
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
    }
};