/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索 api 对应的数据整理函数
 */
var utils = require("../../utils");


//逛逛首页搜索框、分类页搜索框、便宜好货页搜索框
//直接输入、历史记录、下拉推荐

module.exports = {
    wordOne(data , query , dates){
        let source = data.first.data[0];
        let newData= {
            "逛逛首页搜索框" : {
                value : 0
            },
            "分类页搜索框" : {
                value : 0
            },
            "便宜好货页搜索框" : {
                value : 0
            }
        };
        for(let item of source){
            if(item.search_position == "ALL" || item.search_position == "精品小店页搜索框"){
                continue;
            }

            if(newData[item.search_position]){
                newData[item.search_position].value += item.search_num;
            }else{
                newData[item.search_position] = {
                    value : item.search_num
                }
            }
        }

        return [{
            type : "pie",
            map : {
                value: "商品搜索关键词分析－入口位置占比"
            },
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    wordTwo(data , query , dates){
        let source = data.first.data[0];
        let newData= {
            "直接输入" : {
                value : 0
            },
            "历史记录" : {
                value : 0
            },
            "下拉推荐" : {
                value : 0
            }
        };
        for(let item of source){
            if(item.search_source == "ALL"){
                continue;
            }

            if(newData[item.search_source]){
                newData[item.search_source].value += item.search_num;
            }else{
                newData[item.search_source] = {
                    value : item.search_num
                }
            }
        }

        return [{
            type : "pie",
            map : {
                value: "商品搜索关键词分析-来源占比"
            },
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    wordThree(data , query , dates){

        let source = data.first.data[0];
        let Result = [];
        for(let item of source){
            if(!item.search_result_uv){
                item.uv_lv = "0.00%";
            }else{
                item.uv_lv = utils.toFixed(item.search_order_uv / item.search_result_uv , 0);
            }

            if(!item.search_prodet_ipv_uv){
                item.ipv_lv = "0.00%";
            }else{
                item.ipv_lv = utils.toFixed(item.search_order_uv / item.search_prodet_ipv_uv , 0);
            }

            if(!item.search_exposure_product_num){
                item.ctr_lv = "0.00%";
            }else{
                item.ctr_lv = utils.toFixed(item.search_prodet_ipv / item.search_exposure_product_num , 0);
            }
           
            item.date = utils.getDate(item.date);

            Result.push(item);
        }

        return utils.toTable([Result], data.rows, data.cols , [data.first.count]);
    }
}