/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 访问页面数量分布
 */
var util = require("../../utils");

module.exports = {
    accessPageNumOne(data, array) {
        var newData = {},
            source = data.first.data[0],
            type = "bar",
            map = {
                value : "访问页面"
            };
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            newData[key] = {
                value : 0
            };
        }

        for(var k of source) {
            newData[k.distribution].value += k.sum_num;
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
    accessPageNumTwo(data, array) {
        var newData = [],
            count = array.length,
            total_num = 0,
            source = data.first.data[0];
        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
        for(var key of array) {
            var obj = {
                distribution : key,
                num : 0,
                num_rate : ""
            };
            for(var k of source) {
                if(key === k.distribution) {
                    total_num += k.sum_num;
                    obj.num += k.sum_num;
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