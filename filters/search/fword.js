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
            "主搜" : {
                value : 0
            },
            "精品小店" : {
                value : 0
            },
            "便宜好货" : {
                value : 0
            }
        };
        if (query.type === 'h5') {
            delete newData['精品小店']
        }
        for(let item of source){
            if(item.search_position == "ALL"){
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

        let source2 = data.second.data[0];
        let newData2= {
            "直接输入" : {
                value : 0
            },
            "搜索历史" : {
                value : 0
            },
            "下拉推荐" : {
                value : 0
            }
        };
        for(let item of source2){
            if(item.search_source == "ALL"){
                continue;
            }

            if(newData2[item.search_source]){
                newData2[item.search_source].value += item.search_num;
            }else{
                newData2[item.search_source] = {
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
        }, {
            type : "pie",
            map : {
                value: "商品搜索关键词分析-来源占比"
            },
            data : newData2,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    wordTwo(data , query , dates){
        let source = data.first.data[0];
        let Result = [];
        let start = query.from ? query.from - 1 : (query.page - 1) * query.limit;
        let count = 0;
        for(let item of source){
            item.search_order_sum = (item.search_order_sum / 100).toFixed(2);
            item.search_order_sum_pay = (item.search_order_sum_pay / 100).toFixed(2);
            // 搜索排名
            item.rank = start + (++count);
            // 点击次数转化率=IPV/PV
            item.ipv_pv_ratio = utils.toFixed(item.search_prodet_ipv, item.search_result_pv);
            // 点击人数转化率=IPV_UV/UV
            item.ipv_uv_uv_ratio = utils.toFixed(item.search_prodet_ipv_uv, item.search_result_uv);
            // 下单转化率=下单UV/UV
            item.order_uv_uv_ratio = utils.toFixed(item.search_order_uv, item.search_result_uv);
            // IPV-下单转化率=下单UV/IPV_UV
            item.order_uv_ipv_ui_ratio = utils.toFixed(item.search_order_uv, item.search_prodet_ipv_uv);
            // 支付转化率=支付UV/UV
            item.order_uv_pay_uv_ratio = utils.toFixed(item.search_order_uv_pay, item.search_result_uv);
            // IPV-支付转化率 = 支付UV/IPV_UV
            item.order_uv_pay_ipv_uv_ratio = utils.toFixed(item.search_order_uv_pay, item.search_prodet_ipv_uv);
            // 下单-支付转化率=支付UV/下单UV
            item.order_uv_pay_order_uv_ratio = utils.toFixed(item.search_order_uv_pay, item.search_order_uv);
             // 下单商品-支付转化率=支付商品数/下单商品数
            item.order_com_pay_order_com_ratio = utils.toFixed(item.search_order_com_pay, item.search_order_com);
            // CTR=IPV/曝光商品数
            item.ipv_exposure_product_num_ratio = utils.toFixed(item.search_prodet_ipv_uv, item.search_exposure_product_num);
            // 客单价=支付金额/支付UV
            item.order_sum_pay_order_uv_pay_ratio = utils.division(item.search_order_sum_pay, item.search_order_uv_pay);
            // 笔单价=支付金额/支付订单数
            item.order_sum_pay_order_spu_pay_ratio = utils.division(item.search_order_sum_pay, item.search_order_spu_pay);
            // Date
            item.date = utils.getDate(item.date);

            Result.push(item);
        }

        return utils.toTable([Result], data.rows, data.cols , [data.first.count > 100 ? 100 : data.first.count]);
    }
}