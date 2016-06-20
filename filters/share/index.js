/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    indexOne(data) {
        var source = data.data,
            obj = {
                shareTimeSum : 0,
                shareUserSum : 0,
                clickTimeSum : 0,
                clickUserSum : 0
            };
        for(var key of source) {
            obj.shareTimeSum += key.sharetimesum;
            obj.shareUserSum += key.shareusersum;
            obj.clickTimeSum += key.clicktimesum;
            obj.clickUserSum += key.clickusersum;
        }
        obj.rate = util.toFixed(obj.shareTimeSum, obj.clickTimeSum);
        return util.toTable([[obj]], data.rows, data.cols);
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