
/**
 * 性能分析 模块功能函数文件
*/

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    one(query , params , sendData){
        if(!query.type) params.type = "ALL";
        return params;
    },
    f_one(data, query, dates){
        let source = data.first.data[0];
        let rows   = ["access_user" , "order_user" , "order_num" , "order_sum" ,"Man_price" , "pay_user" , "pay_num" , "pay_sum"];
        let Cols = [
            [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }]
        ];

        let result = {};
        for(let key of rows){
            result[key] = 0;
        }

        let All_pay_sum = 0 , All_pay_user = 0;
        for(let item of source){
            for(let key of rows){
                result[key] += item[key];
                result[key] = util.numberLeave(result[key] , 2);
            }
            All_pay_sum += item.pay_sum;
            All_pay_user +=item.pay_user;
        }

        result.Man_price = util.numberLeave(All_pay_sum / All_pay_user , 2);

        let OneData = {
            "access_user" : "访客数 : " + result.access_user,
            "order_user"  : "下单人数 : " + result.order_user,
            "order_num"   : "下单总量 : " + result.order_num,
            "order_sum"   : "下单金额 : " + result.order_sum
        }

        let TwoData = {
            "access_user" : "客单价 : " + result.Man_price,
            "order_user"  : "支付人数 : " + result.pay_user,
            "order_num"   : "支付总量 : " + result.pay_num,
            "order_sum"   : "支付金额 : " + result.pay_sum
        }


        console.log("fileter")
        return util.toTable([[OneData , TwoData]], data.rows, Cols);
    }
}
