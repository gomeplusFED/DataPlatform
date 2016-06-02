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
            var obj = {
                value : 0
            };
            for(var k of source) {
                if(key === k.distribution) {
                    obj.value += k.num;
                    total += k.num;
                }
            }
            newData[key] = {
                value : util.percentage(obj.value, total)
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
            count = array.length;
            source = data.data;
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            var obj = {
                distribution : key,
                num : 0,
                num_rate : ""
            };
            for(var k of source) {
                if(key === k.distribution) {
                    total_num += k.num;
                    obj.num += k.num;
                }
            }
            newData.push(obj);
        }
        for(var key of newData) {
            key.num_rate = util.toFixed(key.num, total_num);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};