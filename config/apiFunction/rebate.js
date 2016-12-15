
/**
 * 返利分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment"),
    orm  = require("orm");

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
        return {};
    },
    rebate_total_05_f(data, query, dates){
        let source = data.first.data[0],
            secondSource = data.second.data[0];
        for(let item of source){
            for(let value of secondSource){
                if(item.plan_type == value.type_code && item.rebate_type == value.flow_code){
                    item.type_name = value.type_name;
                    item.flow_name = value.flow_name;
                    item.flow_name_prefix = value.flow_name.split("-")[0];
                }
            }
        }
        return util.toTable([source], data.rows, data.cols);
    },

    //返利订单总览
    rebate_platformAll_01(query , params , sendData){
        return params;
    },
    rebate_platformAll_01_f(data, query, dates){
        let source = data.first.data[0];
        let Rows  = util.megerArray([] , data.rows);
        let ThisOne = {} , AllOne = {};

        //整理数据
        for(let item of source){
            let Obj;
            if(item.category_id_1 == "ALL" && item.category_id_2 == "ALL" && item.category_id_3 == "ALL" && item.category_id_4 == "ALL"){
                //总数
                Obj = AllOne;
            }else{
                //单个
                Obj = ThisOne;
            }
            for(let key of Rows){
                if(key == "Blank"){
                    continue;
                }
                if(Obj[key]){
                    Obj[key] += item[key];
                }else{
                    Obj[key] = item[key];
                }
            }
        }

        if(Object.keys(ThisOne).length == 0){
            //all
            ThisOne = AllOne;
        }

        //拼装数据
        //表一
        let Table_1_row1 = {},Table_1_row2 = {};
        for(let key of data.rows[0]){
            if(key == "Blank") continue;
            Table_1_row1[key] = ThisOne[key];
            Table_1_row2[key] = util.toFixed( ThisOne[key] , AllOne[key]);
        }
        Table_1_row1["Blank"] = "返利订单";
        Table_1_row2["Blank"] = "总占比";

        //表三
        let Table_3_row1 = {},Table_3_row2 = {};
        for(let key of data.rows[2]){
            if(key == "Blank") continue;
            Table_3_row1[key] = ThisOne[key];
            Table_3_row2[key] = util.toFixed( ThisOne[key] , AllOne[key]);
        }
        Table_3_row1["Blank"] = "返利订单";
        Table_3_row2["Blank"] = "返利退货订单占比";

           
        return util.toTable([[Table_1_row1 , Table_1_row2] , [ThisOne] , [Table_3_row1 , Table_3_row2]], data.rows, data.cols);
    },
    rebate_platformAll_01_fixed(req , query , cb){
        query.category_id_1 = "ALL";
        query.category_id_2 = "ALL";
        query.category_id_3 = "ALL";
        query.category_id_4 = "ALL";
        let category_id = query.category_id;
        delete query.category_id;
        if(!category_id){
            cb(null , query);
        }else{
            req.models.ConfCategories.find({
                id : category_id
            } , 1 , (err , data)=>{
                if(err) cb(err);
                data = data[0];
                switch(data.level + 1){
                    case 1:
                    query.category_id_1 = [category_id , "ALL"];
                    break;
                    case 2:
                    query.category_id_2 = [category_id , "ALL"];
                        break;
                    case 3:
                    query.category_id_3 = [category_id , "ALL"];
                        break;
                    case 4:
                    query.category_id_4 = [category_id , "ALL"];
                        break;
                }
                cb(null , query);
            });
        }
    },
    rebate_platformAll_02_fixed(req , query , cb){
        query.category_id_1 = "ALL";
        query.category_id_2 = "ALL";
        query.category_id_3 = "ALL";
        query.category_id_4 = "ALL";
        let category_id = query.category_id;
        delete query.category_id;
        if(!category_id){
            cb(null , query);
        }else{
            req.models.ConfCategories.find({
                id : category_id
            } , 1 , (err , data)=>{
                if(err) cb(err);
                data = data[0];
                switch(data.level + 1){
                    case 1:
                    query.category_id_1 = category_id;
                    break;
                    case 2:
                    query.category_id_2 = category_id;
                        break;
                    case 3:
                    query.category_id_3 = category_id;
                        break;
                    case 4:
                    query.category_id_4 = category_id;
                        break;
                }
                cb(null , query);
            });
        }
    },

    //返利订单趋势
    rebate_platformAll_02(query , params , sendData){
        return params;
    },
    rebate_platformAll_02_f(data, query, dates){
        let source = data.first.data[0],
            map = {
                "6" : "单项单级返利",
                "1" : "平台基础返利",
                "2" : "平台促销返利",
                "5" : "邀请商户入驻返利"
            }, Result = {};
        // 计划类型:1.平台基础 2.平台促销 3.商家 4.所有 5.邀请商户入住返利 6.单项单级返利
        for(let date of dates){
            Result[date] = {
                "6" : 0,
                "1" : 0,
                "2" : 0,
                "5" : 0
            };
        }

        let colum = query.filter_key;
        for(let item of source){
            item.date = util.getDate(item.date);
            if(Result[item.date][item.plan_type] != undefined){
                Result[item.date][item.plan_type] += item[colum];
            }else{
                continue;
            }
        }
           
        return [{
            type : "line",
            map : map,
            data : Result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },

    //返利层级分布
    rebate_platformAll_03(query , params , sendData){
        return params;
    },
    rebate_platformAll_03_f(data, query, dates){

        let firstSource = data.first.data[0],
            secondSource = data.second.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        let param1 = {
            "6" : "单项单级返利",
            "1" : "平台基础返利",
            "2" : "平台促销返利",
            "5" : "邀请商户入驻返利"
        },  param2 = {
            "1" : "1级计划",
            "2" : "2级计划",
            "3" : "3级计划",
            "4" : "4级计划",
            "5" : "5级计划",
            "6" : "6级计划",
        },  param3 = {
            "1" : "返利层级一",
            "2" : "返利层级二",
            "3" : "返利层级三",
            "4" : "返利层级四",
            "5" : "返利层级五",
            "6" : "返利层级六",
        };

        //init data1.
        for(let key in param1){
            Result1[param1[key]] = {value:0};
        }

        for(let item of firstSource){
            if(param1[item.plan_type]){
                 Result1[param1[item.plan_type]].value += item[filter_key];
            }
        }

        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }

        for(let item of secondSource){
            if(param2[item.rebate_level]){
                Result2[param2[item.rebate_level]].value += item[filter_key];
            }
        }

        //init data3.
        
           
           
        return [{
            type : "pie",
            map : {value:"0"},
            data : Result1,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "pie",
            map : {value:"0"},
            data : Result2,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },
}
