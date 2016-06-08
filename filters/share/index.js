/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    insideOne(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            map = {
                share_num : "分享次数",
                open_num : "打开次数"
            },
            filter_name = {
                product : "商品",
                shop : "店铺"
            },
            newData = {};
        for(var date of dates) {
            var obj = {
                share_num : 0,
                open_num : 0
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj.share_num += key.share_num;
                    obj.open_num += key.open_num;
                }
            }
            newData[date] = obj;
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    },
    insideTwo(data, dates) {
        var source = data.data,
            count = data.dataCount;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};