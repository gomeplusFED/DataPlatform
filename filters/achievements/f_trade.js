/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    tradeOne(data) {
        let source = data.first.data[0];
        let one = {} , two = {};
        for(let key of data.rows[0]){
            one[key] = 0;
        }
        for(let key of data.rows[1]){
            two[key] = 0;
        }

        let all_pay_sum = 0, all_pay_user = 0;
        for(let item of source){
            for(let key in one){
                one[key] += item[key];
            }
            for(let key in two){
                if(key == "Man_price") continue;
                two[key] += item[key];
            }
            all_pay_sum += item.pay_sum;
            all_pay_user+= item.pay_user;
        }

        two.Man_price = util.dealDivision(all_pay_sum , all_pay_user , 2);
        return util.toTable([[one], [two]], data.rows, data.cols);
    },

    //交易趋势
    tradeTwo(data, query, dates) {
        let source = data.first.data[0],
            count  = data.first.count || 1;
            Cols = [
                "被访问店铺数",
                "支付店铺数",
                "下单商品数",
                "下单商品件数",

                "支付商品数",
                "支付商品件数",
                "下单总量",
                "支付订单量",

                "下单金额",
                "支付金额",
                "下单人数",
                "支付人数",

                "客单价",
                "国美币使用额",
                "平台优惠券使额"
            ],
            Rows = [
                "access_shop",
                "pay_shop",
                "order_product",
                "order_product_num",

                "pay_product",
                "pay_product_num",
                "order_num",
                "pay_num",

                "order_num",
                "pay_sum",
                "order_user",
                "pay_user",

                "Man_price",
                "consume_guomeibi",
                "plat_couple_use_sum"
            ];

        data.rows[0] = Rows.concat();
        data.cols[0] = [];
        for(let i=0;i<Cols.length;i++){
            data.cols[0].push({
                caption: Cols[i],
                type : "number"
            })
        }

        data.rows[0].unshift("date");
        data.cols[0].unshift({
            caption: "日期",
            type : "date"
        });

        for(let item of source){
            item.date = util.getDate(item.date);
            item.Man_price = util.dealDivision(item.pay_sum , item.pay_user , 2)
        }

        let out = util.toTable([source], data.rows, data.cols , [count]);

        /* 图表 */
        if(query.main_show_type_filter == "chart"){
            let map = {} , result = {};
            for(let i=0;i<Cols.length;i++){
                map[Rows[i]] = Cols[i];
            }

            for(let date of dates){
                let obj = {};
                for(let key of Rows){
                    obj[key] = 0;
                }
                result[date] = obj;
            }


            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }]
        }

        return out;

    },
    tradeThree(data , query , dates) {
        let source = data.first.data[0],
            count = data.first.count || 1;

        for(let item of source){
            item.Every_price = util.dealDivision(item.pay_sum , item.pay_num , 2);
            item.Man_price   = util.dealDivision( item.pay_sum , item.pay_user , 2);
        }

        if(query.main_show_type_filter == "chart"){
            let map = {} , result = {} , 
                filter = query.filter_key;
            let i = data.rows[0].indexOf(filter),
                names=data.cols[0][i].caption;

            map.pv = names;
            let max = 0;
            for(let item of source){
                result[item.sales_province] = {
                    "pv" : item[filter]
                }
                if(item[filter] > max){
                    max = item[filter];
                }
            }

            return [{
                type : "map",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                    toolBox : {
                        "dataView" : {
                            "readOnly" : true
                        }
                    },
                    "mapMaxValue" : max
                }
            }]
        }
       
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    tradeFour(data, query , dates) {

        console.log(query);

        let source = data.first.data[0],
            count = data.first.count;
            
        for(var key of source) {
            key.pay_money_amount = key.pay_money_amount.toFixed(2);
            key.pay_money_amount_ratio = util.toFixed(key.pay_money_amount, sourceSum["0"]);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};