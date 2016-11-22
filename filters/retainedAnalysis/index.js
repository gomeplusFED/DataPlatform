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
    },
    _keys = {
        "1" : ["1st_day_active_user_num", "2nd_day_startup_user_num", "3rd_day_startup_user_num",
            "7th_day_startup_user_num", "14th_day_startup_user_num", "30th_day_startup_user_num"],
        "2" : ["1st_week_active_user_num", "2nd_week_startup_user_num", "3rd_week_startup_user_num",
            "4th_week_startup_user_num", "5th_week_startup_user_num"],
        "3" : ["1st_month_active_user_num", "2nd_month_startup_user_num", "3rd_month_startup_user_num",
            "4th_month_startup_user_num"]
    },
    rows= {
        "1" : ["date", "new_user", "one", "two", "three", "four", "five"],
        "2" : ["date", "new_user", "one", "two", "three", "four"],
        "3" : ["date", "new_user", "one", "two", "three"]
    };

module.exports = {
    retainedOne(data, query, dates){
        let source = data.first.data[0],
            type = "line",
            obj = {},
            keys = _keys[query.day_type],
            _retained = retained[query.day_type],
            map = {},
            newData = {};

        for(let date of dates) {
            if(query.day_type == 1) {
                map[date] = date;
            } else if(query.day_type == 2) {
                let a = moment(new Date(new Date(date) - 6 * 24 * 60 * 60 * 1000)).format("MM-DD");
                map[date] = a + "~" + moment(new Date(date)).format("MM-DD");
            } else {
                map[date] = moment(new Date(date)).format("MM") + "月";
            }
        }
        for(let item of source) {
            let date = util.getDate(item.date);
            if(!obj[date]) {
                obj[date] = {};
                for(let key of keys) {
                    obj[date][key] = 0;
                }
            }
            obj[date][item.rate_key] = item.value;
        }
        for(let item of _retained) {
            newData[item] = {};
            for(let date of dates) {
                newData[item][date] = "0.00";
            }
        }
        switch(query.day_type) {
            case "1" :
                for(let date in obj) {
                    let a = obj[date];
                    newData["次日留存率"][date] = util.percentage(a["2nd_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["3日留存率"][date] = util.percentage(a["3rd_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["7日留存率"][date] = util.percentage(a["7th_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["14日留存率"][date] = util.percentage(a["14th_day_startup_user_num"], a["1st_day_active_user_num"]);
                    newData["30日留存率"][date] = util.percentage(a["30th_day_startup_user_num"], a["1st_day_active_user_num"]);
                }
                break;
            case "2" :
                for(let date in obj) {
                    let a = obj[date];
                    newData["1周后"][date] = util.percentage(a["2nd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["2周后"][date] = util.percentage(a["3rd_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["3周后"][date] = util.percentage(a["4th_week_startup_user_num"], a["1st_week_active_user_num"]);
                    newData["4周后"][date] = util.percentage(a["5th_week_startup_user_num"], a["1st_week_active_user_num"]);
                }
                break;
            case "3" :
                for(let date in obj) {
                    let a = obj[date];
                    newData["1月后"][date] = util.percentage(a["2nd_month_startup_user_num"], a["1st_month_active_user_num"]);
                    newData["2月后"][date] = util.percentage(a["3rd_month_startup_user_num"], a["1st_month_active_user_num"]);
                    newData["3月后"][date] = util.percentage(a["4th_month_startup_user_num"], a["1st_month_active_user_num"]);
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
    retainedTwo(data, day_type) {
        var source = data.first.data,
            newData = [],
            _rows = rows[day_type],
            _cols = [{
                caption : "时间",
                type : "string"
            }, {
                caption : "新增用户",
                type : "number"
            }],
            count = data.first.count[0].count;
        for(let key of retained[day_type]) {
            _cols.push({
                caption : key,
                type : "string"
            });
        }
        switch(day_type) {
            case "1" :
                for(let item of source) {
                    let keys = item.key.split(",");
                    let obj = {};
                    for(let key of _rows) {
                        obj[key] = 0;
                    }
                    for(let key of keys) {
                        let k = key.split(";");
                        if(k[1] === "1st_day_active_user_num") {
                            obj.new_user = k[0];
                        } else if(k[1] === "2nd_day_startup_user_num") {
                            obj.one = k[0];
                        } else if(k[1] === "3rd_day_startup_user_num") {
                            obj.two = k[0];
                        } else if(k[1] === "7th_day_startup_user_num") {
                            obj.three = k[0]
                        } else if(k[1] === "14th_day_startup_user_num") {
                            obj.four = k[0]
                        } else if(k[1] === "30th_day_startup_user_num") {
                            obj.five = k[0];
                        }
                    }
                    obj.one = util.toFixed(obj.one, obj.new_user);
                    obj.two = util.toFixed(obj.two, obj.new_user);
                    obj.three = util.toFixed(obj.three, obj.new_user);
                    obj.four = util.toFixed(obj.four, obj.new_user);
                    obj.five = util.toFixed(obj.five, obj.new_user);
                    obj.date = util.getDate(item.date);
                    newData.push(obj);
                }
                break;
            case "2":
                for(let item of source) {
                    let keys = item.key.split(",");
                    let obj = {};
                    for(let key of _rows) {
                        obj[key] = 0;
                    }
                    for(let key of keys) {
                        let k = key.split(";");
                        if(k[1] === "1st_week_active_user_num") {
                            obj.new_user = k[0];
                        } else if(k[1] === "2nd_week_startup_user_num") {
                            obj.one = k[0];
                        } else if(k[1] === "3rd_week_startup_user_num") {
                            obj.two = k[0];
                        } else if(k[1] === "4th_week_startup_user_num") {
                            obj.three = k[0]
                        } else if(k[1] === "5th_week_startup_user_num") {
                            obj.four = k[0]
                        }
                    }
                    obj.one = util.toFixed(obj.one, obj.new_user);
                    obj.two = util.toFixed(obj.two, obj.new_user);
                    obj.three = util.toFixed(obj.three, obj.new_user);
                    obj.four = util.toFixed(obj.four, obj.new_user);
                    obj.date = util.getDate(new Date(item.date - 6 * 24 * 60 * 60 * 1000)) + "~" + util.getDate(item.date);
                    newData.push(obj);
                }
                break;
            case "3" :
                for(let item of source) {
                    let keys = item.key.split(",");
                    let obj = {};
                    for(let key of _rows) {
                        obj[key] = 0;
                    }
                    for(let key of keys) {
                        let k = key.split(";");
                        if(k[1] === "1st_month_active_user_num") {
                            obj.new_user = k[0];
                        } else if(k[1] === "2nd_month_startup_user_num") {
                            obj.one = k[0];
                        } else if(k[1] === "3rd_month_startup_user_num") {
                            obj.two = k[0];
                        } else if(k[1] === "4th_month_startup_user_num") {
                            obj.three = k[0]
                        }
                    }
                    obj.one = util.toFixed(obj.one, obj.new_user);
                    obj.two = util.toFixed(obj.two, obj.new_user);
                    obj.three = util.toFixed(obj.three, obj.new_user);
                    obj.date = moment(item.date).format("MM") + "月";
                    newData.push(obj);
                }
                break;
            default : break;
        }
        return util.toTable([newData], [_rows], [_cols], [count]);
    }
};