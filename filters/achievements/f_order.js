/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    //订单趋势
    orderOne(data , query , dates) {
        let Cols = [
                "日期",
                "下单总量",
                "支付总量",
                "下单人数",
                "支付人数",
                "确认收货",
                "延迟收货",
                "取消订单",
                "申请售后",
                "评价订单"
            ],
            Rows = [
                "date",
                "order_num",
                "pay_num",
                "order_user",
                "pay_user",
                "ensure_get_commodity",
                "delay_get_commodity",
                "cancel_order",
                "apply_aftersale",
                "evaluate_order"
            ];
        data.rows[0] = Rows;
        data.cols[0] = [];
        Cols.map((item , index) => {
            let obj = {
                caption : item,
                type : index == 0 ? "date" : "number"
            }
            data.cols[0].push(obj);
        });

        let source = data.first.data[0];
        

        /* chart */
        let map = {
            "scan_order" : "浏览-下单",
            "scan_pay"   : "浏览-支付",
            "order_pay"  : "下单-支付",
            "pay_lv"     : "支付成功率"
        }, result = {};

        dates.map((date) => {
            result[date] = {
                "scan_order" : 0,
                "scan_pay"   : 0,
                "order_pay"  : 0,
                "pay_lv"     : 0
            }
        });

        for(let item of source){
            item.date = util.getDate(item.date);
        }



        

        if(query.main_show_type_filter == "chart"){
            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }]
        }else{
            return util.toTable([source], data.rows, data.cols);
        }

        


/*
"日期",
"下单总量",
"支付总量",
"下单人数",
"支付人数",
"确认收货",
"延迟收货",
"取消订单",
"申请售后",
"评价订单",

 

*/

        



       /* 
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

        two.Man_price = util.dealDivision(all_pay_sum , all_pay_user , 2);*/
        
    },

    //订单来源类型
    orderTwo(data, query, dates) {
        let source = data.first.data[0],
            count  = data.first.count || 1,
            sum    = data.first.sum;
        
        for(let item of source){
            item.order_num_lv = util.toFixed( util.dealDivision(item.order_num , sum[0]) , 0 );
            item.pay_num_lv = util.toFixed( util.dealDivision(item.pay_num , sum[1]) , 0 );
            item.pay_sum_lv = util.toFixed( util.dealDivision(item.pay_sum , sum[2]) , 0 );
        }

        return util.toTable([source], data.rows, data.cols , [count]);
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

        let source = data.first.data[0],
            count = data.first.count || 1;

        let num = query.filter_key , All_pay_sum = 1;

        for(let item of source) {
            if(!num){
                item.category_name = "ALL";
                All_pay_sum = item.pay_sum;
            }else{
                item.category_name = item["category_name_"+num];
                if(item["category_id_"+num] == "ALL"){
                    All_pay_sum = item.pay_sum;
                }
            }
        }

        for(let item of source){
            item.pay_sum_lv = util.toFixed( item.pay_sum / All_pay_sum , 0 );
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};