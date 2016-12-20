
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
        let source = data.first.data[0],
            sum    = data.first.sum[0] || 1;
        let map = {
            "error_num" : "总错误数",
            "effect_user_num" : "影响用户数",
            "effect_user_num_lv" : "影响用户率%"
        } , result = {};

        for(let date of dates){
            let obj = {
                "start_num" : 0,
                "active_user_num" : 0
            };
            for(let key in map){
                obj[key] = 0;
            }
            result[date] = obj;
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            if(result[item.date]){
                result[item.date].error_num += item.error_num;
                result[item.date].effect_user_num += item.effect_user_num;
                result[item.date].start_num += item.start_num;
                result[item.date].active_user_num += item.active_user_num;
            }
        }

        for(let date in result){
            // result[date].error_num_lv = util.dealDivision( result[date].error_num , sum , 2 );
            result[date].effect_user_num_lv = util.dealDivision( result[date].effect_user_num , result[date].active_user_num , 2 );
        }

        if(query.main_show_type_filter == "table"){
            let Result = [];
            for(let date in result){
                result[date].date = date;
                // result[date].error_num_lv = util.toFixed( result[date].error_num_lv , 0 );
                result[date].effect_user_num_lv = util.toFixed( result[date].effect_user_num_lv , 0 );
                Result.unshift(result[date]);
            }
            return util.toTable([Result], data.rows, data.cols);
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

        let source = data.first.data[0],
            sum    = data.first.sum[0] || 1;
        let Resource = {} , theResource = [];
        for(let item of source){
            if(Resource[item.error_status]){
                Resource[item.error_status].error_num += item.error_num;
                Resource[item.error_status].effect_user_num += item.effect_user_num;
                Resource[item.error_status].active_user_num += item.active_user_num;
                Resource[item.error_status].start_num += item.start_num;
            }else{
                Resource[item.error_status] = {
                    "error_status": item.error_status,
                    "error_name" : CodeTranslate[item.error_status] || "未收录",
                    "error_num"  : item.error_num,
                    "effect_user_num" : item.effect_user_num,
                    "active_user_num" : item.active_user_num,
                    "start_num"       : item.start_num
                };
            }
        }

        for(let key in Resource){
            Resource[key].error_num_lv = util.toFixed( util.dealDivision( Resource[key].error_num , sum ) , 0 );
            Resource[key].effect_user_num_lv = util.toFixed( util.dealDivision( Resource[key].effect_user_num , Resource[key].active_user_num ) , 0 );
            theResource.push(Resource[key]);
        }

        return util.toTable([theResource], data.rows, data.cols);
    },
}
