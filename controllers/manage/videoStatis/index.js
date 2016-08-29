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

    Router = new api(Router , {
        router : "/videoStatis/videoOne",
        modelName : ["VideoPlay"],
        platform : false,
        date_picker_data : 1,
        params : function(query , params , sendData){
            // query.startTime = "2016-08-9";

            params.sdk_app_type = "ALL";
            params.ver = "ALL";
            params.date = util.beforeDate(query.startTime , 3);
            //保存下来传递给过滤函数使用
            query.date = params.date;
            return params;
        },
        rows : [
            ["new_play_num" , "active_user" ],
            ["health_play" , "port_succ" , "start_frame_succ" , "stop_play_num" , "play_fluent"],
            ["unhealth_play" , "port_io_failed" , "port_data_failed" , "port_overtime" , "play_failed" , "play_error" , "improper_play"]
        ],
        cols : [
            [{
                caption : "新增播放次数",
                type    : "number"
            },{
                caption : "活跃用户数",
                type    : "number"
            }],

            [{
                caption : "健康播放统计",
                type    : "string"
            }, {
                caption : "play接口成功数",
                type    : "number"
            }, {
                caption : "首帧成功数",
                type    : "number"
            }, {
                caption : "卡顿播放次数",
                type    : "number"
            }, {
                caption : "播放流畅数",
                type    : "number"
            }],

            [{
                caption : "错误播放统计",
                type    : "string"
            }, {
                caption : "接口IO错误数",
                type    : "number"
            }, {
                caption : "接口数据错误数",
                type    : "number"
            }, {
                caption : "接口超时数",
                type    : "number"
            }, {
                caption : "播放失败数",
                type    : "number"
            }, {
                caption : "视频错误数",
                type    : "number"
            }, {
                caption : "非正常播放数",
                type    : "number"
            }]
        ],
        filter (data , query , params){
            return filter.videoOne(data , query , params);
        }
    });


    Router = new api(Router , {
        router : "/videoStatis/videoTwo",
        modelName : ["VideoPlay"],
        platform : false,
        filter(data , query , dates , type){
            return filter.videoTwo(data , query , dates);
        },
        params : function(query , params){
            // params.date.from = "2016-08-07";
            params.ver = "ALL";
            return params;
        },
        filter_select : [
            {
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
            },{
                title : "指标",
                filter_key : "filter_key",
                groups : [
                    {
                        key : "new_play_num",
                        value:"播放次数"
                    },{
                        key : "health_play",
                        value:"健康播放数"
                    },{
                        key : "health_pro",
                        value:"健康播放概率"
                    },{
                        key : "unhealth_play",
                        value:"错误播放数"
                    },{
                        key : "unhealth_pro",
                        value:"错误播放概率"
                    }
                ]
            }
        ]

    });

    
    Router = new api(Router , {
        router : "/videoStatis/videoThree",
        modelName : ["VideoPlay"],
        platform : false,
        control_table_col : true,
        excel_export : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        params : function(query , params , sendData){
            params.ver = "ALL";
            return params;
        },
        rows : [
            ["date" ,
             "new_play_num" ,
            "port_succ" ,
            "start_frame_succ" , 
            "stop_play_num" ,
            "play_fluent" , 
            "port_io_failed" , 
            "port_data_failed" , 
            "port_overtime" ,
            "play_failed" , 
            "play_error" , 
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
        cols : [
            [{
                caption : "日期",
                type    : "string"
            }, {
                caption : "播放次数",
                type    : "number"
            }, {
                caption : "接口成功数",
                type    : "number"
            }, {
                caption : "首帧成功数",
                type    : "number"
            }, {
                caption : "卡顿播放次数",
                type    : "number"
            },{
                caption : "播放流畅数",
                type    : "number"
            }, {
                caption : "接口IO错误数",
                type    : "number"
            }, {
                caption : "接口数据错误数",
                type    : "number"
            }, {
                caption : "接口超时数",
                type    : "number"
            }, {
                caption : "播放失败数",
                type    : "number"
            },{
                caption : "视频错误数",
                type    : "number"
            }, {
                caption : "非正常播放数",
                type    : "number"
            }


            //增加
            , {
                caption : "接口成功率",
                type    : "string",
                comment : "l-16"
            }, {
                caption : "首帧成功率",
                type    : "string",
                comment : "l-17"
            }, {
                caption : "卡顿播放次率",
                type    : "string",
                comment : "l-18"
            }, {
                caption : "播放流畅率",
                type    : "string",
                comment : "l-19"
            }, {
                caption : "接口IO错误率",
                type    : "string",
                comment : "l-20"
            }, {
                caption : "接口数据错误率",
                type    : "string",
                comment : "l-21"
            }, {
                caption : "接口超时率",
                type    : "string",
                comment : "l-22"
            }, {
                caption : "播放失败率",
                type    : "string",
                comment : "l-23"
            }, {
                caption : "视频错误率",
                type    : "string",
                comment : "l-24"
            }, {
                caption : "非正常播放率",
                type    : "string",
                comment : "l-25"
            }

            ]
        ],
        filter_select : [
            {
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
            }
        ],
        filter (data , query , params){
            return filter.videoThree(data , query , params);
        }
    });

    Router = new api(Router , {
        router : "/videoStatis/videoFour",
        modelName : ["VideoPlay"],
        platform : false,
        version  : true,
        paging : [true],
        excel_export : true,
        date_picker_data : 1,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        params : function(query , params , sendData){
            return params;
        },
       /* filter_select : [
            {
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
            }
        ],*/
        rows : [
            ["date" ,
             "sdk_app_type" ,
            "ver" ,
            "new_play_num" , 
            "5" ,
            "port_succ" , 
            "start_frame_succ" , 
            "stop_play_num" , 
            "play_fluent" ,
            "port_io_failed" , 
            "l-11" ,
            "l-12" ,
            "l-13" ,
            "l-14" ,
            "l-15"]
        ],
        cols : [
            [{
                caption : "日期",
                type    : "date"
            }, {
                caption : "SDK类型",
                type    : "string"
            }, {
                caption : "版本号",
                type    : "string"
            }, {
                caption : "播放次数",
                type    : "number"
            }, {
                caption : "健康播放概率",
                type    : "string"
            },{
                caption : "接口成功数",
                type    : "number"
            }, {
                caption : "首帧成功数",
                type    : "number"
            }, {
                caption : "卡顿播放次数",
                type    : "number"
            }, {
                caption : "播放流畅数",
                type    : "number"
            }, {
                caption : "接口IO错误数",
                type    : "number"
            },{
                caption : "接口数据错误率",
                type    : "string"
            }, {
                caption : "接口超时率",
                type    : "string"
            }, {
                caption : "播放失败率",
                type    : "string"
            }, {
                caption : "视频错误率",
                type    : "string"
            }, {
                caption : "非正常播放率",
                type    : "string"
            }
            ]
        ],
        control_table_col : true,
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
        filter (data , query , params){
            return filter.videoFour(data , query , params);
        }
    });
    

    return Router;
};