/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索 api 对应的数据整理函数
 */
var util = require("../../utils");
const validator = require("validator");

/* 统一计算 */
function Computer(obj, obj2, rows){
    let o = {};
    for(let key of rows) {
        for(let row of key) {
            if(row !== "date") {
                obj[row] = obj[row] || 0;
                obj2[row] = obj2[row] || 0;
                if(typeof obj[row] === "number" || typeof obj2[row] === "number") {
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
        const date = util.moment(new Date(start) - 24 * 60 * 60 * 1000);
        const source = data.first.data[0];
        let obj = {};
        let obj2 = {};

        for(let key of source) {
            key.date = util.moment(key.date);
            key.search_order_sum_pay = (key.search_order_sum_pay / 100).toFixed(2);
            key.search_order_sum = (key.search_order_sum / 100).toFixed(2);
            key.search_avg_turnpage = Math.ceil(key.search_avg_turnpage);
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
            key.four_two = util.toFixed(key.search_order_com_pay, key.search_order_com);
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

        obj.search_order_sum_pay = obj.search_order_sum_pay || "0.00";
        obj2.search_order_sum_pay = obj2.search_order_sum_pay || "0.00";
        obj.search_order_sum = obj.search_order_sum || "0.00";
        obj2.search_order_sum = obj2.search_order_sum || "0.00";
        obj.one_one = obj.one_one || "0.00%";
        obj.one_two = obj.one_two || "0.00%";
        obj.two_one = obj.two_one || "0.00%";
        obj.two_two = obj.two_two || "0.00%";
        obj.three_one = obj.three_one || "0.00%";
        obj.three_two = obj.three_two || "0.00%";
        obj.four_one = obj.four_one || "0.00%";
        obj.four_two = obj.four_two || "0.00%";
        obj.four_three = obj.four_three || "0.00%";
        obj.four_four = obj.four_four || "0.00";
        obj.four_five = obj.four_five || "0.00";
        obj2.one_one = obj2.one_one || "0.00%";
        obj2.one_two = obj2.one_two || "0.00%";
        obj2.two_one = obj2.two_one || "0.00%";
        obj2.two_two = obj2.two_two || "0.00%";
        obj2.three_one = obj2.three_one || "0.00%";
        obj2.three_two = obj2.three_two || "0.00%";
        obj2.four_one = obj2.four_one || "0.00%";
        obj2.four_two = obj2.four_two || "0.00%";
        obj2.four_three = obj2.four_three || "0.00%";
        obj2.four_four = obj2.four_four || "0.00";
        obj2.four_five = obj2.four_five || "0.00";

        let gap = Computer(obj, obj2, data.rows);

        obj.date = obj.date || start;
        obj2.date = obj2.date || date;
        const newData = [obj, obj2, gap];

        return util.toTable([newData, newData, newData, newData], data.rows, data.cols);
    },
    indexTwo(data, dates){
        let source = data.first.data[0];
        const type = "line";
        const mapOne = {
            search_result_pv : "PV",
            search_result_uv : "UV",
            search_prodet_ipv : "IPV",
            search_prodet_ipv_uv : "IPV_UV",
            search_order_uv : "下单UV",
            search_order_uv_pay : "支付UV"
        };
        const mapTwo = {
            one : "GMV",
            search_order_spu : "下单订单数",
            search_order_com : "下单商品数",
            search_order_total : "下单件数",
            search_order_sum_pay : "支付金额",
            search_order_spu_pay : "支付订单数",
            search_order_com_pay : "支付商品数",
            search_order_total_pay : "支付件数"
        };
        const mapThree = {
            two : "下单-支付转化率(%)",
            three : "下单商品-支付转化率(%)",
            four : "下单转化率(%)",
            five : "IPV-下单转化率(%)",
            six : "支付转化率(%)",
            seven : "IPV-支付转化率(%)",
            night : "CTR(%)",
            eight : "客单价",
            ten : "笔单价",
            search_avg_turnpage : "平均翻页数",
            one_one : "点击次数转化率(%)",
            one_two : "点击人数转化率(%)"
        };
        let newData = {};
        const keys = [
            ["search_result_pv", "search_result_uv", "search_prodet_ipv", "search_prodet_ipv_uv",
                "search_order_uv", "search_order_uv_pay"],
            ["search_order_sum", "search_order_spu", "search_order_com", "search_order_total", "search_order_sum_pay",
                "search_order_spu_pay", "search_order_com_pay", "search_order_total_pay"],
            ["two", "three", "four", "five", "six", "seven", "night", "eight", "ten",
                "search_avg_turnpage", "one_one", "one_two"]
        ];

        for(let date of dates) {
            newData[date] = {};
            for(let key of keys) {
                for(let k of key) {
                    newData[date][k] = 0;
                }
            }
        }

        for(let key of source) {
            key.date = util.moment(key.date);
            key.search_order_sum_pay = key.search_order_sum_pay.toFixed(2);
            key.search_order_sum = key.search_order_sum.toFixed(2);
            key.search_avg_turnpage = Math.ceil(key.search_avg_turnpage);
            //下单-支付转化率
            key.two = util.percentage(key.search_order_uv_pay, key.search_order_uv);
            //下单商品-支付转化率
            key.three = util.percentage(key.search_order_com_pay, key.search_order_com);
            //下单转化率
            key.four = util.percentage(key.search_order_uv, key.search_result_uv);
            //IPV-下单转化率
            key.five = util.percentage(key.search_order_uv, key.search_prodet_ipv_uv);
            //支付转化率
            key.six = util.percentage(key.search_order_uv_pay, key.search_result_uv);
            //IPV-支付转化率
            key.seven = util.percentage(key.search_order_uv_pay, key.search_prodet_ipv_uv);
            //CTR
            key.night = util.percentage(key.search_prodet_ipv, key.search_exposure_product_num);
            //客单价
            key.eight = util.division(key.search_order_sum_pay, key.search_order_uv_pay);
            //笔单价
            key.ten = util.division(key.search_order_sum_pay, key.search_order_spu_pay);
            //点击次数转化率
            key.one_one = util.percentage(key.search_prodet_ipv, key.search_result_pv);
            //点击人数转化率
            key.one_two = util.percentage(key.search_prodet_ipv_uv, key.search_result_uv);

            newData[key.date] = key;
        }

        return [{
            type : type,
            map : mapOne,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        },{
            type : type,
            map : mapTwo,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        },{
            type : type,
            map : mapThree,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    }
};