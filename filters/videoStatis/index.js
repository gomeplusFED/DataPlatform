/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计，数据过滤处理
 */
var util = require("../../utils"),
    _ = require("lodash"),
    moment = require('moment');

/* 环比计算 , 昨天－前天  ／  前天 */
function Chain(lastday, beforeLastday) {
    if (lastday == 0 || beforeLastday == 0) {
        return '0%';
    }

    var num = (lastday - beforeLastday) / beforeLastday;

    return util.toFixed(num, 0);
}

var tableConfig = {
    data_overview: {
        rows: [['index', 'play_user', 'play_num']],
        cols: [[
            {
                caption: "数据指标",
                type: "string"
            },
            {
                caption: "播放用户数",
                type: "string"
            },
            {
                caption: "播放次数",
                type: "string"
            }
        ]]

    },
    health_play: {
        rows: [['index', 'port_succ', 'port_succ_ratio', 'start_frame_succ', 'start_frame_succ_ratio', 'stop_play_num', 'stop_play_num_ratio', 'play_fluent', 'play_fluent_ratio']],
        cols: [[
            {
                caption: "指标",
                type: "string"
            },
            {
                caption: "健康播放统计",
                type: "string"
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            }
        ]]
    },
    error_play: {
        rows: [[
            'index', 'port_io_failed', 'port_io_failed_ratio', 'port_data_failed', 'port_data_failed_ratio', 'port_overtime', 'port_overtime_ratio', 'play_failed', 'play_failed_ratio', 'play_error', 'play_error_ratio', 'improper_play', 'improper_play_ratio'
        ]],
        cols: [[
            {
                caption: "指标",
                type: "string"
            },
            {
                caption: "错误播放统计",
                type: "string"
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            },
            {
                caption: ""
            }
        ]]
    }
}

module.exports = {

    videoOne(data, query, dates) {

        //查询数据
        var allSource = data.first.data[0];

        //初始化字段
        var initObj = {};
        for (let item of data.rows) {
            if (item instanceof Array) {
                for (let key of item) {
                    initObj[key] = 0;
                }
            } else {
                initObj[item] = 0;
            }
        }
        //作为除数不能为0
        initObj.sid_num = 1;

        //source应该有两项，没有时给初始化对象
        for (var i = 0; i < 2; i++) {
            if (allSource[i] == undefined) {
                allSource.push(initObj);
            } else {
                allSource[i].date = util.getDate(allSource[i].date);
            }
        }

        //保存输出数据的三个数组
        var one = [], two = [], three = [];

        //用于第一行的数据
        var source = allSource[0].date == dates[0] ? allSource[0] : allSource[1];

        one.push({
            "sid_num": source.sid_num,
            "active_user": source.active_user
        });

        //表二，表三都应当有三行，进行三次循环将对应的值放入two,three两个数组中
        var day_type = [0, "日环比", "周环比", "月环比"];
        for (var i = 1; i <= 3; i++) {
            var Obj2 = {},  //表二的数据结构 
                Obj3 = {};  //表三的数据结构
            switch (i) {
                case 1:
                    for (let item of data.rows[1]) {
                        if (item == "health_play") {
                            Obj2[item] = "数值";
                            continue;
                        }
                        Obj2[item] = source[item];
                    }
                    for (let item of data.rows[2]) {
                        if (item == "unhealth_play") {
                            Obj3[item] = "数值";
                            continue;
                        }
                        Obj3[item] = source[item];
                    }
                    break;
                case 2:
                    //概率 除以sid_num
                    for (let item of data.rows[1]) {
                        Obj2[item] = util.toFixed(source[item] / source.sid_num, 0);
                        if (item == "health_play") {
                            Obj2[item] = "概率";
                        }
                    }
                    for (let item of data.rows[2]) {
                        Obj3[item] = util.toFixed(source[item] / source.sid_num, 0);
                        if (item == "unhealth_play") {
                            Obj3[item] = "概率";
                        }
                    }
                    break;
                case 3:
                    for (let item of data.rows[1]) {
                        if (item == "health_play") {
                            Obj2[item] = day_type[query.day_type];
                        } else {
                            Obj2[item] = Chain(allSource[0][item], allSource[1][item]);
                        }
                    }

                    for (let item of data.rows[2]) {
                        if (item == "unhealth_play") {
                            Obj3[item] = day_type[query.day_type];
                        } else {
                            Obj3[item] = Chain(allSource[0][item], allSource[1][item]);
                        }
                    }
            }

            two.push(Obj2);
            three.push(Obj3);
        }

        return util.toTable([one, two, three], data.rows, data.cols);
    },

    videoTwo(data, query, dates) {
        /* 前端组件参数 */
        var type = "line";
        var filterKey = {
            "sid_num": "播放次数",
            "health_play": "健康播放数",
            "health_pro": "健康播放概率(%)",
            "unhealth_play": "错误播放数",
            "unhealth_pro": "错误播放概率(%)"
        },
            filter_key = query.filter_key;
        var map = {
            "ios": "ios",
            "android": "android",
            "h5_custom": "h5_custom",
            "h5_native": "h5_native",
            "flash": "flash"
        };

        /* init Data */
        var source = data.first.data[0];
        var newData = {};  //输出的数据

        //有几个时间输出几个以时间为键的值
        for (let item of dates) {
            //每一个时间的键都应包含以下数据
            var theobj = {
                "ios": 0,
                "android": 0,
                "h5_custom": 0,
                "h5_native": 0,
                "flash": 0
            };

            //遍历查询结果找出和当前时间相等的值
            for (let key of source) {
                if (util.getDate(key.date) != item) {
                    continue;
                }
                //与当前时间相等的值包括sdk的所有类型,找出这条记录与谁相等
                for (var onekey in theobj) {
                    if (onekey == key.sdk_app_type) {
                        //找到了对应的记录，根据filter_key赋值
                        var number;
                        switch (filter_key) {
                            case "sid_num":
                            case "unhealth_play":
                            case "health_play":
                                number = key[filter_key];
                                break;
                            case "health_pro":
                                number = util.percentage(key.health_play, key.sid_num);
                                break;
                            case "unhealth_pro":
                                number = util.percentage(key.unhealth_play, key.sid_num);
                                break;
                        }
                        theobj[onekey] = number;
                    }
                }
            }

            newData[item] = theobj;
        }

        /* 输出格式
        {
            "2016-08-22" : {
                "ios" : 3333,
                "android" : 2323,
                "h5_custom" : 2344,
                "h5_native" : 2111,
                "flash" : 333
            },
            "2016-08-23" : {
                "ios" : 66,
                "android" : 54,
                "h5_custom" : 443,
                "h5_native" : 22,
                "flash" : 333
            }
        }*/

        return [{
            type: type,
            map: map,
            data: newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY: false //柱状图竖着
            }
        }];
    },

    videoThree(data, query, params) {
        var source = data.first.data[0];

        for (let item of source) {
            item.date = util.getDate(item.date);
            item["l-16"] = util.percentage(item.port_succ, item.sid_num) + "%";
            item["l-17"] = util.percentage(item.start_frame_succ, item.sid_num) + "%";
            item["l-18"] = util.percentage(item.stop_play_num, item.sid_num) + "%";
            item["l-19"] = util.percentage(item.play_fluent, item.sid_num) + "%";
            item["l-20"] = util.percentage(item.port_io_failed, item.sid_num) + "%";
            item["l-21"] = util.percentage(item.port_data_failed, item.sid_num) + "%";
            item["l-22"] = util.percentage(item.port_overtime, item.sid_num) + "%";
            item["l-23"] = util.percentage(item.play_failed, item.sid_num) + "%";
            item["l-24"] = util.percentage(item.play_error, item.sid_num) + "%";
            item["l-25"] = util.percentage(item.improper_play, item.sid_num) + "%";
        }
        return util.toTable([source], data.rows, data.cols);
    },

    videoFour(data, query, dates) {
        var source = data.first.data[0],
            count = data.first.count;

        var RowsOther = [
            "port_succ",
            "start_frame_succ",
            "stop_play_num",
            "play_fluent",
            "port_io_failed",
            "port_data_failed",
            "port_overtime",
            "play_failed",
            "play_error",
            "improper_play",
        ];

        //time , sdk_app_type,相同的放一起,最后重新排序
        var ArrObj = {};
        for (let date of dates) {
            ArrObj[date] = {};
        }

        for (let item of source) {
            //过滤版本为ALL的数据
            if (item.ver == "ALL") {
                continue;
            }
            item.date = util.getDate(item.date);

            item["5"] = util.percentage(item.health_play, item.sid_num) + "%";

            for (let key of RowsOther) {
                item[key + "_lv"] = util.percentage(item[key], item.sid_num) + "%";
            }

            if (!ArrObj[item.date][item.sdk_app_type]) ArrObj[item.date][item.sdk_app_type] = [];
            ArrObj[item.date][item.sdk_app_type].push(item);
        }

        //重新排序
        var EndArr = [];
        for (var date in ArrObj) {
            for (var key in ArrObj[date]) {
                for (let item of ArrObj[date][key]) {
                    EndArr.push(item);
                }
            }
        }

        var merge = util.mergeCell(EndArr, ["date", "sdk_app_type"]);

        return util.toTable([EndArr], data.rows, data.cols, {
            count: [count],
            config: [merge]
        });
    },

    videoKpiOne(data, query, dates) {
        let one = data.first.data[0],
            second = data.second.data[0],
            third = data.third.data[0],
            count1 = data.first.count,
            count2 = data.second.count,
            count3 = data.third.count,
            data1 = [],
            data2 = [],
            data3 = []

        if (one) {
            let source = one
            data1 = [{
                // index: '数值',
                play_user: '播放用户数: ' + source.play_user,
                play_num: '播放次数: ' + source.play_num
            }
            // , {
            //     index: '环比',
            //     play_user: Chain(source.play_user, source.play_user_pre),
            //     play_num: Chain(source.play_num, source.play_num_pre)
            // }
            ]
        }
        if (second) {
            let source = second
            data2 = [
                {
                    index: '',
                    port_succ: 'play接口成功数',
                    port_succ_ratio: 'play接口成功率',
                    start_frame_succ: '首帧成功数',
                    start_frame_succ_ratio: '首帧成功率',
                    stop_play_num: '卡顿播放次数',
                    stop_play_num_ratio: '卡顿播放次率',
                    play_fluent: '播放流畅数',
                    play_fluent_ratio: '播放流畅率'
                },
                {
                    index: '数值',
                    port_succ: source.port_succ,
                    port_succ_ratio: util.toFixedLength(source.port_succ, source.play_num, 4),
                    start_frame_succ: source.start_frame_succ,
                    start_frame_succ_ratio: util.toFixedLength(source.start_frame_succ, source.play_num, 4),
                    stop_play_num: source.stop_play_num,
                    stop_play_num_ratio: util.toFixedLength(source.stop_play_num, source.play_num, 4),
                    play_fluent: source.play_fluent,
                    play_fluent_ratio: util.toFixedLength(source.play_fluent, source.play_num, 4)
                },
                {
                    index: '环比',
                    port_succ: Chain(source.port_succ, source.port_succ_pre),
                    port_succ_ratio: '--',
                    start_frame_succ: Chain(source.start_frame_succ, source.start_frame_succ_pre),
                    start_frame_succ_ratio: '--',
                    stop_play_num: Chain(source.stop_play_num, source.stop_play_num_pre),
                    stop_play_num_ratio: '--',
                    play_fluent: Chain(source.play_fluent, source.play_fluent_pre),
                    play_fluent_ratio: '--'
                }
            ]
        }
        if (third) {
            let source = third
            data3 = [
                {
                    index: '',
                    port_io_failed: 'play接口IO错误数',
                    port_io_failed_ratio: 'play接口IO错误率',
                    port_data_failed: 'play接口数据错误数',
                    port_data_failed_ratio: 'play接口数据错误率',
                    port_overtime: 'play接口超时数',
                    port_overtime_ratio: 'play接口超时率',
                    play_failed: '播放失败数',
                    play_failed_ratio: '播放失败率',
                    play_error: '视频错误数',
                    play_error_ratio: '视频错误率',
                    improper_play: '非正常播放数',
                    improper_play_ratio: '非正常播放率'
                }, {
                    index: '数值',
                    port_io_failed: source.port_io_failed,
                    port_io_failed_ratio: util.toFixedLength(source.port_io_failed, source.play_num, 4),
                    port_data_failed: source.port_data_failed,
                    port_data_failed_ratio: util.toFixedLength(source.port_data_failed, source.play_num, 4),
                    port_overtime: source.port_overtime,
                    port_overtime_ratio: util.toFixedLength(source.port_overtime, source.play_num, 4),
                    play_failed: source.play_failed,
                    play_failed_ratio: util.toFixedLength(source.play_failed, source.play_num, 4),
                    play_error: source.play_error,
                    play_error_ratio: util.toFixedLength(source.play_error, source.play_num, 4),
                    improper_play: source.improper_play,
                    improper_play_ratio: util.toFixedLength(source.improper_play, source.play_num, 4)
                },
                {
                    index: '环比',
                    port_io_failed: Chain(source.port_io_failed, source.port_io_failed_pre),
                    port_io_failed_ratio: '--',
                    port_data_failed: Chain(source.port_data_failed, source.port_data_failed_pre),
                    port_data_failed_ratio: '--',
                    port_overtime: Chain(source.port_overtime, source.port_overtime_pre),
                    port_overtime_ratio: '--',
                    play_failed: Chain(source.play_failed, source.play_failed_pre),
                    play_failed_ratio: '--',
                    play_error: Chain(source.play_error, source.play_error_pre),
                    play_error_ratio: '--',
                    improper_play: Chain(source.improper_play, source.improper_play_pre),
                    improper_play_ratio: '--'
                }
            ]
        }

        return util.toTable([data1, data2, data3], data.rows, data.cols, [count1, count2, count3], [true, false, false]);
    },

    videoKpiTwo(data, query, dates) {
        /* 前端组件参数 */
        var type = "line";
        var filterKey = {
            "play_user": "播放用户数",
            "play_num": "播放次数",
            "start_frame_succ": "首帧成功数",
            "play_failed": "播放失败数"
        },
            filter_key = query.filter_key;

        var map = {
            "ios": "ios",
            "android": "android",
            "h5_custom": "h5_custom",
            "h5_native": "h5_native",
            "flash": "flash"
        };

        /* init Data */
        var source = data.first.data;
        var newData = {};  //输出的数据

        //有几个时间输出几个以时间为键的值
        for (let item of dates) {
            //每一个时间的键都应包含以下数据
            var theobj = {
                "ios": 0,
                "android": 0,
                "h5_custom": 0,
                "h5_native": 0,
                "flash": 0
            };

            if (query && query.sdk_app_type && query.sdk_app_type !== 'ALL') {
                theobj = {}
                theobj[query.sdk_app_type] = 0
            }

            //遍历查询结果找出和当前时间相等的值
            for (let key of source) {
                if (util.getDate(key.date) != item) {
                    continue;
                }
                //与当前时间相等的值包括sdk的所有类型,找出这条记录与谁相等
                for (var onekey in theobj) {
                    if (onekey == key.sdk_type) {
                        //找到了对应的记录，根据filter_key赋值
                        var number;
                        switch (filter_key) {
                            case "play_user":
                            case "play_num":
                            case "start_frame_succ":
                            case "play_failed":
                            case "unhealth_pro":
                                number = key[filter_key];
                                break;
                        }
                        theobj[onekey] = number;
                    }
                }
            }

            newData[item] = theobj;
        }

        /* 输出格式
        {
            "2016-08-22" : {
                "ios" : 3333,
                "android" : 2323,
                "h5_custom" : 2344,
                "h5_native" : 2111,
                "flash" : 333
            }
        }*/

        return [{
            type: type,
            map: map,
            data: newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY: false //柱状图竖着
            }
        }];
    },

    videoKpiThree(data, query, dates) {
        let source = data.first.data,
            count = data.first.count;

        let data2 = [{
            date: "",
            play_user: "",
            play_num: "",
            port_succ: 'play接口成功数',
            port_succ_ratio: 'play接口成功率',
            start_frame_succ: '首帧成功数',
            start_frame_succ_ratio: '首帧成功率',
            stop_play_num: '卡顿播放次数',
            stop_play_num_ratio: '卡顿播放次率',
            play_fluent: '播放流畅数',
            play_fluent_ratio: '播放流畅率',
            port_io_failed: 'play接口IO错误数',
            port_io_failed_ratio: 'play接口IO错误率',
            port_data_failed: 'play接口数据错误数',
            port_data_failed_ratio: 'play接口数据错误率',
            port_overtime: 'play接口超时数',
            port_overtime_ratio: 'play接口超时率',
            play_failed: '播放失败数',
            play_failed_ratio: '播放失败率',
            play_error: '视频错误数',
            play_error_ratio: '视频错误率',
            improper_play: '非正常播放数',
            improper_play_ratio: '非正常播放率'
        }]
        source.forEach(x => {
            x.date = moment(x.date).format('MM月DD日')
            x.port_succ_ratio = util.toFixedLength(x.port_succ, x.play_num, 4)
            x.start_frame_succ_ratio = util.toFixedLength(x.start_frame_succ, x.play_num, 4)
            x.stop_play_num_ratio = util.toFixedLength(x.stop_play_num, x.play_num, 4)
            x.play_fluent_ratio = util.toFixedLength(x.play_fluent, x.play_num, 4)
            x.port_io_failed_ratio = util.toFixedLength(x.port_io_failed, x.play_num, 4)
            x.port_data_failed_ratio = util.toFixedLength(x.port_data_failed, x.play_num, 4)
            x.port_overtime_ratio = util.toFixedLength(x.port_overtime, x.play_num, 4)
            x.play_failed_ratio = util.toFixedLength(x.play_failed, x.play_num, 4)
            x.play_error_ratio = util.toFixedLength(x.play_error, x.play_num, 4)
            x.improper_play_ratio = util.toFixedLength(x.improper_play, x.play_num, 4)

            data2.push(x)
        })


        return util.toTable([data2], data.rows, data.cols, [count]);
    }

};