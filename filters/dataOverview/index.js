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
        var sourceData = data.data; 
        var resultArr = [];
        var resultData = [];

        // resultData = [{
        //     "": "昨日",
        //     "start_up": 100,
        //     "active_users": 3305,
        //     "startup_per": 16,
        //     "new_users": 36,
        //     "new_users_rate": "100%",
        //     "new_account": "100%",
        //     "register_rate": "100%",
        //     "use_time_everyone": "100%",
        //     "use_time_everytime": "100%"
        // }];

        resultArr[0] = {
            rows: ["", "start_up", "active_users", "startup_per", "new_users", "new_users_rate", "new_account", "register_rate", "use_time_everyone", "use_time_everytime"],
            cols: [{
                "caption": "",
                "type": "string"
            }, {
                "caption": "启动次数",
                "type": "number"
            }, {
                "caption": "活跃用户",
                "type": "number"
            }, {
                "caption": "人均启动次数",
                "type": "number"
            }, {
                "caption": "新用户",
                "type": "number"
            }, {
                "caption": "新用户占比",
                "type": "string"
            }, {
                "caption": "新增账户",
                "type": "number"
            }, {
                "caption": "注册转化率",
                "type": "string"
            }, {
                "caption": "每人使用时长",
                "type": "string"
            }, {
                "caption": "每次使用时长",
                "type": "string"
            }]
        }

        resultArr[0].data = resultData;

        return resultArr;
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
    },
};
