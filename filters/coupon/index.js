/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    allOne(data, dates, params) {
        var source = data.data,
            newDate = [];

        dates.push(
            util.getDate(util.date(dates[0], params.day_type))
        );

        if(dates.length === 2) {
            for(var date of dates) {
                var obj = {
                    name : date,
                    create_num : 0,
                    create_amount : 0,
                    give_num : 0,
                    receive_num : 0,
                    receive_rate : "0%",
                    used_num : 0,
                    used_amount : 0,
                    used_rate : "0%",
                    invalid_num : 0
                };
                for(var key of source) {
                    if(util.getDate(key.date) === date) {
                        obj.create_num += key.create_num;
                        obj.create_amount += key.create_amount / 100;
                        obj.give_num += key.give_num;
                        obj.receive_num += key.receive_num;
                        obj.used_num += key.used_num;
                        obj.used_amount += key.used_amount / 100;
                        obj.invalid_num += key.invalid_num;
                    }
                }
                newDate.push(obj);
            }

            newDate[0].receive_rate = util.toFixed(newDate[0].receive_num, newDate[0].give_num);
            newDate[0].used_rate =  util.toFixed(newDate[0].used_num, newDate[0].receive_num);
            newDate[1].receive_rate = util.toFixed(newDate[1].receive_num, newDate[1].give_num);
            newDate[1].used_rate = util.toFixed(newDate[1].used_num, newDate[1].receive_num);

            newDate.push({
                name : "对比",
                create_num : util.toFixed(
                    newDate[0].create_num - newDate[1].create_num,
                    newDate[0].create_num
                ),
                create_amount : util.toFixed(
                    newDate[0].create_amount - newDate[1].create_amount,
                    newDate[0].create_amount
                ),
                give_num : util.toFixed(
                    newDate[0].give_num - newDate[1].give_num,
                    newDate[0].give_num
                ),
                receive_num : util.toFixed(
                    newDate[0].receive_num - newDate[1].receive_num,
                    newDate[0].receive_num
                ),
                receive_rate :
                newDate[0].receive_rate.replace("%", "") - newDate[1].receive_rate.replace("%", "") + "%",
                used_num : util.toFixed(
                    newDate[0].used_num - newDate[1].used_num,
                    newDate[0].used_num
                ),
                used_amount : util.toFixed(
                    newDate[0].used_amount - newDate[1].used_amount,
                    newDate[0].used_amount
                ),
                used_rate :
                newDate[0].used_rate.replace("%", "") - newDate[1].used_rate.replace("%", "") + "%",
                invalid_num : util.toFixed(
                    newDate[0].invalid_num - newDate[1].invalid_num,
                    newDate[0].invalid_num
                )
            });
        }

        return util.toTable([newDate], data.rows, data.cols);
    },
    allTwo(data, dates) {
        var source = data.data,
            type = "line",
            map = {
                create_num : "创建数量",
                receive_num : "领取数量",
                used_num : "使用数量"
            },
            newData = {};

        for(var date of dates) {
            newData[date] = {
                create_num : 0,
                receive_num : 0,
                used_num : 0
            };
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            newData[date].create_num += key.create_num;
            newData[date].receive_num += key.receive_num;
            newData[date].used_num += key.used_num;
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    allThree(data, filter_key) {
        var source = data.data,
            type = "pie",
            filter_name = {
                create_num : "创建数量",
                receive_num : "领取数量",
                used_num : "使用数量"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {
                "平台" : {
                    value : 0
                },
                "商家" : {
                    value : 0
                }
            };

        for(var key of source) {
            if(key.type === 1) {
                newData["商家"].value += key[filter_key];
            } else {
                newData["平台"].value += key[filter_key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    }
};