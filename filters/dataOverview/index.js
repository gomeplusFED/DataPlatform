/**
 * @author luoye
 * @date 20160407
 * @fileoverview 数据概览
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    dataOverviewAllOne(data, filter_key) {
        var dates = util.uniq(_.pluck(data, "date"));
        var newData = [];
        data.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
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
                stay_time_avg : 0
            };
            for(var key of data) {
                if(date.getTime() === key.date.getTime()) {
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
            key.new_user_rate = (key.new_user / (total_new_users === 0 ? 1 : total_new_users) * 100).toFixed(1) + "%";
            key.open_user_avg = (key.open_user_total / (key.open_total === 0 ? 1 : key.open_total) * 100).toFixed(1);
            key.register_rate = (key.new_account / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(1) + "%";
        }
        if(newData.length < 2) {
            newData[0] = {
                name : "",
                open_total : 0,
                open_user_total : 0,
                open_user_avg : 0,
                new_user : 0,
                new_user_rate : "0%",
                new_account : 0,
                register_rate : "0%",
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                jump_loss_rate : 0,
                visit_time_avg : 0,
                stay_time_avg : 0
            };
        }
        if(newData.length < 3) {
            newData[1] = {
                name : "",
                open_total : 0,
                open_user_total : 0,
                open_user_avg : 0,
                new_user : 0,
                new_user_rate : "0%",
                new_account : 0,
                register_rate : "0%",
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                jump_loss_rate : 0,
                visit_time_avg : 0,
                stay_time_avg : 0
            };
        }
        newData[0].name = "昨天";
        newData[1].name = "前天";
        obj.open_total = ((newData[0].open_total - newData[1].open_total)
            / (newData[0].open_total === 0 ? 1 : newData[0].open_total) * 100).toFixed(1) + "%";
        obj.jump_loss_rate = ((newData[0].jump_loss_rate - newData[1].jump_loss_rate)
            / (newData[0].jump_loss_rate === 0 ? 1 : newData[0].jump_loss_rate) * 100).toFixed(1) + "%";
        obj.open_user_total = ((newData[0].open_user_total - newData[1].open_user_total)
            / (newData[0].open_user_total === 0 ? 1 : newData[0].open_user_total) * 1000).toFixed(1) / 10 + "%";
        obj.new_user = ((newData[0].new_user - newData[1].new_user)
            / (newData[0].new_user === 0 ? 1 : newData[0].new_user) * 1000).toFixed(1) / 10 + "%";
        obj.new_account = ((newData[0].new_account - newData[1].new_account)
            / (newData[0].new_account === 0 ? 1 : newData[0].new_account) * 1000).toFixed(1) / 10 + "%";
        obj.stay_time_avg = ((newData[0].stay_time_avg - newData[1].stay_time_avg)
            / (newData[0].stay_time_avg === 0 ? 1 : newData[0].stay_time_avg) * 1000).toFixed(1) / 10 + "%";
        obj.using_time_avg = ((newData[0].using_time_avg - newData[1].using_time_avg)
            / (newData[0].using_time_avg === 0 ? 1 : newData[0].using_time_avg) * 1000).toFixed(1) / 10 + "%";
        obj.uv = ((newData[0].uv - newData[1].uv)
            / (newData[0].uv === 0 ? 1 : newData[0].uv) * 1000).toFixed(1) / 10 + "%";
        obj.pv = ((newData[0].pv - newData[1].pv)
            / (newData[0].pv === 0 ? 1 : newData[0].pv) * 1000).toFixed(1) / 10 + "%";
        obj.ip_count = ((newData[0].ip_count - newData[1].ip_count)
            / (newData[0].ip_count === 0 ? 1 : newData[0].ip_count) * 1000).toFixed(1) / 10 + "%";
        obj.visit_time_avg = ((newData[0].visit_time_avg - newData[1].visit_time_avg)
            / (newData[0].visit_time_avg === 0 ? 1 : newData[0].visit_time_avg) * 1000).toFixed(1) / 10 + "%";
        obj.open_user_avg = ((newData[0].open_user_avg - newData[1].open_user_avg)
            / (newData[0].open_user_avg === 0 ? 1 : newData[0].open_user_avg) * 1000).toFixed(1) / 10 + "%";
        obj.register_rate = newData[0].register_rate.replace("%", "") - newData[1].register_rate.replace("%", "") + "%";
        obj.new_user_rate = newData[0].new_user_rate.replace("%", "") - newData[1].new_user_rate.replace("%", "") + "%";
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    dataOverviewAllTwo(data, filter_key) {
        return [{
            type: 'line',
            data: {
                '2016-03-21': {
                    pv: 1000,
                    uv: 500
                },
                '2016-03-22': {
                    pv: 2000,
                    uv: 1000
                },
                '2016-03-23': {
                    pv: 3000,
                    uv: 1500
                },
                '2016-03-24': {
                    pv: 4000,
                    uv: 2000
                },
                '2016-03-25': {
                    pv: 5000,
                    uv: 2500
                },
            },
            map: {
                pv: '访问数',
                uv: '访客数'
            },
            config: {
                stack: false // 是否堆叠
            }
        }]
    },
    dataOverviewAllThree(data, filter_key) {
        return [{
            type: 'pie',
            data: {
                '2016-03-21': {
                    pv: 1000,
                    uv: 500
                },
                '2016-03-22': {
                    pv: 2000,
                    uv: 1000
                },
                '2016-03-23': {
                    pv: 3000,
                    uv: 1500
                },
                '2016-03-24': {
                    pv: 4000,
                    uv: 2000
                },
                '2016-03-25': {
                    pv: 5000,
                    uv: 2500
                },
            },
            map: {
                pv: '访问数',
                uv: '访客数'
            },
            config: {
                stack: true // 是否堆叠
            }
        }]
    },
    dataOverviewAllFour(data, filter_key) {
        return [{
            data: {},
            rows: ["", "uv", "pv", "break_rate", "new_user", ""],
            cols: [{
                caption: "",
                type: "string"
            }, {
                caption: "访客数",
                type: "string"
            }, {
                caption: "浏览量",
                type: "string"
            }, {
                caption: "IP数",
                type: "string"
            }, {
                caption: "跳出率",
                type: "string"
            }, {
                caption: "新用户",
                type: "string"
            }, {
                caption: "新用户占比",
                type: "string"
            }, {
                caption: "新增用户",
                type: "string"
            }, {
                caption: "注册转化率",
                type: "string"
            }, {
                caption: "平均访问时长",
                type: "string"
            }]

        }]
    }
};
