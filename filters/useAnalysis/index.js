/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用时长
 */
var util = require("../../utils");

module.exports = {
    useTimeOne(data, array, filter_key) {
        var newData = {},
            source = data.data,
            total = 0,
            type = "bar",
            map = {
                value : filter_key
            };
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            newData[key] = {
                value : 0
            };
        }
        for(key of source) {
            newData[key.distribution].value += key.num;
            total += key.num;
        }
        for(key of array) {
            newData[key] = {
                value : util.percentage(newData[key].value, total)
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },
    useTimeTwo(data, array) {
        var newData = [],
            total_num = 0,
            obj = {},
            count = array.length;
            source = data.data;
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            obj[key] = 0;
        }
        for(key of source) {
            obj[key.distribution] += key.num;
            total_num += key.num;
        }
        for(key of array) {
            newData.push({
                distribution : key,
                num : obj[key],
                num_rate : util.toFixed(obj[key], total_num)
            });
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};