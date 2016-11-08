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

        return util.toTable([[result], [result]], data.rows, data.cols , null , [true,true]);
    },

    //交易商品汇总
    tradePanelTwo(data, query, dates) {
        let source = data.first.data[0];
        let result = {};
        for(let key of data.rows[0]){
            if(key == "operating"){
                result[key] = `<button class='btn btn-info' url_detail='/achievements/tradePanelTwo_add'>趋势</button>`;
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

        return util.toTable([[result]], data.rows, data.cols , null , [true]);
    },
    //趋势分析补充
    tradePanelTwo_add(data , query , dates){
        let source = data.first.data[0],
            count  = data.first.count;
        let result = {};
        let map = {
            "access_user" : "浏览商品数",
            "order_user": "下单商品件数",
            "order_num": "支付商品件数"
        }
        for(let date of dates){
            result[date] = {
                "access_user" : 0,
                "order_user"  : 0,
                "order_num"   : 0
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            for(let key in result[item.date]){
                result[item.date][key] += item[key]
            }
        }

        if(source.length == 0){
            //没有数据时让表出来
            source[0] = {
                "date" : "查询时间段无数据",
                "access_user" : 0,
                "order_user"  : 0,
                "order_num"   : 0
            }
            count = 1;
        }

        let out = util.toTable([source], data.rows, data.cols , [count]);
        return [out[0] , {
            type : "line",
            map : map,
            data : result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },


    //支付方式汇总
    tradePanelThree(data, query, dates) {
        let source = data.first.data[0];
        let result = {};
        for(let key of data.rows[0]){
            if(key == "operating"){
                result[key] = `<button class='btn btn-info' url_detail='/achievements/tradePanelThree_add'>趋势</button>`;
            }else{
                result[key] = 0;
            }
        }

        for(let item of source){
            switch(item.order_channel){
                case "ALL":
                    result.all_pay_num += item.pay_num;
                    break;
                case "微信":
                    result.aliy_pay += item.pay_num;
                    break;
                case "支付宝":
                    result.weixin_pay += item.pay_num;
                    break;
                case "其它":
                    result.other_pay += item.pay_num;
                    break;
            }
        }

        return util.toTable([[result]], data.rows, data.cols , null , [true]);
    },
    //支付方式汇总--补充
    tradePanelThree_add(data , query , dates){
        let source = data.first.data[0],
            Result = [],
            count  = data.first.count || 1;
        let result = {};
        let map = {
            "all_pay_num" : "总支付笔数",
            "aliy_pay": "支付宝支付笔数",
            "weixin_pay": "微信支付笔数",
            "other_pay" : "其它支付笔数"
        }
        for(let date of dates){
            result[date] = {
                "all_pay_num" : 0,
                "aliy_pay"    : 0,
                "weixin_pay"  : 0,
                "other_pay"   : 0
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            switch(item.order_channel){
                case "ALL":
                    result[item.date].all_pay_num += item.pay_num;
                    break;
                case "微信":
                    result[item.date].aliy_pay += item.pay_num;
                    break;
                case "支付宝":
                    result[item.date].weixin_pay += item.pay_num;
                    break;
                case "其它":
                    result[item.date].other_pay += item.pay_num;
                    break;
            }
        }

        let TableSource = [];
        for(let key in result){
            let obj = {};
            for(let n in result[key]){
                obj["date"] = key;
                obj[n] = result[key][n];
            }
            TableSource.push(obj);
        }

        let out = util.toTable([TableSource], data.rows, data.cols , [count]);
        return [out[0] , {
            type : "line",
            map : map,
            data : result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },
   


    //国美币汇总
    tradePanelFour(data, query, dates) {

        let source = data.first.data[0];
        let result = {};
        for(let key of data.rows[0]){
            if(key == "operating"){
                result[key] = `<button class='btn btn-info' url_detail='/achievements/tradePanelFour_add'>趋势</button>`;
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

        return util.toTable([[result]], data.rows, data.cols , null , [true]);
    },
    //国美币汇总--补充
    tradePanelFour_add(data , query , dates){
        let source = data.first.data[0],
            Result = [],
            count  = data.first.count || 1;
        let result = {};

        let map = {
            "newadd_guomeibi" : "新增国美币",
            "consume_guomeibi": "消费国美币",
            "drawcash_guomeibi": "提现国美币",
        }
        for(let date of dates){
            result[date] = {
                "newadd_guomeibi"    : 0,
                "consume_guomeibi"   : 0,
                "drawcash_guomeibi"  : 0
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            for(let key in result[item.date]){
                result[item.date][key] += item[key];
            }
        }

        if(source.length == 0){ source[0] = {"date":"暂无数据"} };

        let out = util.toTable([source], data.rows, data.cols , [count]);
        return [out[0] , {
            type : "line",
            map : map,
            data : result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },


    //交易优惠券汇总
    tradePanelFive(data, query, dates) {
        let source = data.first.data[0],
            Table1 = {
                "used_num" : 0, 
                "used_amount" : 0 ,
                "pay_num" : 0,
                "lv" : "0%"
            },
            Table2 = {
                "used_num" : 0, 
                "used_amount" : 0 ,
                "pay_num" : 0,
                "lv" : "0%",
                "operating" : `<button class='btn btn-info' url_detail='/achievements/tradePanelFive_add'>趋势</button>`
            };

        for(let item of source){
            item.date = util.getDate(item.date);
            if(item.coupon_type == 1){
                //商家优惠劵
                Table1.used_num += item.used_num;
                Table1.used_amount += item.used_amount;
                Table1.pay_num += item.pay_num;
            }else{
                //平台优惠劵
                Table2.used_num += item.used_num;
                Table2.used_amount += item.used_amount;
                Table2.pay_num += item.pay_num;
            }
        }

        Table1.lv = util.toFixed(Table1.used_num / Table1.pay_num , 0);
        Table2.lv = util.toFixed(Table2.used_num / Table2.pay_num , 0);

        return util.toTable([[Table1] , [Table2]], data.rows, data.cols , null , [true , true]);
    },
    //交易优惠券汇总--补充
    tradePanelFive_add(data , query , dates){
        let source = data.first.data[0],
            Result = [],
            count  = data.first.count || 1;
        let result = {};

        let map = {
            "newadd_guomeibi" : "新增国美币",
            "consume_guomeibi": "消费国美币",
            "drawcash_guomeibi": "提现国美币",
        }
        for(let date of dates){
            result[date] = {
                "newadd_guomeibi"    : 0,
                "consume_guomeibi"   : 0,
                "drawcash_guomeibi"  : 0
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            for(let key in result[item.date]){
                result[item.date][key] += item[key];
            }
        }

        if(source.length == 0){ source[0] = {"date":"暂无数据"} };

        let out = util.toTable([source], data.rows, data.cols , [count]);
        return [out[0] , {
            type : "line",
            map : map,
            data : result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
};