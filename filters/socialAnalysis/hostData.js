/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    hostOne(data) {
        var source = data.data,
            newData = {
                new_owner_num : 0,
                accum_owner_num : 0,
                total_new_owner_num : 0,
                fans_num : 0,
                new_owner_rate : 0,
                avg_fan : 0
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
    hostTwo(data,filter_key) {
        var source = data.data,
            type = "line",
            array = [{
                key : "新增圈主数",
                value: "1"
            }, {
                key : "新圈主占比",
                value: "2"
            }, {
                key : "人均粉丝数",
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
    hostThree(data,filter_key,date) {
        var source = data.data,
            type = "bar",
            map = {}
    },
    hostFour(data,date) {
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