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


        if(query.main_show_type_filter == "table"){
            for(let item of source){
                item.pay_lv = util.toFixed( item.pay_lv , 0 );
            }
            return util.toTable([source], data.rows, data.cols);
        }else{

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
            }];
        }
    },

    //支付方式
    payTwo(data, query, dates) {
        let source = data.first.data[0],
            Resource = [] , result = {};
        let Type = [];
        for(let item of source){
            item.date = util.getDate(item.date);
            if(Type.indexOf(item.order_channel) < 0 && item.order_channel.toUpperCase() != "ALL"){
                Type.push(item.order_channel);
            }
        }

        dates.reverse();
        dates.map((date)=>{
            result[date] = {};
            for(let item of Type){
                result[date][item] = 0;
            }
        });


        for(let item of source){
            if(result[item.date][item.order_channel] != undefined){
                result[item.date][item.order_channel] += item.pay_succ_num;
                result[item.date][item.order_channel] = util.numberLeave(result[item.date][item.order_channel] , 2);
            }
        }

        for(let key in result){
            let obj = { "date":key };
            for(let n in result[key]){
                obj[n] = result[key][n];
            }
            Resource.push(obj);
        }

        if(query.main_show_type_filter == "table"){
            data.rows[0] = ["date"].concat(Type);
            data.cols[0] = [];
            for(let key of Type){
                let obj = {
                    "caption" : key,
                    "type" : "number"
                }
                data.cols[0].push(obj);
            }
            data.cols[0].unshift({"caption":"日期","type":"date"});

            return util.toTable([Resource], data.rows, data.cols);
        }else{
            /* chart */
            let map = {};
            for(let key of Type){
                map[key] = key;
            }

            return [{
                type : "bar",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,1
                }
            }]
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

        dates.reverse();
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

        if(query.main_show_type_filter == "table"){
            for(let key in result){
                let obj = {"date" : key};
                for(let n in result[key]){
                    obj[n] = result[key][n];
                }

                Source.push(obj);
            }

            return util.toTable([Source], data.rows, data.cols);
        }else{
            

            /* chart */
            let map = { value : "支付构成" } , Result = {};
            let Cols = data.cols[0];
            for(let i=1;i<Cols.length;i++){
                Result[Cols[i].caption] = { value : 0 };
            }

            for(let item of source){
                Result[item.order_constitute] ? Result[item.order_constitute].value += item.pay_num : "";
            }

            return [{
                type : "pie",
                map : map,
                data : Result,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,1
                }
            }];
        }
    }
};

