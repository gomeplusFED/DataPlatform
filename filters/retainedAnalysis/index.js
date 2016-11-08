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
            if(query.day_type == 1) {
                map[date] = date;
            } else if(query.day_type == 2) {
                let a = moment(new Date(new Date() - 7 * 24 * 60 * 60 * 1000)).format("MM-DD");
                map[date] = moment(new Date(date)).format("MM-DD") + "-" + a;
            } else {
                map[date] = moment(new Date(date)).format("MM") + "月";
            }
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
                    newData["次日留存率"][date] = util.percentage(a["2nd_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["3日留存率"][date] = util.percentage(a["3rd_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["7日留存率"][date] = util.percentage(a["7th_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["14日留存率"][date] = util.percentage(a["14th_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["30日留存率"][date] = util.percentage(a["30th_day_startup_user_num"], a["1st_day_active_user_num"]);
                }
                break;
            case 2 :
                for(let date in obj) {
                    let a = obj[date];
                    newData["1周后"][date] = util.percentage(a["2nd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["2周后"][date] = util.percentage(a["3rd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["3周后"][date] = util.percentage(a["4th_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["4周后"][date] = util.percentage(a["5th_week_startup_user_num"], a["1st_week_active_user_num"]);
                }
                break;
            case 3 :
                for(let date in obj) {
                    let a = obj[date];
                    newData["1月后"][date] = util.percentage(a["2nd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["2月后"][date] = util.percentage(a["3rd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["3月后"][date] = util.percentage(a["4th_week_startup_user_num"], a["1st_week_active_user_num"]);
                }
                break;
            default:break;
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
    retainedTwo(data) {
        var source = data.first.data[0],
            obj = {},
            newData = [],
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