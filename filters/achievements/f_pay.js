/**
 * Created by Hao on 2016-05-18.
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    //支付趋势
    payOne(data , query , dates) {
        let source = data.first.data[0];
        for(let item of source){
            item.date = util.getDate(item.date);
            item.pay_lv = util.dealDivision( item.pay_num , item.order_num , 4);
        }


        if(query.main_show_type_filter == "chart"){
            /* chart */
            let map = {} , result = {};
            for(let i=1;i<data.rows[0].length;i++){
                map[data.rows[0][i]] = data.cols[0][i].caption;
            }

            dates.map((date)=>{
                let obj = {};
                for(let key in map){
                    obj[key] = 0;
                }
                result[date] = obj;
            });

            for(let item of source){
                let thisobj = result[item.date];
                for(let key in map){
                    thisobj[key] = item[key];
                    if(key == "pay_lv"){
                        thisobj[key] = util.numberLeave(thisobj[key]*100 , 2);
                    }
                }
            }

            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }]
        }else{
            for(let item of source){
                item.pay_lv = util.toFixed( item.pay_lv , 0 );
            }
            return util.toTable([source], data.rows, data.cols);
        }
    },

    //支付方式
    payTwo(data, query, dates) {
        let source = data.first.data[0],
            Resource = [] , result = {};

        dates.map((date)=>{
            result[date] = {
                "weixin":0,
                "alipay":0,
                "other" :0
            }
        });

        for(let item of source){
            item.date = util.getDate(item.date);
            switch(item.order_channel){
                case "微信":
                    result[item.date].weixin += item.pay_succ_num;
                    break;
                case "支付宝":
                    result[item.date].alipay += item.pay_succ_num;
                    break;
                case "其他":
                    result[item.date].other += item.pay_succ_num;
                    break;
            }
        }

        for(let key in result){
            let obj = { "date":key };
            for(let n in result[key]){
                obj[n] = result[key][n];
            }
            Resource.push(obj);
        }

        if(query.main_show_type_filter == "chart"){
            /* chart */
            let map = {
                "weixin" : "微信",
                "alipay" : "支付宝",
                "other"  : "其它"
            }

            return [{
                type : "bar",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,1
                }
            }]
        }else{
            return util.toTable([Resource], data.rows, data.cols);
        }
    },

    //支付构成
    payThree(data , query , dates) {
        let source = data.first.data[0],
            //B 国美币
            //M 现金
            //Y 优惠券
            Rows   = ["B" , "M" , "B_M" , "B_Y" , "Y_M" , "B_M_Y"],
            Source = [],
            result = {};

        data.rows[0] = Rows;

        dates.map((date)=>{
            let obj = {};
            Rows.map((key)=>{
                obj[key] = 0;
            });
            result[date] = obj;
        });

        Rows.unshift("date");

        for(let item of source){
            item.date = util.getDate(item.date);
            let theObj = result[item.date];
            switch(item.order_constitute){
                case "仅国美币":
                    theObj.B += item.pay_num;
                    break;
                case "仅现金":
                theObj.M += item.pay_num;
                    break;
                case "国美币+现金":
                theObj.B_M += item.pay_num;
                    break;
                case "国美币+优惠劵":
                theObj.B_Y += item.pay_num;
                    break;
                case "优惠劵+现金":
                theObj.Y_M += item.pay_num;
                    break;
                case "国美币+优惠券+现金":
                theObj.B_M_Y += item.pay_num;
                    break;
            }
        }

        if(query.main_show_type_filter == "chart"){
            /* chart */
            let map = {};
            for(let i=1;i<Rows.length;i++){
                map[Rows[i]] = data.cols[0][i].caption;
            }

            return [{
                type : "pie",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,1
                }
            }]
        }else{
            for(let key in result){
                let obj = {"date" : key};
                for(let n in result[key]){
                    obj[n] = result[key][n];
                }

                Source.push(obj);
            }

            return util.toTable([Source], data.rows, data.cols);
        }
    }
};

