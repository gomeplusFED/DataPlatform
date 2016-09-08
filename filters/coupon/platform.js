/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 平台优惠券
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    platformCouponOne(data, dates, params) {
        var source = data.data,
            obj = {},
            newData = [];

        dates.push(
            util.getDate(util.date(dates[0], params.day_type))
        );

        if(dates.length === 2) {
            for(var date of dates) {
                obj[date] = {
                    name : date,
                    published_num : 0,
                    published_amount : 0,
                    give_num : 0,
                    receive_num : 0,
                    receive_rate : "0%",
                    used_num : 0,
                    used_amount : 0,
                    used_rate : "0%",
                    invalid_num : 0

                }
            }

            for(var key of source) {
                var _date = util.getDate(key.date);
                obj[_date].published_num += key.published_num;
                obj[_date].published_amount += +util.division(key.published_amount, 100);
                obj[_date].give_num += key.give_num;
                obj[_date].receive_num += key.receive_num;
                obj[_date].used_num += key.used_num;
                obj[_date].used_amount += +util.division(key.used_amount, 100);
                obj[_date].invalid_num += key.invalid_num;
            }

            for(var date of dates) {
                newData.push({
                    name : date,
                    published_num : obj[date].published_num,
                    published_amount : obj[date].published_amount.toFixed(2),
                    give_num : obj[date].give_num,
                    receive_num : obj[date].receive_num,
                    used_num : obj[date].used_num,
                    used_amount : obj[date].used_amount.toFixed(2),
                    invalid_num : obj[date].invalid_num,
                    receive_rate : util.toFixed(obj[date].receive_num, obj[date].published_num),
                    used_rate : util.toFixed(obj[date].used_num, obj[date].receive_num)
                });
            }

            newData.push({
                name : "对比",
                published_num : util.toFixed(
                    newData[0].published_num - newData[1].published_num,
                    newData[0].published_num
                ),
                published_amount : util.toFixed(
                    newData[0].published_amount - newData[1].published_amount,
                    newData[0].published_amount
                ),
                give_num : util.toFixed(
                    newData[0].give_num - newData[1].give_num,
                    newData[0].give_num
                ),
                receive_num : util.toFixed(
                    newData[0].receive_num - newData[1].receive_num,
                    newData[0].receive_num
                ),
                used_num : util.toFixed(
                    newData[0].used_num - newData[1].used_num,
                    newData[0].used_num
                ),
                used_amount : util.toFixed(
                    newData[0].used_amount - newData[1].used_amount,
                    newData[0].used_amount
                ),
                invalid_num : util.toFixed(
                    newData[0].invalid_num - newData[1].invalid_num,
                    newData[0].invalid_num
                ),
                receive_rate :
                    newData[0].receive_rate.replace("%", "") - newData[1].receive_rate.replace("%", "") + "%",
                used_rate :
                    newData[0].used_rate.replace("%", "") - newData[1].used_rate.replace("%", "") + "%"
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    platformCouponTwo(data, dates) {
        var source = data.data,
            type  = "line",
            map = {
                published_num : "发行数量",
                give_num : "送券数量",
                receive_num : "领取数量",
                used_num : "使用数量"
            },
            newData = {};

        for(var date of dates) {
            newData[date] = {
                published_num : 0,
                give_num : 0,
                receive_num : 0,
                used_num : 0
            };
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            newData[date].published_num += key.published_num;
            newData[date].give_num += key.give_num;
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
    platformCouponThree(data) {
        var source = data.data,
            type = "bar",
            map = {
                receive_rate : "领取占比（%）",
                used_rate : "使用占比（%）",
                rate : "发送占比（%）"
            },
            array = ["1-10", "11-20", "21-30", "31-50", "51-100", "101-500", "500+"],
            newData = {},
            obj = {},
            total_receive = 0,
            total_used = 0,
            total_give_num = 0;

        for(var key of array) {
            obj[key] = {
                receive_num : 0,
                used_num : 0,
                give_num : 0
            };
        }

        for(var key of source) {
            total_receive += key.receive_num;
            total_used += key.used_num;
            total_give_num += key.give_num;
            obj[key.price_interrgional].receive_num += key.receive_num;
            obj[key.price_interrgional].used_num += key.used_num;
            obj[key.price_interrgional].give_num += key.give_num;
        }

        for(var key in obj) {
            newData[key + "元"] = {
                receive_rate : util.toRound(obj[key].receive_num, total_receive),
                used_rate : util.toRound(obj[key].used_num, total_used),
                rate : util.toRound(obj[key].give_num, total_give_num)
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    platformCouponFour(data) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.date = util.getDate(key.date);
            key.published_amount = util.division(key.published_amount, 100);
            key.give_amount = util.division(key.give_amount, 100);
            key.receive_amount = util.division(key.receive_amount, 100);
            key.used_amount = util.division(key.used_amount, 100);
            //key.used_rate = util.toFixed(key.used_num, key.receive_num);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    platformCouponFive(data) {
        var source = data.data,
            sumDate = data.dataSum,
            count = data.dataCount;

        for(var key of source) {
            if(new Date(key.end_at * 1000) <= new Date()) {
                key.expired_rate = util.toFixed(
                    key.receive_num + key.give_num - key.used_num,
                    key.receive_num + key.give_num
                );
                key.invalid_rate = util.toFixed(
                    key.create_num - key.receive_num - key.give_num,
                    key.create_num
                );
            } else {
                key.expired_rate = "0%";
                key.invalid_rate = "0%";
            }
            key.end_at = moment(new Date(key.end_at * 1000)).format("YYYY-MM-DD HH:mm:ss");
            key.discount = key.discount / 100 + '元';
            key.used_rate = util.toFixed(key.used_num, key.receive_num);
            key.receive_rate = util.toFixed(key.receive_num, sumDate["1"]);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};