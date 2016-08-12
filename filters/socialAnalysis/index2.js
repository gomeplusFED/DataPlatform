/**
 * @author Xisen He
 * @date 20160512
 * @fileoverview 圈子数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    
    groupDetailOne(data){
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
    groupDetailTwo(data){
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
                nine : 0,
                ten : 0
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
     groupDetailThree(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},

            filter_name = {
                one : "新增成员数",
                two : "新增分享数",
                three : "新增话题数",
                four : "删除话题数",
                five: "新增回复数",
                six: "删除回复数",
                seven:"新增点赞数",
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
    },
     groupDetailFour(data, query) {
        var page = query.page || 1;
        var source = data.first.data[0],
            count = data.first.count > 100 ? 100 : data.first.count,
            newData = [{
                "1" : 11,
                "2" : 11,
                "3" : 11,
                "4" : 11,
                "5" : 11,
                "6" : 11,
                "7" : 11,
                "8" : 11
            }];

        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 20 + i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};