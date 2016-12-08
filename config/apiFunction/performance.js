
/**
 * 性能分析 模块功能函数文件
*/
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    performance_01(query , params , sendData){
        // delete params.type;
        return params;
    },

    
    performance_01_f(data, query, dates){
        console.log(data);
        let source = data.first.data[0];
        let map    = {};
        let Code = {
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

        return [{
            type : "line",
            map : map,
            data : obj,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
}
