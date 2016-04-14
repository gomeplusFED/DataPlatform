/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var util = require("../../utils");

module.exports = {
    retainedOne(data, dates) {
        var source = data.data,
            newData = [];
        dates.sort((a, b) => {
            return new Date(b) - new Date(a);
        });
        for(var date of dates) {
            var obj = {
                date : date,
                new_user : 0,
                t1 : "0.00%",
                t7 : "0.00%",
                t14 : "0.00%",
                t30 : "0.00%"
            };
            for(var key of source) {
                if(date === util.getDate(key.date)) {
                    obj.new_user = key.new_user;
                    if(key.keep_type === "0") {
                        obj.t1 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
                    } else if (key.keep_type === "1") {
                        obj.t7 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
                    } else if (key.keep_type === "2") {
                        obj.t14 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
                    } else if (key.keep_type === "3") {
                        obj.t30 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
                    }
                }
            }
            newData.push(obj);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};