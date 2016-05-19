/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用频率
 */
var util = require("../../utils");

module.exports = {
    useFrequencyOne(data, array, filter_key) {
        var newData = {},
            source = data.data,
            total = 0,
            type = "bar",
            obj = {},
            map = {
                value : filter_key
            };
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            obj[key] = {
                value : 0
            };
        }

        for(var key of source) {
            obj[ key.distribution].value += key.num;
            total += key.num;
        }

        for(var key of array) {
            newData[key] = {
                value : util.percentage(obj[key].value, total)
            }
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
    useFrequencyTwo(data, array) {
        var newData = [],
            total_num = 0,
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
        return util.toTable([newData], data.rows, data.cols);
    }
};