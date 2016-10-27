/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview im模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/im/f_index");

module.exports = (Router)=>{

    //数据总览
    Router = new api(Router , {
        router : "/IM/indexOne",
        modelName : ["ImDetail"],
        platform : false,
        date_picker_data : 1,
        showDayUnit: true,
        order : ["-date"],
        params : function(query , params , sendData){            
            let date = utils.beforeDate(params.date.from , 2 , params.day_type);
            params.date = date;
            query.date = date;
            return params;
        },
        rows : [
            [
                "date",
                "single_mess_pv",
                "single_mess_uv",
                "group_mess_lv",
                "set_group_shield_pv",
                "face_load_pv"
            ]
        ],
        cols : [
            [{
                caption : "",
                type    : "string"
            }, {
                caption : "单聊发消息数",
                type    : "number",
                help    : "统计时间内，单聊方式发送的消息数（区别于群聊)"
            }, {
                caption : "单聊发消息人数",
                type    : "number",
                help    : "统计时间内，单聊方式发消息涉及人数（去重)"
            }, {
                caption : "群活跃度",
                type    : "string",
                help    : "统计时间内，群聊发消息数/群成员数(sum(群成员数))"
            }, {
                caption : "设置圈子免打扰次数",
                type    : "number",
                help    : "统计时间内，设置圈子免打扰的次数"
            }, {
                caption : "表情下载次数",
                type    : "number",
            }]
        ],
        filter (data , query , dates){
            return filter.indexOne(data , query , dates);
        }
    });

    //数据趋势
    Router = new api(Router , {
        router : "/IM/indexTwo",
        modelName : ["ImDetail"],
        platform : false,
        order : ["-date"],
        params : function(query , params , sendData){

            return params;
        },
        filter (data , query , dates){
            return filter.indexTwo(data , query , dates);
        }
    });

    //每日明细
    Router = new api(Router , {
        router : "/IM/indexThree",
        modelName : ["ImDetail"],
        platform : false,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        rows : [
            [
                "date",
                "single_mess_pv",
                "single_mess_uv",
                "group_mess_lv",
                "set_group_shield_pv",
                "face_load_pv"
            ]
        ],
        cols : [
            [{
                caption : "日期",
                type    : "string"
            }, {
                caption : "单聊发消息数",
                type    : "number",
                help    : "统计时间内，单聊方式发送的消息数（区别于群聊)"
            }, {
                caption : "单聊发消息人数",
                type    : "number",
                help    : "统计时间内，单聊方式发消息涉及人数（去重)"
            }, {
                caption : "群活跃度",
                type    : "string",
                help    : "统计时间内，群聊发消息数/群成员数(sum(群成员数))"
            }, {
                caption : "设置圈子免打扰次数",
                type    : "number",
                help    : "统计时间内，设置圈子免打扰的次数"
            }, {
                caption : "表情下载次数",
                type    : "number",
            }]
        ],
        params : function(query , params , sendData){

            return params;
        },
        filter (data , query , dates){
            return filter.indexThree(data , query , dates);
        }
    });

    //自定义事件
    Router = new api(Router , {
        router : "/IM/indexFour",
        modelName : ["ImEvent"],
        platform : false,
        date_picker_data : 1,
        showDayUnit: true,
        order : ["-date"],
        rows : [
            [
                "message_event_name",
                "click_uv",
                "click_pv",
                "operating"
            ]
        ],
        cols : [
            [{
                caption : "事件列表",
                type    : "string"
            }, {
                caption : "点击用户",
                type    : "number"
            }, {
                caption : "点击次数",
                type    : "number"
            }, {
                caption : "详情",
                type    : "string",
            }]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        params : function(query , params , sendData){
            return params;
        },
        filter (data , query , dates){
            return filter.indexFour(data , query , dates);
        }
    });

    //表情下载
    Router = new api(Router , {
        router : "/IM/indexFive",
        modelName : ["ImFaceLoad"],
        platform : false,
        date_picker_data : 1,
        showDayUnit: true,
        order : ["-date"],
        rows : [
            [
                "face_id",
                "load_uv",
                "load_pv",
                "operating"
            ]
        ],
        cols : [
            [{
                caption : "表情名称",
                type    : "string"
            }, {
                caption : "下载人数",
                type    : "number"
            }, {
                caption : "下载次数",
                type    : "number"
            }, {
                caption : "趋势",
                type    : "string",
            }]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        params : function(query , params , sendData){
            return params;
        },
        filter (data , query , dates){
            return filter.indexFive(data , query , dates);
        }
    });

     //群活跃排行
    Router = new api(Router , {
        router : "/IM/indexSix",
        modelName : ["ImGroupActive"],
        platform : false,
        date_picker_data : 1,
        showDayUnit: true,
        order : ["-date"],
        rows : [
            [
                "group_name",
                "group_member_count",
                "group_mess_pv",
                "group_mess_lv"
            ]
        ],
        cols : [
            [{
                caption : "圈子名称",
                type    : "string"
            }, {
                caption : "群成员数",
                type    : "number"
            }, {
                caption : "群消息数",
                type    : "number"
            }, {
                caption : "群活跃度",
                type    : "string",
            }]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        params : function(query , params , sendData){
            return params;
        },
        filter (data , query , dates){
            return filter.indexSix(data , query , dates);
        }
    });


    return Router;
}