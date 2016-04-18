/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 设备终端
 */
var _ = require("lodash"),
    util = require("../../utils");

module.exports = {
    modelOne(data, filter_key) {
        var source = data.data,
            newData = {},
            tArray = [],
            array = util.uniq(_.pluck(source, "key_name")),
            filter_name = {
                value : "新增用户",
                value3 : "启动次数"
            },
            type = "bar",
            map = {
                value : filter_name[filter_key]
            };
        for(var model of array) {
            var obj = {
                model : model,
                value : 0
            };
            for(var key of source) {
                if(model === key.key_name) {
                    obj.value += key[filter_key];
                }
            }
            tArray.push(obj);
        }
        tArray.sort((a, b) => {
            return b.value - a.value;
        });
        var top = tArray.length > 10 ? 10 : tArray.length;
        for(var i = 0; i < top; i++) {
            newData[tArray[i].model] = {
                value : tArray[i].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : true //柱状图竖着
            }
        }]
    }
};