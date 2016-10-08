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
    indexOne(data , query , dates){
        //需要输出两个一样的数组，每个数组包涵三条数据，每条数据包括两个表的所有字段

        let keys = data.rows[0].concat(data.rows[1]);
        let source = data.first.data[0];
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
                case "5_ipv_uv_lv":
                    Computer(key , "search_prodet_ipv_uv" , "search_result_uv" , source[0] ,source[1]);
                    break;
                case "6_uv_lv":
                    Computer(key , "search_order_uv" , "search_result_uv" , source[0] ,source[1]);
                    break;
                case "7_ipv_lv":
                    Computer(key , "search_order_uv" , "search_prodet_ipv_uv" , source[0] ,source[1]);
                    break;
                case "8_ctr":
                    Computer(key , "search_prodet_ipv" , "search_exposure_product_num" , source[0] ,source[1]);
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

            if(!obj[key]){
                obj[key] = "0";
            }
            
            obj[key] = utils.toFixed(obj[key] , 0);
        }

        Result.push(obj);
        return utils.toTable([Result , Result], data.rows, data.cols);
    },

    indexTwo(data , query , dates){
        let source = data.first.data[0];
        let keys = ["search_result_pv", "search_result_uv", "search_prodet_ipv" , "search_prodet_ipv_uv",
            "search_avg_turnpage",
            "search_avg_respage_staytime",
            "search_avg_prodeta_staytime",
            "search_order_sum" , "search_order_uv", "search_order_spu" , "5_ipv_uv_lv" , "6_uv_lv" , "7_ipv_lv" , "8_ctr"
            ];

        let Values = [
            {
                caption : "PV",
                type    : "number",
                help    : "搜索结果页浏览量"
            }, {
                caption : "UV",
                type    : "number",
                help    : "搜索的独立访客数(搜索结果页)"
            }, {
                caption : "IPV",
                type    : "number",
                help    : "搜索引导的商品详情页的浏览次数"
            }, {
                caption : "IPV_UV",
                type    : "number",
                help    : "搜索引导的商品详情页的访问用户数"
            }, {
                caption : "平均翻页数",
                type    : "number",
                help    : "PV维度，去掉搜索无结果和异常情况"
            }, {
                caption : "平均停留时长(s)/页",
                type    : "number",
                help    : "PV维度，去掉搜索无结果和异常情况(未加载出结果页)"
            }, {
                caption : "平均停留时长(s)/商品详情页",
                type    : "number",
                help    : "IPV维度，去掉异常情况(未加载出商品)"
            },


            {
                caption : "GMV/成交金额",
                type    : "number",
                help    : "搜索引导的直接成交额(立即购买、加购、收藏)" 
            }, {
                caption : "成交UV",
                type    : "number",
                help    : "有搜索引导成交记录的用户数"
            }, {
                caption : "成交笔数",
                type    : "number",
                help    : "搜索引导成交的子订单总数" 
            }, {
                caption : "IPV_UV转化率",
                type    : "number",
                help    : "来国美+搜索的UV，点击了搜索结果的用户占比",
                comment : "5_ipv_uv_lv"
            }, {
                caption : "UV成交转化率",
                type    : "number",
                help    : "来国美+搜索的UV，最终通过搜索结果成交的用户占比",
                comment : "6_uv_lv"
            }, {
                caption : "IPV-成交转化率",
                type    : "number",
                help    : "来国美+搜索的UV，通过点击搜索结果的IPV成交的用户占比",
                comment : "7_ipv_lv"
            }, {
                caption : "CTR",
                type    : "number",
                help    : "搜索产生的IPV占搜索展示的商品总数的比例",
                comment : "8_ctr"
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
            item["5_ipv_uv_lv"] = utils.numberLeave( item.search_prodet_ipv_uv / item.search_result_uv  , 3);
            item["6_uv_lv"] = utils.numberLeave( item.search_order_uv / item.search_result_uv  , 3);
            item["7_ipv_lv"] = utils.numberLeave( item.search_order_uv / item.search_prodet_ipv_uv  , 3);
            item["8_ctr"] = utils.numberLeave( item.search_prodet_ipv / item.search_exposure_product_num  , 3);

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