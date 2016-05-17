/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    config = require("../../utils/config.json").socialCategory,
    _ = require("lodash");

module.exports = {
    hostOne(data) {
        var source = data.data,
            newData = {
                new_owner_num : 0,
                new_owner_rate : 0,
                avg_fan : 0,
                accum_owner_num : 0,
                total_new_owner_num : 0,
                fans_num : 0
            };
        for(var key of source) {
            newData.new_owner_num += key.new_owner_num;
            newData.accum_owner_num += key.accum_owner_num;
            newData.total_new_owner_num += key.total_new_owner_num;
            newData.fans_num += key.fans_num;
        }
        newData.new_owner_rate = util.toFixed(newData.new_owner_num,
            newData.total_new_owner_num);
        newData.avg_fan = util.toFixed(newData.fans_num,
            newData.accum_owner_num);
        return util.toTable([[newData]], data.rows, data.cols);
    },
    hostTwo(data, dates) {
        var source = data.data,
            type = "line",
            newData = {},
            map = {
                new_owner_num : "新增圈主数",
                new_owner_rate : "新圈主占比",
                avg_fan : "人均粉丝数"
            };
        for(var date of dates) {
            newData[date] = {
                new_owner_num : 0,
                new_owner_rate : 0,
                avg_fan : 0
            };
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            newData[date].new_owner_num += key.new_owner_num;
            newData[date].total_new_owner_num += key.total_new_owner_num;
            newData[date].fans_num += key.fans_num;
            newData[date].accum_owner_num += key.accum_owner_num;
        }

        for(var key in newData) {
            newData[key].new_owner_rate = util.toFixed(newData[key].new_owner_num,
                newData[key].total_new_owner_num);
            newData[key].avg_fan = util.toFixed(newData[key].fans_num,
                newData[key].accum_owner_num);
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
    hostThree(data, filter_key) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                new_owner_num : "圈主",
                fans_num : "粉丝数"
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
    hostFour(data, filter_key, filter_key2) {
        var source = data.data,
            orderData = data.orderData,
            type = "pie",
            obj = {},
            filter_name = {
                new_owner_num : "圈主",
                fans_num : "粉丝数"
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
    hostFive(data,date) {
        var source = data.data,
            newData = [],
            top = source.length > 100 ? 100 : source.length;

        source.sort((a, b) => {
            return b.new_fans_num - a.new_fans_num;
        });
        for(var i = 0; i < top; i++) {
            source[i].id = i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};