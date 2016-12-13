
/**
 * 返利分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment");

module.exports = {
    //返利统计
    rebate_total_01(query , params , sendData){
        params.date = util.beforeDate(new Date() , 2)[1];
        return params;
    },
    rebate_total_01_f(data, query, dates){
        let source = data.first.data[0];
        return util.toTable([source], data.rows, data.cols);
    },
    //返利总览
    rebate_total_02(query , params , sendData){
        return params;
    },
    rebate_total_02_f(data, query, dates){
        let source = data.first.data[0];
        let Result = {"expect_rebate_amount":0};

        for(let item of source){
            for(let key of data.rows[0]){
                if(Result[key]){
                    Result[key] += item[key];
                }else{
                    Result[key] = item[key];
                }
            }
        }

        return util.toTable([[Result]], data.rows, data.cols);
    },
    //返利订单趋势
    rebate_total_03(query , params , sendData){
        return params;
    },
    rebate_total_03_f(data, query, dates){
        let source = data.first.data[0];
        let map = {} , result = {};

        for(let i=1;i<data.rows[0].length;i++){
            map[data.rows[0][i]] = data.cols[0][i].caption;
        }

        for(let date of dates){
            let obj = {};
            for(let key in map){
                obj[key] = 0;
            }
            result[date] = obj;
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            if(result[item.date]){
                result[item.date] = item;
            }
        }

        if(query.main_show_type_filter == "table"){
            return util.toTable([source], data.rows, data.cols);
        }else{
            return [{
                type : "line",
                map : map,
                data : result,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }];
        }
    },


    //返利占比
    rebate_total_04(query , params , sendData){
        return params;
    },
    rebate_total_04_f(data, query, dates){
        let source = data.first.data[0],
            newData = {
                "平台返利" : {
                    value : 0
                },
                "商家返利" : {
                    value : 0
                }
            },
            newData2 = {
                "平台返利" : {
                    value : 0
                },
                "商家返利" : {
                    value : 0
                }
            };

        for(let item of source){
            if(item.plan_type == 3){
                //商家
                newData["商家返利"].value += item.expect_rebate_amount;
                newData2["商家返利"].value += item.is_over_rebate_order_amount;
            }else{
                newData["平台返利"].value += item.expect_rebate_amount;
                newData2["平台返利"].value += item.is_over_rebate_order_amount;
            }
        }
       
        return [{
            type : "pie",
            map : {
                value : "预计返利金额"
            },
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false, //柱状图竖着
                noline : true
            }
        },{
            type : "pie",
            map : {
                value : "返利到账金额"
            },
            data : newData2,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false, //柱状图竖着
                noline : true
            }
        }];
    },


    //返利功能详情
    rebate_total_05(query , params , sendData){
        return params;
    },
    rebate_total_05_second(query , params , sendData){
        // return {"status" : 1};
        params.gg = "he";
        return params;
    },
    rebate_total_05_f(data, query, dates){
        let source = data.first.data[0];
        // let Result = {"expect_rebate_amount":0};

        // for(let item of source){
        //     for(let key of data.rows[0]){
        //         if(Result[key]){
        //             Result[key] += item[key];
        //         }else{
        //             Result[key] = item[key];
        //         }
        //     }
        // }

        return util.toTable([source], data.rows, data.cols);
    },
}
