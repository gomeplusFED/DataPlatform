/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview im模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/im/f_event");

module.exports = (Router)=>{

    //数据趋势
    Router = new api(Router , {
        router : "/IM/eventOne",
        modelName : ["ImEvent"],
        platform : false,
        order : ["-date"],
        params : function(query , params , sendData){
            return params;
        },
        filter (data , query , dates){
            return filter.EventOne(data , query , dates);
        }
    });

    //数据详情
    Router = new api(Router , {
        router : "/IM/eventTwo",
        modelName : ["ImEvent"],
        platform : false,
        order : ["-date"],
        rows : [
            [
                "date",
                "click_uv",
                "click_pv",
                "click_lv"
            ]
        ],
        cols : [
            [{
                caption : "日期",
                type    : "string"
            }, {
                caption : "点击用户",
                type    : "number"
            }, {
                caption : "点击次数",
                type    : "number",
            }, {
                caption : "点击次数/点击用户",
                type    : "string",
            }]
        ],
        params : function(query , params , sendData){
            console.log(123);
            return params;
        },
        filter (data , query , dates){
            return filter.EventTwo(data , query , dates);
        }
    });

    return Router;
}