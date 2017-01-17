/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索 api 对应的数据整理函数
 */
var utils = require("../../utils");

/* 统一计算 */
function Computer(obj, obj2, rows){
    let o = {};
    for(let key of rows) {
        for(let row of key) {
            if(row !== "date") {
                obj[row] = obj[row] || 0;
                obj2[row] = obj2[row] || 0;
                if(isNumber(obj[row]) || isNumber(obj2[row])) {
                    o[row] = util.toFixed(
                        obj[row] - obj2[row],
                        obj2[row]
                    );
                } else {
                    let one = +obj[row].replace("%", "");
                    let two = +obj2[row].replace("%", "");
                    o[row] = util.toFixed(
                        one - two,
                        two
                    );
                }
            }
        }
    }
    o.date = "GAP";

    return o;
}

module.exports = {
    indexOne(data , query){
        const start = query.startTime;
        const date = util.moment(start - 24 * 60 * 60 * 1000);
        const source = data.first.data[0];
        let obj = {};
        let obj2 = {};

        for(let key of source) {
            key.date = util.moment(key.date);
            //点击次数转化率
            key.one_one = util.toFixed(key.search_prodet_ipv, key.search_result_pv);
            //点击人数转化率
            key.one_two = util.toFixed(key.search_prodet_ipv_uv, key.search_result_uv);
            //下单转化率
            key.two_one = util.toFixed(key.search_order_uv, key.search_result_uv);
            //IPV-下单转化率
            key.two_two = util.toFixed(key.search_order_uv, key.search_prodet_ipv_uv);
            //支付转化率
            key.three_one = util.toFixed(key.search_order_uv_pay, key.search_result_uv);
            //IPV-支付转化率
            key.three_two = util.toFixed(key.search_order_uv_pay, key.search_prodet_ipv_uv);
            //下单-支付转化率
            key.four_one = util.toFixed(key.search_order_uv_pay, key.search_order_uv);
            //下单商品-支付转化率
            key.four.two = util.toFixed(key.search_order_com_pay, key.search_order_com);
            //CTR
            key.four_three = util.toFixed(key.search_prodet_ipv, key.search_exposure_product_num);
            //客单价
            key.four_four = util.division(key.search_order_sum_pay, key.search_order_uv_pay);
            //笔单价
            key.four_five = util.division(key.search_order_sum_pay, key.search_order_spu_pay);
            if(key.date === start ) {
                obj = key;
            } else {
                obj2 = key;
            }
        }

        let gap = Computer(obj, obj2, data.rows);

        obj.date = obj.date || start;
        obj2.date = obj2.date || date;
        const newData = [obj, obj2, gap];

        return utils.toTable([newData, newData, newData], data.rows, data.cols);
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
};