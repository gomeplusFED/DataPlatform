/**
 * author@Mr.He
 * content@20161103
 * 交易面板过滤函数
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    //交易汇总
    tradePanelOne(data , query , dates) {
        let source = data.first.data[0];
        let rows   = ["access_user" , "order_user" , "order_num" , "order_sum" ,"Man_price" , "pay_user" , "pay_num" , "pay_sum"]; 
        let result = {};
        for(let key of rows){
            result[key] = 0;
        }
        for(let item of source){
            for(let key of rows){
                result[key] += item[key];
            }
        }

        return util.toTable([[result], [result]], data.rows, data.cols , null , true);
    },

    //交易商品汇总
    tradePanelTwo(data, query, dates) {
        let source = data.first.data[0];
        let result = {};
        for(let key of data.rows[0]){
            if(key == "operating"){
                result[key] = `<button class='btn btn-default' url_detail='/achievements/tradePanelTwo_add'>趋势</button>`;
            }else{
                result[key] = 0;
            }
        }

        for(let item of source){
            for(let key of data.rows[0]){
                if(key == "operating") continue;
                result[key] += item[key];
            }
        }

        return util.toTable([[result]], data.rows, data.cols , null , true);
    },
    //趋势分析补充
    tradePanelTwo_add(data , query , dates){
        let source = data.first.data[0];
        let result = {};
        console.log(123,query);

        let out = util.toTable([source], data.rows, data.cols);
        return [out , out]
    },


    tradeThree(data) {
        var source = data.first.data[0],
            count = data.first.count;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.tran_guest_unit_price = util.division(key.tran_pay_money_amount, key.tran_pay_user_num);
            key.del_use_coupon_rate = key.del_use_coupon_rate.toFixed(2) + "%";
            key.tran_order_money_amount = key.tran_order_money_amount.toFixed(2);
            key.tran_pay_money_amount = key.tran_pay_money_amount.toFixed(2);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    tradeFour(data, params) {
        var source = data.first.data[0],
            count = data.first.count,
            sourceSum = data.first.sum;

        for(var key of source) {
            key.pay_money_amount = key.pay_money_amount.toFixed(2);
            key.pay_money_amount_ratio = util.toFixed(key.pay_money_amount, sourceSum["0"]);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    tradeFive(data) {
        var source = data.first.data[0],
            count = data.first.count,
            pay_ttl = 0,
            product_ttl = 0;
        for (var key of source) {
            pay_ttl += key.deal_money_amount;
            product_ttl += key.deal_pro_num;
        }
        for (var key of source) {
            key.cus_unit_price = util.division(key.deal_money_amount, key.order_number);
            key.deal_money_amount = key.deal_money_amount.toFixed(2);
            key.deal_money_ratio = util.toFixed(key.deal_money_amount, pay_ttl);
            key.deal_pro_ratio = util.toFixed(key.deal_pro_num, product_ttl);
        }
        return util.toTable([source], data.rows, data.cols, [count]);

    }
};