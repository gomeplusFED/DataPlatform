/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview im模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/im/f_face");

module.exports = (Router)=>{

    //数据趋势
    Router = new api(Router , {
        router : "/IM/faceOne",
        modelName : ["ImFaceLoad"],
        platform : false,
        order : ["-date"],
        params : function(query , params , sendData){
            return params;
        },
        filter (data , query , dates){
            return filter.FaceOne(data , query , dates);
        }
    });

    //数据详情
    Router = new api(Router , {
        router : "/IM/faceTwo",
        modelName : ["ImFaceLoad"],
        platform : false,
        order : ["-date"],
        rows : [
            [
                "date",
                "load_uv",
                "load_pv"
            ]
        ],
        cols : [
            [{
                caption : "日期",
                type    : "string"
            }, {
                caption : "下载人数",
                type    : "number"
            }, {
                caption : "下载次数",
                type    : "number",
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
            return filter.FaceTwo(data , query , dates);
        }
    });

    return Router;
}