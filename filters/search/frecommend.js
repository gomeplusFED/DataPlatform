/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索 api 对应的数据整理函数
 */
var utils = require("../../utils");

/* 统一计算 */
function Computer(key , son , mother , obj1 , obj2){
    if(!obj1[son] || !obj1[mother]){
        obj1[key] = 0;
    }else{
        obj1[key] = utils.toFixed(obj1[son] / obj1[mother] , 0);
    }
    
    if(!obj2[son] || !obj2[mother]){
        obj2[key] = 0;
    }else{
        obj2[key] = utils.toFixed(obj2[son] / obj2[mother] , 0);
    }
}

module.exports = {
    recommendOne(data, query){
        const source = data.first.data[0];
        const start = query.startTime;
        const date = utils.moment(new Date(start) - 24 * 60 * 60 * 1000);
        let obj = {};
        let obj2 = {};

        for(let key of source) {
            key.date = utils.moment(key.date);
            if(key.date === start) {
                obj = key;
            } else {
                obj2 = key;
            }
        }

        return utils.toTable([], data.rows, data.cols);
    },

    recommendTwo(data , query , dates){
        let source = data.first.data[0];
        let keys = [
                "recommend_result_pv",
                "recommend_result_uv",
                "recommend_prodet_ipv",
                "recommend_prodet_ipv_uv",
                "recommend_exposure_product_num",
                "recommend_order_sum",
                "recommend_order_uv",
                "recommend_order_spu",
                "ipv_uv_lv",
                "uv_lv",
                "ipv_lv",
                "ctr_lv"
            ];

        let Values = [
            {
                caption: "PV",
                type: "number",
                help: "推荐位所在页面的浏览量"
            }, {
                caption: "UV",
                type: "number",
                help: "推荐位所在页面的浏览用户数"
            }, {
                caption: "IPV",
                type: "number",
                help: "推荐位引导的商品详情页的浏览次数"
            }, {
                caption: "IPV_UV",
                type: "number",
                help: "推荐位引导的商品详情页的访问账号数"
            }, {
                caption: "曝光商品数",
                type: "number",
                help: "推荐位商品曝光数量(按用户浏览计算,不按加载计算)"
            }, {
                caption: "GMV",
                type: "number",
                help: "推荐引导的直接成交额"
            }, {
                caption: "成交UV",
                type: "number",
                help: "推荐引导成交记录的账号数"
            }, {
                caption: "成交笔数",
                type: "number",
                help: "推荐引导成交的子订单总数"
            }, {
                caption: "IPV_UV转化率",
                type: "number",
                help: "页面UV中，点击了推荐的账号占比",
                comment: "ipv_uv_lv"
            }, {
                caption: "UV成交转化率",
                type: "number",
                help: "成交的账号数占推荐位页面UV的比例",
                comment: "uv_lv"
            }, {
                caption: "IPV-成交转化率",
                type: "number",
                help: "成交的账户数占IPV_UV的比例",
                comment: "ipv_lv"
            }, {
                caption: "CTR",
                type: "number",
                help: "页面PV中,点击了推荐次数占比",
                comment: "ctr_lv"
            }
        ];
        let map = {};
        let newData = {};

        for(let i=0;i<keys.length;i++){
            map[keys[i]] = Values[i].caption;
        }

        for(let date of dates){
            let obj = {};
            newData[date] = obj;
            for(let key of keys){
                obj[key] = 0;
            }
        }

        for(let item of source){
            item.date = utils.getDate(item.date);
            //补全没有的字段
            item["ipv_uv_lv"] = utils.numberLeave( item.recommend_prodet_ipv_uv / item.recommend_result_uv  , 3);
            item["uv_lv"] = utils.numberLeave( item.recommend_order_uv / item.recommend_result_uv  , 3);
            item["ipv_lv"] = utils.numberLeave( item.recommend_order_uv / item.recommend_prodet_ipv_uv  , 3);
            item["ctr_lv"] = utils.numberLeave( item.recommend_prodet_ipv / item.recommend_exposure_product_num  , 3);

            newData[item.date] = item;
        }

        return [{
            type : "line",
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    }
}