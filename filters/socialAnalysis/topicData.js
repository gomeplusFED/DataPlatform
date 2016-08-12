/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
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
                "seven" : 121,
                "eight" : `<button class="btn btn-default" target='_blank' url_link='/socialAnalysis/topicsDetail' url_fixed_params='{"channel":${23}}'>查看</button>`   
            }];

        for(var i = 0; i < source.length; i++) {
           source[i].id = (page - 1) * 20 + i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    },

    /* ==============  详情部分  =========== */
    topicDetailOne(data){
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
    topicDetailTwo(data){
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
     topicDetailThree(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},

            filter_name = {
                one : "新增成员数",
                two : "新增回复数",
                three : "新增回复人数",
                four : "删除回复数",
                five: "新增点赞数",
                six: "新增收藏数",
                seven:"新增分享数",
                eight:"新增收藏数"
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
    }
};