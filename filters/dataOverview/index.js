/**
 * @author luoye
 * @date 20160407
 * @fileoverview 数据概览
 */
var util = require("../../utils"),
    moment = require("moment"),
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
            },
            total_new_users = 0;
        for(var date of dates) {
            var zObj = {
                name : "",
                open_total : 0,
                open_user_total : 0,
                open_user_avg : 0,
                new_user : 0,
                new_user_rate : "",
                new_account : 0,
                register_rate : 0,
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                jump_loss_rate : 0,
                visit_time_avg : 0,
                stay_time_avg : 0,
                pv : 0,
                create : 0
            };
            for(var key of orderData) {
                if(new Date(date + " 00:00:00").getTime() < key.date.getTime() &&
                    key.date.getTime() < new Date(date + " 23:59:59")) {
                    if(key.kpi_type === 1) {
                        zObj.pv += key.kpi_value;
                    }
                    if(key.kpi_type === 2) {
                        zObj.create += key.kpi_value;
                    }
                }
            }
            for(var key of source) {
                if(type && key.type === type) {
                    continue;
                }
                if(new Date(date + " 00:00:00").getTime() < key.date.getTime() &&
                    key.date.getTime() < new Date(date + " 23:59:59")) {
                    total_new_users += key.new_user;
                    zObj.open_total += key.open_total;
                    zObj.open_user_total += key.open_user_total;
                    zObj.new_user += key.new_user;
                    zObj.new_account += key.new_account;
                    zObj.stay_time_avg += key.stay_time_avg;
                    zObj.using_time_avg += key.using_time_avg;
                    zObj.uv += key.uv;
                    zObj.pv += key.pv;
                    zObj.ip_count += key.ip_count;
                    zObj.jump_loss_rate += key.jump_loss_rate;
                }
            }
            newData.push(zObj);
        }
        for(var key of newData) {
            key.new_user_rate = util.toFixed(key.new_user, total_new_users);
            key.open_user_avg = (key.open_user_total / (key.open_total === 0 ? 1 : key.open_total) * 100).toFixed(1);
            key.register_rate = util.toFixed(key.new_account, key.new_user);
        }
        newData[0].name = "昨天";
        newData[1].name = "前天";
        obj.open_total = ((newData[0].open_total - newData[1].open_total)
            / (newData[0].open_total === 0 ? 1 : newData[0].open_total) * 100).toFixed(1) + "%";
        obj.jump_loss_rate = ((newData[0].jump_loss_rate - newData[1].jump_loss_rate)
            / (newData[0].jump_loss_rate === 0 ? 1 : newData[0].jump_loss_rate) * 100).toFixed(1) + "%";
        obj.open_user_total = ((newData[0].open_user_total - newData[1].open_user_total)
            / (newData[0].open_user_total === 0 ? 1 : newData[0].open_user_total) * 100).toFixed(1) + "%";
        obj.new_user = ((newData[0].new_user - newData[1].new_user)
            / (newData[0].new_user === 0 ? 1 : newData[0].new_user) * 100).toFixed(1) + "%";
        obj.new_account = ((newData[0].new_account - newData[1].new_account)
            / (newData[0].new_account === 0 ? 1 : newData[0].new_account) * 100).toFixed(1) + "%";
        obj.stay_time_avg = ((newData[0].stay_time_avg - newData[1].stay_time_avg)
            / (newData[0].stay_time_avg === 0 ? 1 : newData[0].stay_time_avg) * 100).toFixed(1) + "%";
        obj.using_time_avg = ((newData[0].using_time_avg - newData[1].using_time_avg)
            / (newData[0].using_time_avg === 0 ? 1 : newData[0].using_time_avg) * 100).toFixed(1) + "%";
        obj.uv = ((newData[0].uv - newData[1].uv)
            / (newData[0].uv === 0 ? 1 : newData[0].uv) * 100).toFixed(1) + "%";
        obj.pv = ((newData[0].pv - newData[1].pv)
            / (newData[0].pv === 0 ? 1 : newData[0].pv) * 100).toFixed(1) + "%";
        obj.ip_count = ((newData[0].ip_count - newData[1].ip_count)
            / (newData[0].ip_count === 0 ? 1 : newData[0].ip_count) * 100).toFixed(1) + "%";
        obj.visit_time_avg = ((newData[0].visit_time_avg - newData[1].visit_time_avg)
            / (newData[0].visit_time_avg === 0 ? 1 : newData[0].visit_time_avg) * 100).toFixed(1) + "%";
        obj.open_user_avg = ((newData[0].open_user_avg - newData[1].open_user_avg) /
            (newData[0].open_user_avg === "0.0" ? 1 : newData[0].open_user_avg) * 100).toFixed(1) + "%";
        obj.register_rate = (newData[0].register_rate.replace("%", "")
            - newData[1].register_rate.replace("%", "")).toFixed(1) + "%";
        obj.new_user_rate = (newData[0].new_user_rate.replace("%", "")
            - newData[1].new_user_rate.replace("%", "")).toFixed(1) + "%";
        obj.pv = ((newData[0].pv - newData[1].pv) /
            (newData[0].pv === 0 ? 1 : newData[0].pv) * 100).toFixed(1) + "%";
        obj.create = ((newData[0].create - newData[1].create) /
            (newData[0].create === 0 ? 1 : newData[0].create) * 100).toFixed(1) + "%";
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    dataOverviewAllTwo(data, filter_key, filter_name) {
        var source = data.data,
            newData = {},
            type = "line",
            map = {
                value : filter_name[filter_key]
            },
            dates = util.uniq(_.pluck(source, "date"));
        dates.sort((a, b) => {
            return new Date(a) - new Date(b);
        });
        for(var date of dates) {
            var obj = {
                value : 0
            };
            for(var key of source) {
                if(date.getTime() === key.date.getTime()) {
                    if(filter_key === "register_rate") {
                        obj.value += Math.round(key.new_account / (key.new_user === 0 ? 1 : key.new_user) * 100);
                    } else {
                        obj.value += key[filter_key];
                    }

                }
            }
            newData[moment(date).format("YYYY-MM-DD")] = obj;
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
            newData = [],
            total_pv = 0,
            top = source.length > 10 ? 10 : source.length;
        source.sort((a, b) => {
            return b.pv - a.pv;
        });
        for(var key of source) {
            if(key.region === "ALL") {
                continue;
            }
            total_pv += key.pv;
        }
        for(var i = 0; i < top; i++) {
            if(source[i].region === "ALL") {
                top++;
            } else {
                newData.push(source[i]);
            }
        }
        for(var i = 0; i < newData.length; i++) {
            newData[i].id = i + 1;
            newData[i].pv_rate = util.toFixed(newData[i].pv, total_pv);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    dataOverviewAllFour(data) {
        var source = data.data,
            top = source.length > 10 ? 10 : source.length,
            total_pv = 0,
            newData = [];
        source.sort((a, b) => {
            return b.pv - a.pv;
        });
        for(var key of source) {
            total_pv += key.pv;
        }
        for(var i = 0; i < top; i++) {
            source[i].id = i + 1;
            newData.push(source[i]);
        }
        for(var key of newData) {
            key.pv_rate = util.toFixed(key.pv, total_pv);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};
