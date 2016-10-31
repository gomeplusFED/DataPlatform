/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

//评级分布参数
let ScoreLevel = {
    "1" : "0-2.0",
    "2" : "2.1-3.0",
    "3" : "3.1-3.5",
    "4" : "3.6-4.0",
    "5" : "4.1-4.5",
    "6" : "4.6-4.9",
    "7" : "5"
}

module.exports = {
    shopOverviewOne(data, query, dates) {
        var source = data.first.data[0];
        for(var item of source) {
            item.all = 0;
            for(let key of data.rows[0]){
                if(key == "all") continue;
                item.all += item[key];
            }
        }

        return util.toTable([source], data.rows, data.cols);
    },
    shopOverviewTwo(data , query , dates){
        let source = data.first.data[0];
        let obj = {};
        for(let key of data.rows[0]){
            obj[key] = 0;
        }

        for(let item of source){
            for(let key of data.rows[0]){
                obj[key] += item[key] ? item[key] : 0;
            }
        }obj
        return util.toTable([source], data.rows, data.cols);
    },

    //趋势
    shopOverviewThree(data, query , dates) {
        let source = data.first.data[0],
            type   = query.main_show_type_filter,
            count  = data.first.count;

            console.log(data);
        for(let item of source){
            item.date = util.getDate(item.date);
        }

        


        if(type == "chart"){
            let map = {
                "shop_run" : "新增运营店铺",
                "shop_rest": "新增休店店铺",
                "shop_frost":"新增冻结店铺",
                "shop_stop": "新增关闭店铺"
            }
            let newData = {};
            for(let date of dates){
                newData[date] = {};
                for(let key in map){
                    newData[date][key] = 0;
                }
            }

            for(let item of source){
                for(let key in map){
                    newData[item.date][key] = item[key];
                }
            }

            return [{
                type : "line",
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }];
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },

    //店铺评级分布
    shopOverviewFour(data, query) {
        let map = {
            "avg_describe_tag":"商品描述",
            "avg_service_tag":"卖家服务",
            "avg_express_tag":"物流服务"
        };
        let source = data.first.data[0];
        let newData = {};
        let score = ["5" , "4.6-4.9" , "4.1-4.5" , "3.6-4.0" , "3.1-3.5" , "2.1-3.0" , "0-2.0"];

        for(let key of score){
            newData[key] = {
                "avg_describe_tag" : 0,
                "avg_service_tag"  : 0,
                "avg_express_tag"  : 0
            }
        }

        for(let item of source){
            if(item.avg_describe_tag != "ALL" && item.avg_service_tag == "ALL" && item.avg_express_tag == "ALL"){
                //处理商品描述  avg_describe_tag
                let key = ScoreLevel[item.avg_describe_tag];
                newData[key].avg_describe_tag += item.count_sum;
            }else if(item.avg_describe_tag == "ALL" && item.avg_service_tag != "ALL" && item.avg_express_tag == "ALL"){
                //处理卖家服务  avg_service_tag
                let key = ScoreLevel[item.avg_service_tag];
                newData[key].avg_service_tag += item.count_sum;
            }else{
                //处理物流服务
                let key = ScoreLevel[item.avg_express_tag];
                newData[key].avg_express_tag += item.count_sum;
            }
        }

        return [{
            type : "bar",
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },

    shopOverviewFive(data, query) {
        var source = data.first.data,
            count = data.first.count[0].count;

        let i = 1;
        for(let item of source){
            item.sort = (query.page - 1)*query.limit + i;
            i++;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
};