/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 圈主数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    hostOne(data) {
        var source = data.data,
            length = source.length,
            newData = {
                new_owner_num : 0,
                new_owner_rate : 0,
                avg_fan : 0,
                accum_owner_num : 0,
                total_new_owner_num : 0,
                fans_num : 0
            };

        source.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        for(var key of source) {
            newData.new_owner_num += key.new_owner_num;
            newData.accum_owner_num += key.accum_owner_num;
            newData.total_new_owner_num += key.total_new_owner_num;
            newData.fans_num += key.fans_num;
        }

        if(source[length - 1]) {
            newData.accum_owner_num = source[length - 1].accum_owner_num;
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
            obj = {},
            map = {
                new_owner_num : "新增圈主数",
                new_owner_rate : "新圈主占比(%)",
                avg_fan : "人均粉丝数"
            };
        for(var date of dates) {
            obj[date] = {
                new_owner_num : 0,
                total_new_owner_num : 0,
                fans_num : 0,
                accum_owner_num: 0
            };
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            obj[date].new_owner_num += key.new_owner_num;
            obj[date].total_new_owner_num += key.total_new_owner_num;
            obj[date].fans_num += key.fans_num;
            obj[date].accum_owner_num += key.accum_owner_num;
        }

        for(var date of dates) {
            newData[date] = {
                new_owner_num : obj[date].new_owner_num,
                new_owner_rate :
                    util.toRound(obj[date].new_owner_num, obj[date].total_new_owner_num),
                avg_fan :
                    util.ceil(obj[date].fans_num, obj[date].accum_owner_num)
            };
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
            total = 0,
            type = "pie",
            obj = {},
            filter_name = {
                new_owner_num : "圈主",
                fans_num : "粉丝数"
            },
            map = {
                value : filter_name[filter_key] + "(%)"
            },
            newData = {};
        for(var key of orderData) {
            obj[key.id] = {
                value : 0
            }
        }
        for(var key of source) {
            total += key[filter_key];
            obj[key.group_type].value += key[filter_key];
        }
        for(var key of orderData) {
            newData[key.name] = {
                value : util.toRound(obj[key.id].value, total)
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
    hostFour(data, filter_key, filter_key2) {
        var source = data.data,
            orderData = data.orderData,
            total = 0,
            type = "pie",
            obj = {},
            filter_name = {
                new_owner_num : "圈主",
                fans_num : "粉丝数"
            },
            filter_key = filter_key || "-1",
            map = {
                value : filter_name[filter_key2] + "(%)"
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
            total += key[filter_key2];
            obj[key.group_type].value += key[filter_key2];
        }
        for(var key of orderData) {
            if(key.pid === filter_key) {
                newData[key.name] = {
                    value : util.toRound(obj[key.id].value, total)
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
    hostFive(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            newData = [];
        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 20 + i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};