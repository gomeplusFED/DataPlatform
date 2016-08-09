/**
 * @author luoye
 * @date 20160407
 * @fileoverview 数据概览
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    dataOverviewAllOne(data, type) {
        var source = data.data,
            orderData = data.orderData,
            newData = [],
            now = new Date(),
            zdate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
            qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
            dates = [ zdate, qdate ];
        var obj = {
                name : '对比效果'
            };
        for(var date of dates) {
            var zObj = {
                name : "",
                open_total : 0,
                open_user_total : 0,
                open_user_avg : 0,
                new_user : 0,
                new_user_rate : "",
                new_user_rate_two : "",
                new_account : 0,
                register_rate : 0,
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                jump_loss_rate : 0,
                visit_time_avg : 0,
                stay_time_avg : 0,
                pv1 : 0,
                pv2 : 0,
                create : 0
            };
            for(var key of orderData) {
                var _date = util.getDate(key.date);
                if(date === _date) {
                    if(key.kpi_type === 1) {
                        zObj.pv1 += key.kpi_value;
                    }
                    if(key.kpi_type === 2) {
                        zObj.create += key.kpi_value;
                    }
                    if(key.kpi_type === 3) {
                        zObj.pv2 += key.kpi_value;
                    }
                }
            }
            for(var key of source) {
                var _date = util.getDate(key.date);
                if(type && key.type === type) {
                    continue;
                }
                if(date === _date) {
                    zObj.open_total += key.open_total;
                    zObj.open_user_total += key.open_user_total;
                    zObj.new_user += key.new_user;
                    zObj.new_account += key.new_account;
                    zObj.stay_time_avg += Math.round(key.stay_time_avg);
                    zObj.using_time_avg += Math.round(key.using_time_avg);
                    zObj.uv += key.uv;
                    zObj.pv += key.pv;
                    zObj.ip_count += key.ip_count;
                    zObj.jump_loss_rate += key.jump_loss_rate;
                    zObj.visit_time_avg += Math.round(key.visit_time_avg);
                }
            }
            newData.push(zObj);
        }
        for(var key of newData) {
            key.new_user_rate = util.toFixed(key.new_user, key.open_user_total);
            key.new_user_rate_two = util.toFixed(key.new_user, key.uv);
            key.open_user_avg = util.division(key.open_total, key.open_user_total);
            key.register_rate = util.toFixed(key.new_account, key.new_user);
        }
        newData[0].name = "昨天";
        newData[1].name = "前天";
        obj.open_total =
            util.toFixed(
                newData[0].open_total - newData[1].open_total,
                newData[1].open_total
            );

        obj.jump_loss_rate =
            util.toFixed(
                newData[0].jump_loss_rate - newData[1].jump_loss_rate,
                newData[1].jump_loss_rate
            );

        obj.open_user_total =
            util.toFixed(
                newData[0].open_user_total - newData[1].open_user_total,
                newData[1].open_user_total
            );

        obj.new_user =
            util.toFixed(
                newData[0].new_user - newData[1].new_user,
                newData[1].new_user
            );

        obj.new_account =
            util.toFixed(
                newData[0].new_account - newData[1].new_account,
                newData[1].new_account
            );

        obj.stay_time_avg =
            util.toFixed(
                newData[0].stay_time_avg - newData[1].stay_time_avg,
                newData[1].stay_time_avg
            );

        obj.using_time_avg =
            util.toFixed(
                newData[0].using_time_avg - newData[1].using_time_avg,
                newData[1].using_time_avg
            );

        obj.uv =
            util.toFixed(
                newData[0].uv - newData[1].uv,
                newData[1].uv
            );

        obj.pv =
            util.toFixed(
                newData[0].pv - newData[1].pv,
                newData[1].pv
            );

        obj.ip_count =
            util.toFixed(
                newData[0].ip_count - newData[1].ip_count,
                newData[1].ip_count
            );

        obj.visit_time_avg =
            util.toFixed(
                newData[0].visit_time_avg - newData[1].visit_time_avg,
                newData[1].visit_time_avg
            );
        obj.open_user_avg =
            util.toFixed(
                newData[0].open_user_avg - newData[1].open_user_avg,
                newData[1].open_user_avg
            );

        obj.register_rate = (newData[0].register_rate.replace("%", "")
            - newData[1].register_rate.replace("%", "")).toFixed(2) + "%";

        obj.new_user_rate = (newData[0].new_user_rate.replace("%", "")
            - newData[1].new_user_rate.replace("%", "")).toFixed(2) + "%";

        obj.new_user_rate_two = (newData[0].new_user_rate_two.replace("%", "")
            - newData[1].new_user_rate_two.replace("%", "")).toFixed(2) + "%";

        obj.pv1 =
            util.toFixed(
                newData[0].pv1 - newData[1].pv1,
                newData[1].pv1
            );

        obj.pv2 =
            util.toFixed(
                newData[0].pv2 - newData[1].pv2,
                newData[1].pv2
            );

        obj.create =
            util.toFixed(
                newData[0].create - newData[1].create,
                newData[1].create
            );

        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    dataOverviewAllTwo(data, filter_key, filter_name, dates) {
        var source = data.data,
            newData = {},
            type = "line",
            map = {
                value : filter_name[filter_key]
            };
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            if(filter_key === "register_rate") {
                if(newData[util.getDate(key.date)]) {
                    newData[util.getDate(key.date)].value += key.new_account /
                        (key.new_user === 0 ? 1 : key.new_user) * 100;
                }
            } else {
                if(newData[util.getDate(key.date)]) {
                    newData[util.getDate(key.date)].value += key[filter_key];
                }
            }
        }
        if(filter_key === "register_rate") {
            Object.keys(newData).forEach((key) => {
                newData[key].value = newData[key].value.toFixed(2);
            });
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
    dataOverviewAllThree(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].open_total_rate = util.toFixed(source[i].open_total, sum[1]);
        }
        return util.toTable([source], data.rows, data.cols);
    },
    dataOverviewAllFour(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols);
    },
    dataOverviewWapThree(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols);
    },
    dataOverviewWapFour(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols);
    }
};
