/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils"),
    moment = require("moment");

/* compute */
let Compute1 = (arr , result , num , num2) => {
    arr.map((item) => {
        result[item.date].value = util.dealDivision(item[num] , item[num2] , 4)*100;
    });
}


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

        let source = data.first.data[0],
            source2= data.second.data[0];
        for(let item of source){
            item.date = util.getDate(item.date);
        }
        for(let item of source2){
            item.date = util.getDate(item.date);
        }

        if(query.main_show_type_filter == "table"){
            return util.toTable([source], data.rows, data.cols);
        }else{
            /* chart */
            let filter_key = query.filter_key;
            let mapAdd = {
                "scan_order" : "浏览-下单(%)",
                "scan_pay"   : "浏览-支付(%)",
                "order_pay"  : "下单-支付(%)",
                "pay_lv"     : "支付成功率(%)"
            }, result = {} , map = { value : "" };
            
            dates.reverse();
            dates.map((date) => {
                result[date] = {
                    "value" : 0
                }
            });
            
            if(filter_key in mapAdd){
                map.value = mapAdd[filter_key];
            }else{
                map.value = Cols[Rows.indexOf(filter_key)];
            }

            switch(filter_key){
                case "scan_order":
                    Compute1(source2 , result , "order_user" , "access_user");
                    break;
                case "scan_pay":
                    Compute1(source2 , result , "pay_user" , "access_user");
                    break;
                case "order_pay":
                    Compute1(source2 , result , "pay_user" , "order_user");
                    break;
                case "pay_lv":
                    Compute1(source2 , result , "pay_num" , "pay_time");
                    break;
                default:
                    source.map((item) => {
                        result[item.date].value = item[filter_key];
                    });
            }

            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }]
        }
    },

    //订单来源类型
    orderTwo(data, query, dates) {
        let source = data.first.data[0],
            count  = data.first.count || 1,
            sum    = data.first.sum,
            Result = {};

        let keyValue = {
            "01" : "社交",
            "02" : "返利",
            "03" : "搜索",
            "04" : "推荐",
            "05" : "运营位",
            "06" : "活动",
            "07" : "分享"
        };

        for(let item of source){
            if(!keyValue.hasOwnProperty(item.order_source)){
                keyValue[item.order_source] = item.order_source;
            }
                
            if(!Result[keyValue[item.order_source]]){
                Result[keyValue[item.order_source]] = {
                    "order_num" : 0,
                    "pay_num"   : 0,
                    "pay_sum"   : 0
                }
            }

            Result[keyValue[item.order_source]].order_num += item.order_num;
            Result[keyValue[item.order_source]].pay_num += item.pay_num;
            Result[keyValue[item.order_source]].pay_sum += item.pay_sum;
        }

        let RESULT = [];
        for(let key in Result){
            let obj = {};
            obj["order_source"] = key;
            obj["order_num"]    = Result[key].order_num;
            obj["order_num_lv"] = util.toFixed( util.dealDivision(Result[key].order_num , sum[0]) , 0 );
            obj["pay_num"]      = Result[key].pay_num;
            obj["pay_num_lv"]   = util.toFixed( util.dealDivision(Result[key].pay_num , sum[1]) , 0 );
            obj.pay_sum         = Result[key].pay_sum;
            obj.pay_sum_lv      = util.toFixed( util.dealDivision(Result[key].pay_sum , sum[2]) , 0 );

            RESULT.push(obj);
        }

        return util.toTable([RESULT], data.rows, data.cols , [count]);
    },
    orderThree(data , query , dates) {
        let map = {
            "pro_desc":"商品描述",
            "seller_service":"卖家服务",
            "logistics_service":"物流服务"
        };
        let source = data.first.data[0];
        let newData = {};
        let score = ["5" , "4.6-4.9" , "4.1-4.5" , "3.6-4.0" , "3.1-3.5" , "2.1-3.0" , "0-2.0"];

        for(let key of score){
            newData[key] = {
                "pro_desc" : 0,
                "seller_service"  : 0,
                "logistics_service"  : 0
            }
        }

        for(let item of source){
            // console.log(item.pro_desc , item.seller_service , item.logistics_service);
            if(item.pro_desc != "ALL" && item.seller_service == "ALL" && item.logistics_service == "ALL"){
                //处理商品描述  pro_desc
                if(!item.pro_desc) continue;
                newData[item.pro_desc].pro_desc += item.evaluate_level_scope_user;
            }else if(item.pro_desc == "ALL" && item.seller_service != "ALL" && item.logistics_service == "ALL"){
                //处理卖家服务  seller_service
                if(!item.seller_service) continue;
                newData[item.seller_service].seller_service += item.evaluate_level_scope_user;
            }else if(item.pro_desc == "ALL" && item.seller_service == "ALL" && item.logistics_service != "ALL"){
                //处理物流服务
                if(!item.logistics_service) continue;
                newData[item.logistics_service].logistics_service += item.evaluate_level_scope_user;
            }
        }

        return [{
            type : "bar",
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
};

