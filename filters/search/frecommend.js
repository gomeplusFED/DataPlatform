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
                if(typeof obj[row] === "number" || typeof obj2[row] === "number") {
                    o[row] = utils.toFixed(
                        obj[row] - obj2[row],
                        obj2[row]
                    );
                } else {
                    let one = +obj[row].replace("%", "");
                    let two = +obj2[row].replace("%", "");
                    o[row] = utils.toFixed(
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
    recommendOne(data, query){
        const source = data.first.data[0];
        const start = query.startTime;
        const date = utils.moment(new Date(start) - 24 * 60 * 60 * 1000);
        let obj = {};
        let obj2 = {};

        for(let key of source) {
            key.date = utils.moment(key.date);
            key.recommend_order_sum = (key.recommend_order_sum / 100).toFixed(2);
            key.recommend_order_sum_pay = (key.recommend_order_sum_pay / 100).toFixed(2);
            //点击次数转化率
            key.one_one = utils.toFixed(key.recommend_prodet_ipv, key.recommend_result_pv);
            //点击人数转化率
            key.one_two = utils.toFixed(key.recommend_prodet_ipv_uv, key.recommend_result_uv);
            //下单转化率
            key.two_one = utils.toFixed(key.recommend_order_uv, key.recommend_result_uv);
            //IPV-下单转化率
            key.two_two = utils.toFixed(key.recommend_order_uv, key.recommend_prodet_ipv_uv);
            //支付转化率
            key.three_one = utils.toFixed(key.recommend_order_uv_pay, key.recommend_result_uv);
            //IPV-支付转化率
            key.three_one = utils.toFixed(key.recommend_order_uv_pay, key.recommend_prodet_ipv_uv);
            //下单-支付转化率
            key.four_one = utils.toFixed(key.recommend_order_uv_pay, key.recommend_order_uv);
            //下单商品-支付转化率
            key.four_two = utils.toFixed(key.recommend_order_com_pay, key.recommend_order_com);
            //客单价
            key.four_three = utils.division(key.recommend_order_sum_pay, key.recommend_order_uv_pay);
            //笔单价
            key.four_four = utils.division(key.recommend_order_sum_pay, key.recommend_order_spu_pay);
            if(key.date === start) {
                obj = key;
            } else {
                obj2 = key;
            }
        }

        obj.recommend_order_sum = obj.recommend_order_sum || "0.00";
        obj2.recommend_order_sum = obj2.recommend_order_sum || "0.00";
        obj.recommend_order_sum_pay = obj.recommend_order_sum_pay || "0.00";
        obj2.recommend_order_sum_pay = obj2.recommend_order_sum_pay || "0.00";
        obj.one_one = obj.one_one || "0.00%";
        obj2.one_one = obj2.one_one || "0.00%";
        obj.one_two = obj.one_two || "0.00%";
        obj2.one_two = obj2.one_two || "0.00%";
        obj.two_one = obj.two_one || "0.00%";
        obj2.two_one = obj2.two_one || "0.00%";
        obj.two_two = obj.two_two || "0.00%";
        obj2.two_two = obj2.two_two || "0.00%";
        obj.three_one = obj.three_one || "0.00%";
        obj2.three_one = obj2.three_one || "0.00%";
        obj.three_two = obj.three_two || "0.00%";
        obj2.three_two = obj2.three_two || "0.00%";
        obj.four_one = obj.four_one || "0.00%";
        obj2.four_one = obj2.four_one || "0.00%";
        obj.four_two = obj.four_two || "0.00%";
        obj2.four_two = obj2.four_two || "0.00%";
        obj.four_three = obj.four_three || "0.00";
        obj2.four_three = obj2.four_three || "0.00";
        obj.four_four = obj.four_four || "0.00";
        obj2.four_four = obj2.four_four || "0.00";

        const gap = Computer(obj, obj2, data.rows);
        obj.date = obj.date || start;
        obj2.date = obj2.date || date;
        const newData = [obj, obj2, gap];

        return utils.toTable([newData, newData, newData, newData], data.rows, data.cols);
    },

    recommendTwo(data, dates){
        const source = data.first.data[0];
        const type = "line";
        const mapOne = {
            recommend_result_pv : "PV",
            recommend_result_uv : "UV",
            recommend_prodet_ipv : "IPV",
            recommend_prodet_ipv_uv : "IPV_UV",
            recommend_order_uv : "下单UV",
            recommend_order_uv_pay : "支付UV"
        };
        const mapTwo = {
            recommend_order_sum : "GMV",
            recommend_order_spu : "下单订单数",
            recommend_order_com : "下单商品数",
            recommend_order_total : "下单件数",
            recommend_order_sum_pay : "支付金额",
            recommend_order_spu_pay : "支付订单数",
            recommend_order_com_pay : "支付商品数",
            recommend_order_total_pay : "支付件数"
        };
        const mapThree = {
            one : "下单-支付转化率",
            two : "下单商品-支付转化率",
            three : "下单转化率",
            four : "IPV-下单转化率",
            five : "支付转化率",
            six : "IPV-支付转化率",
            seven : "客单价",
            eight : "笔单价",
            night : "点击人数转化率",
            ten : "点击人数转化率"
        };
        const newData = {};

        for(let date of dates) {
            newData[date] = {};
            for(let key in mapOne) {
                newData[date][key] = 0;
            }
            for(let key in mapTwo) {
                newData[date][key] = 0;
            }
            for(let key in mapThree) {
                newData[date][key] = 0;
            }
        }

        for(let key of source) {
            key.date = utils.moment(key.date);
            key.recommend_order_sum = (key.recommend_order_sum / 100).toFixed(2);
            key.recommend_order_sum_pay = (key.recommend_order_sum_pay / 100).toFixed(2);
            //下单-支付转化率
            key.one = utils.percentage(key.recommend_order_uv_pay, key.recommend_order_uv);
            //下单商品-支付转化率
            key.two = utils.percentage(key.recommend_order_com_pay, key.recommend_order_com);
            //下单转化率
            key.three = utils.percentage(key.recommend_order_uv, key.recommend_result_uv);
            //IPV-下单转化率
            key.four = utils.percentage(key.recommend_order_uv, key.recommend_prodet_ipv_uv);
            //支付转化率
            key.five = utils.percentage(key.recommend_order_uv_pay, key.recommend_result_uv);
            //IPV-支付转化率
            key.six = utils.percentage(key.recommend_order_uv_pay, key.recommend_prodet_ipv_uv);
            //客单价
            key.seven = utils.division(key.recommend_order_sum_pay, key.recommend_order_uv_pay);
            //笔单价
            key.eight = utils.division(key.recommend_order_sum_pay, key.recommend_order_spu_pay);
            //点击人数转化率
            key.night = utils.percentage(key.recommend_prodet_ipv, key.recommend_result_pv);
            //点击人数转化率
            key.ten = utils.percentage(key.recommend_prodet_ipv_uv, key.recommend_result_uv);
            if(newData[key.date]) {
                newData[key.date] = key;
            }
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
}