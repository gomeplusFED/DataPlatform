/**
 * @author yanglei
 * @date 20151222
 * @fileoverview 数据概览
 */

var dataOverview = require('../libs/dataOverview');
var config = require('../config');
var filter = require("../filters/dataOverview");
var api = require("../libs/api");

module.exports = function(Router) {

    Router = new api(Router, {
        modelName : ["OverviewPlatf", "Configure"],
        router : "/dataOverview",
        view : "dataOverview/index",
        links : config.dataOverview,
        filter(data, types){
            return filter.dataTrends(data);
        },
        cols : [ "启动用户", "启动次数", "新用户", "新增账户", "注册转化率", "每次使用时长" ],
        rows : [ "open_user_total", "open_total", "new_user", "new_account", "register_rate", "using_time_avg" ],
        required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
        }
    });

    Router = new api(Router, {
        modelName : ["OverviewPlatf", "Configure"],
        router : "/dataOverview/wap",
        view : "dataOverview/index",
        links : config.dataOverview,
        filter(data, types){
            return filter.dataTrends(data);
        },
        cols : [ "访客数", "浏览量", "IP数", "新用户", "新增账户", "平均访问时长", "注册转化率" ],
        rows : [ "uv", "pv", "ip_count", "new_user", "new_account", "visit_time_avg", "register_rate" ],
        required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
        }
    });

    return Router;
};
