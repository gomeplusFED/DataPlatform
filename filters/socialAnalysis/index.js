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
                group_num : 0,
                group_persons_num : 0,
                three : 0,
                all_topic_num : 0,
                del_group_num : 0
            };
        for(var key of source){
            newData[key.key] += key.value;
        }
        return util.toTable([[newData]], data.rows, data.cols);
    },
    groupSeven(data){
        var source = data.first.data[0],
            newData = [],
            obj = {},
            array = ["APP", "WAP", "PC", "总计"];

        for(let key of array) {
            obj[key] = {
                two : 0,
                three : 0,
                four : 0,
                five : 0,
                six  : 0,
                seven:0,
                eight:0,
                new_register_group_user_num : 0
            };
        }

        for(let key of source) {
            if(obj[key.type]) {
                obj[key.type].two += key.new_group_num;
                obj[key.type].three += key.new_join_group_num;
                obj[key.type].four += key.new_quit_group_num;
                obj[key.type].five += key.first_group_user_num;
                obj[key.type].six += key.new_group_user_num;
                obj[key.type].eight += key.new_group_disband_num;
                obj[key.type].new_register_group_user_num += key.new_register_group_user_num;
            }
            obj["总计"].two += key.new_group_num;
            obj["总计"].three += key.new_join_group_num;
            obj["总计"].four += key.new_quit_group_num;
            obj["总计"].five += key.first_group_user_num;
            obj["总计"].six += key.new_group_user_num;
            obj["总计"].eight += key.new_group_disband_num;
            obj["总计"].new_register_group_user_num += key.new_register_group_user_num;
        }
        for(let key in obj) {
            newData.push({
                one : key,
                two : obj[key].two,
                three : obj[key].three,
                four : obj[key].four,
                five : obj[key].five,
                six : obj[key].six,
                seven : util.toFixed(obj[key].five, obj[key].new_register_group_user_num),
                eight : obj[key].eight
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    groupEight(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},
            filter_name = {
                new_group_num : "新增圈子数",
                new_join_group_num : "新增加圈次数",
                new_quit_group_num : "新增退圈次数",
                new_group_user_num : "新增入圈用户数",
                first_group_user_num: "首次入圈用户数",
                dau: "DAU"
            },
            map = {
                value : filter_name[query.filter_key]
            };

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source){
            var date = util.getDate(key.date);
            newData[date].value += key[query.filter_key];
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
    groupNine(data, query , dates) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            filter_name = {
                one : {
                    "name" : "圈子数",
                    "column": "new_group_num"
                },
                two : {
                    "name" : "DAU",
                    "column": "dau"
                },
                three : {
                    "name" : "话题数",
                    "column": "new_group_topic_num"
                },
            },
            map = {
                value : filter_name[query.filter_key].name
            };

        var obj = {},    
            newData = {},
            filterColumn = filter_name[query.filter_key].column; //要查询的字段

        // id 为键，名称为值 , 保存所有一级类目的名字和对应的id
        for(let category of orderData){
            obj[category.id] = category.name;
            //初始化各项的值
            newData[category.name] = {
                value : 0
            }
        }
        for(let item of source){
            //品种名称
            var names = obj[item.category_id];
            newData[names].value += item[filterColumn]; 
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    groupTen(data, query) {
        var group_type = query.category_id,
            source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie";

        var filter_name = {
                one : {
                    "name" : "圈子数",
                    "column": "new_group_num"
                },
                two : {
                    "name" : "DAU",
                    "column": "dau"
                },
                three : {
                    "name" : "话题数",
                    "column": "new_group_topic_num"
                },
            },
            filterName = filter_name[query.filter_key2].name,
            filterColumn = filter_name[query.filter_key2].column,
            map = {
                value : filterName
            };
        var obj = {},
            newData = {};
        var showData = [];

        for(let cid of group_type){
            for(let item of orderData){
                if(item.id == cid){
                    obj[cid] = item.name;
                    newData[item.name] = {
                        value : 0
                    }
                }
            }
        }

        for(let item of source){
            if(item.category_id in obj){
                newData[obj[item.category_id]].value += item[filterColumn];
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
    groupEleven(data , query){
        var page = query.page || 1;
        var source = data.first.data[0],
            count = data.first.count > 100 ? 100 : data.first.count,
            newData = [],
            config = {
                "0" : "不是",
                "1" : "是"
            },
            ThirdData = data.third.data;

        for(let key of ThirdData) {
            let obj = {};
            obj[key.key] = key.sum_value;
            config[key.group_id] = obj;
        }
        //分类名称
        var obj = {};
        for(let item of data.second.data){
            obj[item.id] = item.name;
        }

        var i = 1;
        for(let item of source){
            item.top = (page - 1) * 20 + i;
            item.group_person_num = config[item.group_id].group_person_num || 0;
            item.group_topic_num = config[item.group_id].group_topic_num || 0;
            item.topic_subreply_num = config[item.group_id].topic_subreply_num || 0;
            item.topic_praise_num = config[item.group_id].topic_praise_num || 0;
            item.topic_collect_num = config[item.group_id].topic_collect_num || 0;
            item.topic_reply_num = config[item.group_id].topic_reply_num || 0;
            item.reply_num = key.topic_reply_num + key.topic_subreply_num;
            item.category_id_1 = obj[item.category_id_1];
            item.category_id_2 = obj[item.category_id_2];
            item.creater_flag = config[item.creater_flag];
            item.operating = `<button class="btn btn-default" url_link='/socialAnalysis/groupDetail' url_fixed_params='{"group_id":"${item.group_id}"}'>详情</button>`;
            newData.push(item);
            i++;
        }

        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};