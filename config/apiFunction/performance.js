
/**
 * 性能分析 模块功能函数文件
*/
var util = require("../../utils"),
    moment = require("moment");

let CodeTranslate = {
    "400" : "请求格式错误",
    "401" : "未授权",
    "403" : "禁止访问",
    "404" : "资源不存在",
    "405" : "不允许该操作",
    "406" : "不可接受",
    "409" : "资源冲突",
    "410" : "资源已失效",
    "411" : "需要有效长度",
    "412" : "未满足前提条件",
    "413" : "请求实体过大",
    "414" : "请求的 URI 过长",
    "415" : "不支持的媒体类型",
    "416" : "请求范围不符合要求",
    "417" : "未满足期望值",
    "422" : "无法处理的实体",
    "423" : "锁定的错误",
    "499" : "客户端主动断开了连接",
    "500" : "服务端内部错误",
    "501" : "尚未实施",
    "502" : "错误网关",
    "503" : "服务不可用",
    "504" : "网关超时",
    "505" : "HTTP版本不受支持"
};





module.exports = {
    performance_01(query , params , sendData){
        if(!params.type){
            params.type = "PC";
        }
        return params;
    },
    
    performance_01_f(data, query, dates){

        let source = data.first.data[0];
        let map = {
            "error_num" : "总错误数",
            "error_num_lv" : "错误率",
            "effect_user_num" : "影响用户数",
            "effect_user_num_lv" : "影响用户率"
        } , result = {};

        for(let date of dates){
            let obj = {};
            for(let key in map){
                obj[key] = 0;
            }
            result[date] = obj;
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            let Robj = result[item.date];
            if(result[item.date]){
                result[item.date] = item;
                result[item.date].error_num_lv = util.dealDivision( item.error_num , item.start_num , 4 );
                result[item.date].effect_user_num_lv = util.dealDivision( item.effect_user_num , item.active_user_num , 4 );
            }
        }

        if(query.main_show_type_filter == "table"){
            for(let item of source){
                item.error_num_lv = util.toFixed(item.error_num_lv , 0);
                item.effect_user_num_lv = util.toFixed( item.effect_user_num_lv , 0 );
            }
            return util.toTable([source], data.rows, data.cols);
        }else{
            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }];
        }
    },

    performance_02(query , params , sendData){
        if(!params.type){
            params.type = "PC";
        }
        return params;
    },

    performance_02_f(data, query, dates){

        let source = data.first.data[0];
        for(let item of source){
            if(CodeTranslate[item.error_status]){
                item.error_name = CodeTranslate[item.error_status];
            }else{
                item.error_name = "未收录";
            }

            item.error_num_lv = util.toFixed( item.error_num , item.start_num );
            item.effect_user_num_lv = util.toFixed( item.effect_user_num , item.active_user_num );
        }

        return util.toTable([source], data.rows, data.cols);
    },
}
