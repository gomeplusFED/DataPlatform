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
    recommendOne(data , query , dates){
        //需要输出两个一样的数组，每个数组包涵三条数据，每条数据包括两个表的所有字段

        let keys = data.rows[0].concat(data.rows[1]);
        let DataSource = data.first.data[0];
        let source = [null , null];

        for(let item of DataSource){
            var ss = query.date.indexOf(utils.getDate(item.date));
            source[ss] = item;
        }


        if(!source[0]){
            source[0] = {};
            for(let key of keys){
                source[0][key] = 0;
            }
            source[0].date = query.date[0];
        }
        if(!source[1]){
            source[1] = {};
            for(let key of keys){
                source[1][key] = 0;
            }
            source[1].date = query.date[1];
        }

        let Result = [source[0] , source[1]];

        for(let key of keys){
            switch(key){
                case "date":
                    source[0].date = utils.beforeDate(source[0].date , 1)[0];
                    source[1].date = utils.beforeDate(source[1].date , 1)[0];
                    break;
                case "ipv_uv_lv":
                    Computer(key , "recommend_prodet_ipv_uv" , "recommend_result_uv" , source[0] ,source[1]);
                    break;
                case "uv_lv":
                    Computer(key , "recommend_order_uv" , "recommend_result_uv" , source[0] ,source[1]);
                    break;
                case "ipv_lv":
                    Computer(key , "recommend_order_uv" , "recommend_prodet_ipv_uv" , source[0] ,source[1]);
                    break;
                case "ctr_lv":
                    Computer(key , "recommend_prodet_ipv" , "recommend_exposure_product_num" , source[0] ,source[1]);
                    break;
            }
        }

        let obj = {};
        let Reg = /\%/ig;
        for(let key of keys){
            if(key == "date"){
                obj.date = "GAP";
                continue;
            }

            let num = source[0][key];
            let num1= source[1][key];
            if(typeof num == "string"){
                num = num.replace(Reg , "") / 1;
            }
            if(typeof num1 == "string"){
                num1 = num1.replace(Reg , "") / 1;
            }

            if(num1 == 0){
                obj[key] = (num - num1) / 1;
            }else{
                obj[key] = (num - num1) / num1;
            }
            
            obj[key] = utils.toFixed(obj[key] , 0);
        }

        Result.push(obj);
        return utils.toTable([Result , Result], data.rows, data.cols);
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