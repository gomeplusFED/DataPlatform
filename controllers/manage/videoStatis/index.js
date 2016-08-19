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
        params : function(query , params , sendData){
            params.date.from = "2016-08-01";
            return params;
        },
        rows : [
            ["new_play_num" , "active_user" ],
            ["1" , "2" , "3" , "4" , "5"],
            ["1" , "2" , "3" , "4" , "5" , "www6" , "7"]
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
                type    : "number"
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
            }, {
                caption : "视频错误数",
                type    : "number"
            }, {
                caption : "非正常播放数",
                type    : "number"
            }]
        ],
        filter (data , query){
            return filter.videoOne(data , query);
        }
    });





    
    


    

    return Router;
};