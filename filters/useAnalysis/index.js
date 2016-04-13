/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用时长
 */

module.exports = {
    useTimeOne(data, array, filter_key) {
        var newData = {},
            source = data.data,
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
                }
            }
            newData[key] = obj;
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
};