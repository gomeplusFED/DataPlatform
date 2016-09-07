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
        showDayUnit: true,
        params : function(query , params , sendData){

            params.sdk_app_type = "ALL";
            params.ver = "ALL";
            params.date = util.beforeDate(query.startTime , 2 , query.day_type);
            
            //保存下来传递给过滤函数使用
            query.date = params.date;
            return params;
        },
        rows : [
            ["sid_num" /*, "active_user" */],
            ["health_play" , "port_succ" , "start_frame_succ" , "stop_play_num" , "play_fluent"],
            ["unhealth_play" , "port_io_failed" , "port_data_failed" , "port_overtime" , "play_failed" , "play_error" , "improper_play"]
        ],
        cols : [
            [{
                caption : "播放次数",
                type    : "number"
            }/*,{
                caption : "活跃用户数",
                type    : "number"
            }*/],

            [{
                caption : "健康播放统计",
                type    : "string"
            }, {
                caption : "play接口成功数",
                type    : "number",
                help    : "视频请求play接口成功"
            }, {
                caption : "首帧成功数",
                type    : "number",
                help    : "视频获取首帧成功"
            }, {
                caption : "卡顿播放次数",
                type    : "number",
                help    : "视频卡的视频"
            }, {
                caption : "播放流畅数",
                type    : "number",
                help    : "'视频一次没有卡的视频"
            }],

            [{
                caption : "错误播放统计",
                type    : "string"
            }, {
                caption : "接口IO错误数",
                type    : "number",
                help    : "视频play接口io错误"
            }, {
                caption : "接口数据错误数",
                type    : "number",
                help    : "视频play接口数据错误"
            }, {
                caption : "接口超时数",
                type    : "number",
                help    : "视频play接口超时"
            }, {
                caption : "播放失败数",
                type    : "number",
                help    : "播放视频渲染失败的视频"
            }, {
                caption : "视频错误数",
                type    : "number",
                help    : "视频出现错误等级error的视频"
            }, {
                caption : "非正常播放数",
                type    : "number",
                help    : "视频出现错误等级warn的视频"
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
            params.ver = "ALL";
            return params;
        },
        filter_select : [
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
                title : "指标",
                filter_key : "filter_key",
                groups : [
                    {
                        key : "sid_num",
                        value:"播放次数"
                    },{
                        key : "health_play",
                        value:"健康播放数"
                    },{
                        key : "health_pro",
                        value:"健康播放概率(%)"
                    },{
                        key : "unhealth_play",
                        value:"错误播放数"
                    },{
                        key : "unhealth_pro",
                        value:"错误播放概率(%)"
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
        paging : [true],
        order : ["-date"],
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
             "sid_num" ,
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
                type    : "number",
                help    : "某视频只要播放过次数"
            }, {
                caption : "接口成功数",
                type    : "number",
                help    : "视频请求play接口成功"
            }, {
                caption : "首帧成功数",
                type    : "number",
                help    : "视频获取首帧成功"
            }, {
                caption : "卡顿播放次数",
                type    : "number",
                help    : "视频卡的视频"
            },{
                caption : "播放流畅数",
                type    : "number",
                help    : "视频一次没有卡的视频"
            }, {
                caption : "接口IO错误数",
                type    : "number",
                help    : "视频play接口io错误"
            }, {
                caption : "接口数据错误数",
                type    : "number",
                help    : "视频play接口数据错误"
            }, {
                caption : "接口超时数",
                type    : "number",
                help    : "视频play接口超时"
            }, {
                caption : "播放失败数",
                type    : "number",
                help    : "播放视频渲染失败的视频"
            },{
                caption : "视频错误数",
                type    : "number",
                help    : "视频出现错误等级error的视频"
            }, {
                caption : "非正常播放数",
                type    : "number",
                help    : "视频出现错误等级warn的视频"
            }


            //增加
            , {
                caption : "接口成功率",
                type    : "string",
                comment : "l-16",
                help    : "视频请求play接口成功"
            }, {
                caption : "首帧成功率",
                type    : "string",
                comment : "l-17",
                help    : "视频获取首帧成功"
            }, {
                caption : "卡顿播放次率",
                type    : "string",
                comment : "l-18",
                help    : "视频卡的视频"
            }, {
                caption : "播放流畅率",
                type    : "string",
                comment : "l-19",
                help    : "视频一次没有卡的视频"
            }, {
                caption : "接口IO错误率",
                type    : "string",
                comment : "l-20",
                help    : "视频play接口io错误"
            }, {
                caption : "接口数据错误率",
                type    : "string",
                comment : "l-21",
                help    : "视频play接口数据错误"
            }, {
                caption : "接口超时率",
                type    : "string",
                comment : "l-22",
                help    : "视频play接口超时"
            }, {
                caption : "播放失败率",
                type    : "string",
                comment : "l-23",
                help    : "播放视频渲染失败的视频"
            }, {
                caption : "视频错误率",
                type    : "string",
                comment : "l-24",
                help    : "视频出现错误等级error的视频"
            }, {
                caption : "非正常播放率",
                type    : "string",
                comment : "l-25",
                help    : "视频出现错误等级warn的视频"
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
        paging : [false],
        order : ["-date"],
        excel_export : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        params : function(query , params , sendData){
            if(params.ver == "ALL"){
                delete params.ver;
            }
            if(params.sdk_app_type == "ALL"){
                params.sdk_app_type = ["ios" , "android" , "h5_custom" , "h5_native" , "flash"];
            }
            return params;
        },
        //初始化一级分类选项
        selectFilter(req , cb){
            var filter_select = {
                title : "版本号",
                filter_key : "ver",
                groups : [{
                    key : "ALL",
                    value:"ALL"
                }]
            };

            req.models.AdsKeyValue.find({
                "key_name" : "video_version"
            }, (err , data)=>{
                if(!err){
                    for(var key of data){
                        var obj = {
                            key : key.values1,
                            value:key.values1
                        }
                        filter_select.groups.push(obj);
                    }
                    if(this.filter_select[1]){
                        this.filter_select[1] = filter_select;
                    }else{
                        this.filter_select.push(filter_select);
                    }
                    cb(null,this.filter_select);
                }else{
                    cb(err);
                }
            });
        },
        filter_select : [
            {
                title : "SDK选择",
                filter_key : "sdk_app_type",
                groups : [
                    {
                        key : "ALL",
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
        rows : [
            [
                "date" ,
                "sdk_app_type" ,
                "ver" ,
                "sid_num" , 
                "5" ,

                //健康播放统计
                "port_succ" , 
                "start_frame_succ" , 
                "stop_play_num" , 
                "play_fluent" ,

                //健康播放概率
                "port_succ_lv" , 
                "start_frame_succ_lv" , 
                "stop_play_num_lv" , 
                "play_fluent_lv" ,

                //错误播放统计
                "port_io_failed" , 
                "port_data_failed" ,
                "port_overtime" ,
                "play_failed" ,
                "play_error" ,
                "improper_play" ,

                //错误播放概率
                "port_io_failed_lv" , 
                "port_data_failed_lv" ,
                "port_overtime_lv" ,
                "play_failed_lv" ,
                "play_error_lv" ,
                "improper_play_lv" ,
            ]
        ],
        cols : [
            [
                {
                    caption : "日期",
                    type    : "string"
                }, {
                    caption : "SDK类型",
                    type    : "string"
                }, {
                    caption : "版本号",
                    type    : "string"
                }, {
                    caption : "播放次数",
                    type    : "number",
                    help    : "某视频只要播放过次数"
                }, {
                    caption : "健康播放概率",
                    type    : "string",
                },

                //健康播放统计
                {
                    caption : "接口成功数",
                    type    : "number",
                    help    : "视频请求play接口成功"
                }, {
                    caption : "首帧成功数",
                    type    : "number",
                    help    : "视频获取首帧成功"
                }, {
                    caption : "卡顿播放次数",
                    type    : "number",
                    help    : "视频卡的视频"
                }, {
                    caption : "播放流畅数",
                    type    : "number",
                    help    : "视频一次没有卡的视频"
                }, 

                //健康播放概率
                {
                    caption : "接口成功率",
                    type    : "string",
                    help    : "视频请求play接口成功"
                }, {
                    caption : "首帧成功率",
                    type    : "string",
                    help    : "视频获取首帧成功"
                }, {
                    caption : "卡顿播放率",
                    type    : "string",
                    help    : "视频卡的视频"
                }, {
                    caption : "播放流畅率",
                    type    : "string",
                    help    : "视频一次没有卡的视频"
                },

                //错误播放统计
                {
                    caption : "接口IO错误数",
                    type    : "number",
                    help    : "视频play接口io错误"
                },{
                    caption : "接口数据错误数",
                    type    : "number",
                    help    : "视频play接口数据错误"
                }, {
                    caption : "接口超时数",
                    type    : "number",
                    help    : "视频play接口超时"
                }, {
                    caption : "播放失败数",
                    type    : "number",
                    help    : "播放视频渲染失败的视频"
                }, {
                    caption : "视频错误数",
                    type    : "number",
                    help    : "视频出现错误等级error的视频"
                }, {
                    caption : "非正常播放数",
                    type    : "number",
                    help    : "视频出现错误等级warn的视频"
                }, 

                //错误播放概率
                {
                    caption : "接口IO错误率",
                    type    : "string",
                    help    : "视频play接口io错误"
                }, {
                    caption : "接口数据错误率",
                    type    : "string",
                    help    : "视频play接口数据错误"
                }, {
                    caption : "接口超时率",
                    type    : "string",
                    help    : "视频play接口超时"
                }, {
                    caption : "播放失败率",
                    type    : "string",
                    help    : "播放视频渲染失败的视频"
                }, {
                    caption : "视频错误率",
                    type    : "string",
                    help    : "视频出现错误等级error的视频"
                }, {
                    caption : "非正常播放率",
                    type    : "string",
                    help    : "视频出现错误等级warn的视频"
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
        filter (data , query , dates){
            return filter.videoFour(data , query , dates);
        }
    });
    

    return Router;
};