/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    util = require("../../../utils"),
    filter = require("../../../filters/videoStatis");

module.exports = (Router) => {

    Router = new api(Router, {
        router: "/videoStatis/videoOne",
        modelName: ["VideoPlay"],
        platform: false,
        date_picker_data: 1,
        showDayUnit: true,
        order: ["-date"],
        params: function (query, params, sendData) {

            params.sdk_app_type = "ALL";
            params.ver = "ALL";
            params.date = util.beforeDate(query.startTime, 2, query.day_type);

            //保存下来传递给过滤函数使用
            query.date = params.date;
            return params;
        },
        rows: [
            ["sid_num" /*, "active_user" */],
            ["health_play", "port_succ", "start_frame_succ", "stop_play_num", "play_fluent"],
            ["unhealth_play", "port_io_failed", "port_data_failed", "port_overtime", "play_failed", "play_error", "improper_play"]
        ],
        cols: [
            [{
                caption: "播放次数",
                type: "number"
            }/*,{
                caption : "活跃用户数",
                type    : "number"
            }*/],

            [{
                caption: "健康播放统计",
                type: "string"
            }, {
                caption: "play接口成功数",
                type: "number",
                help: "视频请求play接口成功"
            }, {
                caption: "首帧成功数",
                type: "number",
                help: "视频获取首帧成功"
            }, {
                caption: "卡顿播放次数",
                type: "number",
                help: "视频卡的视频"
            }, {
                caption: "播放流畅数",
                type: "number",
                help: "'视频一次没有卡的视频"
            }],

            [{
                caption: "错误播放统计",
                type: "string"
            }, {
                caption: "接口IO错误数",
                type: "number",
                help: "视频play接口io错误"
            }, {
                caption: "接口数据错误数",
                type: "number",
                help: "视频play接口数据错误"
            }, {
                caption: "接口超时数",
                type: "number",
                help: "视频play接口超时"
            }, {
                caption: "播放失败数",
                type: "number",
                help: "播放视频渲染失败的视频"
            }, {
                caption: "视频错误数",
                type: "number",
                help: "视频出现错误等级error的视频"
            }, {
                caption: "非正常播放数",
                type: "number",
                help: "视频出现错误等级warn的视频"
            }]
        ],
        filter(data, query, dates) {
            return filter.videoOne(data, query, dates);
        }
    });


    Router = new api(Router, {
        router: "/videoStatis/videoTwo",
        modelName: ["VideoPlay"],
        platform: false,
        filter(data, query, dates, type) {
            return filter.videoTwo(data, query, dates);
        },
        params: function (query, params) {
            params.ver = "ALL";
            return params;
        },
        filter_select: [
            /*{
                title : "SDK选择",
                filter_key : "sdk_app_type",
                groups : [
                    {
                        key : ["ALL"],
                        value:"全部SDK"
                    },{
                        key : "ios" ,
                        value: "IOS"
                    },{
                        key : "android",
                        value: "android"
                    },{
                        key : "h5_custom",
                        value: "h5_custom"
                    },{
                        key : "h5_native",
                        value: "h5_native"
                    },{
                        key : "flash",
                        value: "flash"
                    }
                ]
            },*/{
                title: "指标",
                filter_key: "filter_key",
                groups: [
                    {
                        key: "sid_num",
                        value: "播放次数"
                    }, {
                        key: "health_play",
                        value: "健康播放数"
                    }, {
                        key: "health_pro",
                        value: "健康播放概率(%)"
                    }, {
                        key: "unhealth_play",
                        value: "错误播放数"
                    }, {
                        key: "unhealth_pro",
                        value: "错误播放概率(%)"
                    }
                ]
            }
        ]

    });


    Router = new api(Router, {
        router: "/videoStatis/videoThree",
        modelName: ["VideoPlay"],
        platform: false,
        control_table_col: true,
        excel_export: true,
        paging: [true],
        order: ["-date"],
        flexible_btn: [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        params: function (query, params, sendData) {
            params.ver = "ALL";
            return params;
        },
        rows: [
            ["date",
                "sid_num",
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
                //add
                "l-16",
                "l-17",
                "l-18",
                "l-19",
                "l-20",
                "l-21",
                "l-22",
                "l-23",
                "l-24",
                "l-25"
            ]
        ],
        cols: [
            [{
                caption: "日期",
                type: "string"
            }, {
                caption: "播放次数",
                type: "number",
                help: "某视频只要播放过次数"
            }, {
                caption: "接口成功数",
                type: "number",
                help: "视频请求play接口成功"
            }, {
                caption: "首帧成功数",
                type: "number",
                help: "视频获取首帧成功"
            }, {
                caption: "卡顿播放次数",
                type: "number",
                help: "视频卡的视频"
            }, {
                caption: "播放流畅数",
                type: "number",
                help: "视频一次没有卡的视频"
            }, {
                caption: "接口IO错误数",
                type: "number",
                help: "视频play接口io错误"
            }, {
                caption: "接口数据错误数",
                type: "number",
                help: "视频play接口数据错误"
            }, {
                caption: "接口超时数",
                type: "number",
                help: "视频play接口超时"
            }, {
                caption: "播放失败数",
                type: "number",
                help: "播放视频渲染失败的视频"
            }, {
                caption: "视频错误数",
                type: "number",
                help: "视频出现错误等级error的视频"
            }, {
                caption: "非正常播放数",
                type: "number",
                help: "视频出现错误等级warn的视频"
            }


                //增加
                , {
                caption: "接口成功率",
                type: "string",
                comment: "l-16",
                help: "视频请求play接口成功"
            }, {
                caption: "首帧成功率",
                type: "string",
                comment: "l-17",
                help: "视频获取首帧成功"
            }, {
                caption: "卡顿播放次率",
                type: "string",
                comment: "l-18",
                help: "视频卡的视频"
            }, {
                caption: "播放流畅率",
                type: "string",
                comment: "l-19",
                help: "视频一次没有卡的视频"
            }, {
                caption: "接口IO错误率",
                type: "string",
                comment: "l-20",
                help: "视频play接口io错误"
            }, {
                caption: "接口数据错误率",
                type: "string",
                comment: "l-21",
                help: "视频play接口数据错误"
            }, {
                caption: "接口超时率",
                type: "string",
                comment: "l-22",
                help: "视频play接口超时"
            }, {
                caption: "播放失败率",
                type: "string",
                comment: "l-23",
                help: "播放视频渲染失败的视频"
            }, {
                caption: "视频错误率",
                type: "string",
                comment: "l-24",
                help: "视频出现错误等级error的视频"
            }, {
                caption: "非正常播放率",
                type: "string",
                comment: "l-25",
                help: "视频出现错误等级warn的视频"
            }

            ]
        ],
        filter_select: [
            {
                title: "SDK选择",
                filter_key: "sdk_app_type",
                groups: [
                    {
                        key: ["ALL"],
                        value: "全部SDK"
                    }, {
                        key: "ios",
                        value: "IOS"
                    }, {
                        key: "android",
                        value: "android"
                    }, {
                        key: "h5_custom",
                        value: "h5_custom"
                    }, {
                        key: "h5_native",
                        value: "h5_native"
                    }, {
                        key: "flash",
                        value: "flash"
                    }
                ]
            }
        ],
        filter(data, query, params) {
            return filter.videoThree(data, query, params);
        }
    });

    Router = new api(Router, {
        router: "/videoStatis/videoVersionOne",
        modelName: [""],
        platform: false,
        paging: [false],
        order: ["-date"],
        excel_export: true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        global_platform: {
            show: true,
            key: 'type',
            name: '视频类型: ',
            list: [{
                key: 'videoplay',
                name: '点播'
            }, {
                key: 'livevideo',
                name: '直播'
            }]
        },
        params: function (query, params) {
            
            return params;
        },
        firstSql(query, params, isCount) {
            let date_type_list = ['', 'DAY', 'WEEK', 'MONTH']
            let config = ["date BETWEEN ? AND ?", "day_type=?"],
                param = [query.startTime, query.endTime, query.day_type || 1],
                sql = '',
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }

            if (query.ver && query.ver !== 'ALL') {
                config.push('ver=?')
                param.push(query.ver)
            }

            if (query.sdk_type && query.sdk_type !== 'ALL') {
                config.push('sdk_type = ?')
                param.push(query.sdk_type)
            }

            sql = `SELECT *
                FROM ${tablename} 
                WHERE day_type=1 and sdk_type != 'ALL' and ver != 'ALL' 
                and ${config.join(" AND ")} group by date,sdk_type order by date desc`;

            return {
                sql: sql,
                params: param
            };
        },
        //初始化一级分类选项
        selectFilter(req, cb) {
            var filter_select = {
                title: "版本号",
                filter_key: "ver",
                groups: [{
                    key: "ALL",
                    value: "ALL"
                }]
            };

            req.models.ads2_videoplay_overview2.find({day_type: 1}, (err, data) => {
                if (!err) {
                    for (var key of data) {
                        var obj = {
                            key: key.ver,
                            value: key.ver
                        }
                        if (filter_select.groups.every(x => x.key !== obj.key)) {
                            filter_select.groups.push(obj);
                        }
                    }
                    if (this.filter_select[1]) {
                        this.filter_select[1] = filter_select;
                    } else {
                        this.filter_select.push(filter_select);
                    }
                    cb(null, this.filter_select);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: "SDK选择",
                filter_key: "sdk_type",
                groups: [
                    {
                        key: "ALL",
                        value: "全部SDK"
                    }, {
                        key: "ios",
                        value: "IOS"
                    }, {
                        key: "android",
                        value: "android"
                    }, {
                        key: "h5_custom",
                        value: "h5_custom"
                    }, {
                        key: "h5_native",
                        value: "h5_native"
                    }, {
                        key: "flash",
                        value: "flash"
                    }
                ]
            }
        ],
        rows: [
            [
                "date",
                "sdk_type",
                "ver",
                "play_user",
                "play_num",
                "first_load_num",

                //健康播放统计
                "port_succ",
                "port_succ_ratio",
                "start_frame_succ",
                "start_frame_succ_ratio",
                "stop_play_num",
                "stop_play_num_ratio",
                "play_fluent",
                "play_fluent_ratio",

                //错误播放统计
                "port_io_failed",
                "port_io_failed_ratio",
                "port_data_failed",
                "port_data_failed_ratio",
                "port_overtime",
                "port_overtime_ratio",
                "play_failed",
                "play_failed_ratio",
                "play_error",
                "play_error_ratio",
                "improper_play",
                "improper_play_ratio"
            ]
        ],
        cols: [
            [
                {
                    caption: "日期",
                    type: "string"
                }, {
                    caption: "SDK类型",
                    type: "string"
                }, {
                    caption: "版本",
                    type: "string"
                }, {
                    caption: "播放用户数",
                    type: "number",
                    help: "视频播放用户数"
                }, {
                    caption: "播放次数",
                    type: "number",
                    help: "视频播放次数"
                },{
                    caption: "有效播放次数",
                    type: "number"
                },

                //健康播放统计
                {
                    caption: "play接口成功数",
                    type: "string",
                    help : "视频请求play接口成功"
                },  {
                    caption: "play接口成功率",
                    type: "string",
                    help : "play接口成功数率≥0"
                },{
                    caption: "首帧成功数",
                    type: "string",
                    help : "视频获取首帧成功"
                }, {
                    caption: "首帧成功率",
                    type: "string",
                    help : "首帧成功率≥0"
                },{
                    caption: "卡顿播放次数",
                    type: "string",
                    help : "视频出现卡顿"
                },{
                    caption: "卡顿播放次率",
                    type: "string",
                    help : "卡顿播放率≥0"
                }, {
                    caption: "播放流畅数",
                    type: "string",
                    help : "一次没有卡的视频"
                }, {
                    caption: "播放流畅率",
                    type: "string",
                    help : "播放流畅率≤1"
                },
                //错误播放统计
                {
                    caption: "play接口IO错误数",
                    type: "string",
                    help : "视频play接口io错误"
                }, {
                    caption: "play接口IO错误率",
                    type: "string",
                    help : "play接口IO错误率≤1"
                }, {
                    caption: "play接口数据错误数",
                    type: "string",
                    help : "视频play接口数据错误"
                }, {
                    caption: "play接口数据错误率",
                    type: "string",
                    help : "play接口数据错误率≤1"
                }, {
                    caption: "play接口超时数",
                    type: "string",
                    help : "视频play接口超时"
                },{
                    caption: "play接口超时率",
                    type: "string",
                    help : "play接口超时率≤1"
                }, {
                    caption: "播放失败数",
                    type: "string",
                    help : "播放视频渲染失败的视频"
                },{
                    caption: "播放失败率",
                    type: "string",
                    help : "播放失败率≥0"
                }, {
                    caption: "视频错误数",
                    type: "string",
                    help : "出现错误等级error的视频"
                },{
                    caption: "视频错误率",
                    type: "string",
                    help : "视频错误率≥0"
                }, {
                    caption: "非正常播放数",
                    type: "string`",
                    help : "出现错误等级warn的视频"
                }, {
                    caption: "非正常播放率",
                    type: "string",
                    help : "非正常播放率≥0"
                }
            ]
        ],
        control_table_col: true,
        /*filter_select : [
            {
                title : "指标",
                filter_key : "filter_key",
                groups : [
                    {
                        key : "one",
                        value:"健康播放数"
                    },{
                        key : "ios" ,
                        value: "健康播放概率"
                    },{
                        key : "android",
                        value: "错误播放数"
                    },{
                        key : "h5_custom",
                        value: "错误播放概率"
                    }
                ]
            }
        ],*/
        filter(data, query, dates) {
            return filter.videoVersionOne(data, query, dates);
        }
    });

    Router = new api(Router, {
        router: "/videoStatis/videoKpiOne",
        modelName: ["", "", ""],
        platform: false,
        filter(data, query, dates, type) {
            return filter.videoKpiOne(data, query, dates);
        },
        params: function (query, params) {
            return params;
        },
        firstSql(query, params, isCount) {
            let date_type_list = ['', 'DAY', 'WEEK', 'MONTH']
            let config = ["date BETWEEN ? AND ?", "day_type=?", "sdk_type=?"],
                param = [query.startTime, query.endTime, query.day_type || 1, "ALL"],
                sql = '',
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }

            sql = `SELECT play_user, play_num
                FROM ${tablename} 
                WHERE ${config.join(" AND ")}`;

            return {
                sql: sql,
                params: param
            };
        },
        secondSql(query, params, isCount) {
            let date_type_list = ['', 'DAY', 'WEEK', 'MONTH']
            let config = ["a.date BETWEEN ? AND ?", "a.day_type=?", "a.sdk_type=?"],
                param = [query.startTime, query.endTime, query.day_type || 1, "ALL"],
                sql = '',
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }
            sql = `SELECT 
                    a.play_num as play_num, a.port_succ as port_succ, a.start_frame_succ as start_frame_succ, a.stop_play_num as stop_play_num, a.play_fluent as play_fluent, a.start_load_num as start_load_num,
                    b.port_succ as port_succ_pre, b.start_frame_succ as start_frame_succ_pre, b.stop_play_num as stop_play_num_pre, b.play_fluent as play_fluent_pre
                        FROM ${tablename} a
                         LEFT JOIN ${tablename} b 
                        on a.day_type = b.day_type and b.sdk_type='ALL' and b.date = DATE_ADD(a.date,INTERVAL -1 ${date_type_list[query.day_type || 1]})
                        WHERE ${config.join(" AND ")}`;
            return {
                sql: sql,
                params: param
            };
        },
        thirdSql(query, params, isCount) {
            let date_type_list = ['', 'DAY', 'WEEK', 'MONTH']
            let config = ["a.date BETWEEN ? AND ?", "a.day_type=?", "a.sdk_type=?"],
                param = [query.startTime, query.endTime, query.day_type || 1, "ALL"],
                sql = '',
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }
            sql = `SELECT 
                    a.play_num as play_num, a.port_io_failed as port_io_failed, a.port_data_failed as port_data_failed, a.port_overtime as port_overtime, a.port_overtime as port_overtime, a.play_failed as play_failed, a.play_error as play_error, a.improper_play as improper_play,
                    b.port_io_failed as port_io_failed_pre, b.port_data_failed as port_data_failed_pre, b.port_overtime as port_overtime_pre, b.port_overtime as port_overtime_pre, b.play_failed as play_failed_pre, b.play_error as play_error_pre, b.improper_play as improper_play_pre
                        FROM ${tablename} a
                         LEFT JOIN ${tablename} b 
                        on a.day_type = b.day_type and b.sdk_type='ALL' and b.date = DATE_ADD(a.date,INTERVAL -1 ${date_type_list[query.day_type || 1]})
                        WHERE ${config.join(" AND ")}`;
            return {
                sql: sql,
                params: param
            };
        },
        date_picker_data: 1,
        showDayUnit: true,
        global_platform: {
            show: true,
            key: 'type',
            name: '视频类型: ',
            list: [{
                key: 'videoplay',
                name: '点播'
            }, {
                key: 'livevideo',
                name: '直播'
            }]
        },
        rows: [
            ['play_user', 'play_num'],
            ['index', 'port_succ', 'start_frame_succ', 'stop_play_num', 'play_fluent', ],
            ['index', 'port_io_failed', 'port_data_failed', 'port_overtime', 'play_failed', 'play_error', 'improper_play']
        ],
        cols: [
            [
                {
                    caption: "",
                    type: "string"
                },
                {
                    caption: "",
                    type: "string"
                }
            ],
            [
                {
                    caption: "健康播放统计",
                    type: "string"
                },
                {
                    caption: "play接口成功数",
                    help : "视频请求play接口成功"
                },
                {
                    caption: "首帧成功数",
                    help : "视频获取首帧成功"
                },
                {
                    caption: "卡顿播放次数",
                    help : "直播视频出现卡顿"
                },
                {
                    caption: "播放流畅数",
                    help : "一次没有卡的视频"
                }
            ],
            [
                {
                    caption: "错误播放统计",
                    type: "string"
                },
                {
                    caption: "接口IO错误数",
                    help : "视频接口io错误"
                },
                {
                    caption: "接口数据错误数",
                    help : "视频接口数据错误"
                },
                {
                    caption: "接口超时数",
                    help : "视频接口超时"
                },
                {
                    caption: "播放失败数",
                    help : "播放视频渲染失败的直播视频"
                },
                {
                    caption: "视频错误数",
                    help : "出现错误等级error的视频"
                },
                {
                    caption: "非正常播放数",
                    help : "出现错误等级warn的视频"
                }
            ]
        ]
    });

    Router = new api(Router, {
        router: "/videoStatis/videoKpiTwo",
        modelName: ["VideoPlay"],
        platform: false,
        filter(data, query, dates, type) {
            return filter.videoKpiTwo(data, query, dates);
        },
        params: function (query, params) {
            return params;
        },
        firstSql(query, params, isCount) {
            let config = ["date BETWEEN ? AND ?", "day_type=?"],
                param = [query.startTime, query.endTime, query.day_type || 1],
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }

            let sql = `SELECT play_user, play_num, start_frame_succ, play_failed, date, sdk_type
                    FROM ${tablename}
                    WHERE day_type='1' and ${config.join(" AND ")}`;

            return {
                sql: sql,
                params: param
            };
        },
        filter_select: [
            {
                title: "SDK选择",
                filter_key: "sdk_app_type",
                groups: [
                    {
                        key: "ALL",
                        value: "全部SDK"
                    }, {
                        key: "ios",
                        value: "IOS"
                    }, {
                        key: "android",
                        value: "android"
                    }, {
                        key: "h5_custom",
                        value: "h5_custom"
                    }, {
                        key: "h5_native",
                        value: "h5_native"
                    }, {
                        key: "flash",
                        value: "flash"
                    }
                ]
            },
            {
                title: "指标选择",
                filter_key: "filter_key",
                groups: [
                    {
                        key: "play_user",
                        value: "播放用户数"
                    }, {
                        key: "play_num",
                        value: "播放次数"
                    }, {
                        key: "start_frame_succ",
                        value: "首帧成功数"
                    }, {
                        key: "play_failed",
                        value: "播放失败数"
                    }
                ]
            }
        ]
    });
    Router = new api(Router, {
        router: "/videoStatis/videoKpiThree",
        modelName: ["VideoPlay"],
        platform: false,
        control_table_col: true,
        excel_export: true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter(data, query, dates, type) {
            return filter.videoKpiThree(data, query, dates);
        },
        params: function (query, params) {
            params.sdk_type = 'ALL'
            return params;
        },
        firstSql(query, params, isCount) {
            let config = ["date BETWEEN ? AND ?", "day_type=?", "ver=?"],
                param = [query.startTime, query.endTime, query.day_type || 1, 'ALL'],
                tablename = 'ads2_videoplay_overview2';

            if (query.type) {
                tablename = query.type === 'livevideo' ? 'ads2_livevideo_overview2' : 'ads2_videoplay_overview2'
            }

            if (query.sdk_type) {
                config.push('sdk_type = ?')
                param.push(query.sdk_type)
            }

            let sql = `SELECT *
                    FROM ${tablename}
                    WHERE ${config.join(" AND ")} group by date order by date desc`;

            return {
                sql: sql,
                params: param
            };
        },
        filter_select: [
            {
                title: "SDK选择",
                filter_key: "sdk_type",
                groups: [
                    {
                        key: "ALL",
                        value: "全部SDK"
                    }, {
                        key: "ios",
                        value: "IOS"
                    }, {
                        key: "android",
                        value: "android"
                    }, {
                        key: "h5_custom",
                        value: "h5_custom"
                    }, {
                        key: "h5_native",
                        value: "h5_native"
                    }, {
                        key: "flash",
                        value: "flash"
                    }
                ]
            }
        ],
        rows: [[
            "date", "play_user", "play_num", "first_load_num", 'port_succ', 'port_succ_ratio', 'start_frame_succ', 'start_frame_succ_ratio', 'stop_play_num', 'stop_play_num_ratio', 'play_fluent', 'play_fluent_ratio',
            'port_io_failed', 'port_io_failed_ratio', 'port_data_failed', 'port_data_failed_ratio', 'port_overtime', 'port_overtime_ratio', 'play_failed', 'play_failed_ratio', 'play_error', 'play_error_ratio', 'improper_play', 'improper_play_ratio'
        ]],
        cols: [[
            {
                caption: "日期",
                type: "string"
            },
            {
                caption: "播放用户数",
                type: "number",
                help : "视频播放用户数"
            },
            {
                caption: "播放次数",
                type: "number",
                help : "视频播放次数"
            },
            {
                caption: "有效播放次数",
                type: "number"
            },
            // 健康播放统计
            {
                caption: "play接口成功数",
                type: "string",
                help : "视频请求play接口成功"
            },
            {
                caption: "play接口成功率",
                type: "string",
                help : "play接口成功数率≥0"
            },
            {
                caption: "首帧成功数",
                type: "string",
                help : "视频获取首帧成功"
            },
            {
                caption: "首帧成功率",
                type: "string",
                help : "首帧成功率≥0"
            },
            {
                caption: "卡顿播放次数",
                type: "string",
                help : "频出现卡顿"
            },
            {
                caption: "卡顿播放率",
                type: "string",
                help : "卡顿播放率≥0"
            },
            {
                caption: "播放流畅数",
                type: "string",
                help : "一次没有卡的视频"
            },
            {
                caption: "播放流畅率",
                type: "string",
                help : "播放流畅率≤1"
            },
            // 错误播放统计
            {
                caption: "play接口IO错误数",
                type: "string",
                help : "视频play接口io错误"
            }, {
                caption: "play接口IO错误率",
                type: "string",
                help : "play接口IO错误率≤1"
            }, {
                caption: "play接口数据错误数",
                type: "string",
                help : "视频play接口数据错误"
            }, {
                caption: "play接口数据错误率",
                type: "string",
                help : "play接口数据错误率≤1"
            }, {
                caption: "play接口超时数",
                type: "string",
                help : "视频play接口超时"
            }, {
                caption: "play接口超时率",
                type: "string",
                help : "play接口超时率≤1"
            }, {
                caption: "播放失败数",
                type: "string",
                help : "播放视频渲染失败的视频"
            }, {
                caption: "播放失败率",
                type: "string",
                help : "播放失败率≥0"
            }, {
                caption: "视频错误数",
                type: "string",
                help : "出现错误等级error的视频"
            }, {
                caption: "视频错误率",
                type: "string",
                help : "直播视频错误率≥0"
            }, {
                caption: "非正常播放数",
                type: "string",
                help : "出现错误等级warn的视频"
            }, {
                caption: "非正常播放率",
                type: "string",
                help : "非正常播放率≥0"
            },
        ]]
    });


    return Router;
};