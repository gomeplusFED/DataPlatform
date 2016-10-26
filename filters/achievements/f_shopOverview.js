/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    shopOverviewOne(data, query, dates) {
        // console.log(123,data);
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
        return util.toTable([[]], data.rows, data.cols);
    },

    shopThree(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 50 ? 50 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.access_num_rate = util.toFixed(key.access_num, sum[1]);
            key.access_users_rate = util.toFixed(key.access_users, sum[2]);
            source[i] = key;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    shopOverviewFour(data, query) {
        let map = {
            "avg_describe_tag":"商品描述",
            "avg_service_tag":"卖家服务",
            "avg_express_tag":"物流服务"
        };
        let source = data.first.data[0];
        let score = [5,4.6,]
        let newData = {
            "5" : {
                "avg_describe_tag" : 0,
                "avg_service_tag"  : 0,
                "avg_express_tag"  : 0
            }
        };


        return [{
            type : "bar",
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
};