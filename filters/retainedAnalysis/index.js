/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    retained = {
        "1" : ["次日留存率", "3日留存率", "7日留存率", "14日留存率", "30日留存率"],
        "2" : ["1周后", "2周后", "3周后", "4周后"],
        "3" : ["1月后", "2月后", "3月后"]
    };

module.exports = {
    retainedOne(data, query, dates){
        let source = data.first.data[0],
            type = "line",
            obj = {},
            _retained = retained[query.day_type],
            map = {},
            newData = {};

        for(let date of dates) {
            map[date] = date;
            obj[date] = {};
        }
        for(let item of source) {
            let date = util.getDate(item.date);
            obj[date][item.key] = item.value;
        }
        for(let item of _retained) {
            newData[item] = {};
            for(let date of dates) {
                newData[item][date] = 0;
            }
        }
        switch(query.day_type) {
            case 1 :
                for(let date in obj) {
                    let a = obj[date];
                    let keep = {
                        "次日留存率" : 
                    };
                }
        }
    },
    retainedTwo(data) {
        var source = data.first.data[0],
            count = data.first.count;
        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.last_1_keep = util.toFixed(key.last_1_keep, key.total_users);
            key.last_7_keep = util.toFixed(key.last_7_keep, key.total_users);
            key.last_14_keep = util.toFixed(key.last_14_keep, key.total_users);
            key.last_30_keep = util.toFixed(key.last_30_keep, key.total_users);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};