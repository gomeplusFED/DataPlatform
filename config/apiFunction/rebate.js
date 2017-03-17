/**
 * 返利分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment"),
    orm  = require("orm"),
    _ = require("lodash");

let eventproxy = require("eventproxy");

//金额 字段 全部/100.
// let Deal100 = (arr) => {
//     let HasColums = ["is_rebate_fee" , "is_rebate_item_fee" , "is_rebate_back_merchandise_amount" , "is_over_rebate_order_amount" , "expect_rebate_amount" , "cancel_rebate_amount" , "cancel_is_rebate_fee" , "history_is_rebate_fee" , "history_is_rebate_item_fee" , "history_is_rebate_back_merchandise_amount" , "history_is_over_rebate_order_amount" , "history_expect_rebate_amount" , "history_cancel_rebate_amount" , "history_cancel_is_rebate_fee" , "fee" , "item_fee" , "back_merchandise_amount" , ]
// };

let Deal100 = (arr , columns) => {
    if(arr instanceof Array){
        for(let item of arr){
            for(let key of columns){
                if(item[key]){
                    item[key] = item[key] / 100;
                }
            }
        } 
    }else{
        for(let key of columns){
            if(arr[key]){
                arr[key] = arr[key] / 100;
            }
        }
    }

    return arr;
}

module.exports = {
    //返利统计
    rebate_total_01(query , params , sendData){
        params.date = util.beforeDate(new Date() , 2)[1];
        return params;
    },
    rebate_total_01_f(data, query, dates){
        let source = data.first.data[0];
        source = Deal100(source , ["history_expect_rebate_amount" , "history_cancel_is_rebate_fee" , "history_is_over_rebate_order_amount" , "history_cancel_rebate_amount"]);
        let rows = [[]];
        let cols = [[]];
        const obj = {};
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i !== 0 && i !== 3 && i !== 5) {
                obj[data.rows[0][i]] = 0;
                rows[0].push(data.rows[0][i]);
                cols[0].push(data.cols[0][i]);
            }
        }

        for(let item of source) {
            for(let key in obj) {
                obj[key] += item[key];
            }
        }

        return util.toTable([[obj]], rows, cols);
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

        data.cols[0][5].caption = "返利到账配送单数";

        Result = Deal100(Result , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);

        return util.toTable([[Result]], data.rows, data.cols);
    },
    //返利订单趋势
    rebate_total_03(query , params , sendData){
        return params;
    },
    rebate_total_03_f(data, query, dates){
        let source = data.first.data[0];
        let map = {} , result = {};

        //TODO 改动start
        let rows = [],
            cols = [];
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i !== 6) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            }
        }
        //TODO 改动end
        for(let i=1;i<rows.length;i++){
            map[rows[i]] = cols[i].caption;
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
            item = Deal100(item , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);
            if(result[item.date]){
                result[item.date] = item;
            }
        }

        if(query.main_show_type_filter == "table"){
            for(let item of source) {
                for(let key of ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]) {
                    item[key] = (item[key] / 100).toFixed(2);
                }
                // Deal100(item , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);
            }
            // source = Deal100(item , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);
            return util.toTable([source], [rows], [cols]);
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
            item = Deal100(item , ["expect_rebate_amount" , "is_over_rebate_order_amount"]);
            if(item.plan_type == 3){
                //商家
                newData["商家返利"].value += item.expect_rebate_amount;
                newData2["商家返利"].value += item.is_over_rebate_order_amount;

                newData["商家返利"].value = util.numberLeave(newData["商家返利"].value , 2);
                newData2["商家返利"].value = util.numberLeave(newData2["商家返利"].value , 2);
            }else{
                newData["平台返利"].value += item.expect_rebate_amount;
                newData2["平台返利"].value += item.is_over_rebate_order_amount;

                newData["平台返利"].value = util.numberLeave(newData["平台返利"].value , 2);
                newData2["平台返利"].value = util.numberLeave(newData2["平台返利"].value , 2);

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
        params.rebate_type = orm.gt(-1);
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

        source = Deal100(source , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);
        return util.toTable([source], data.rows, data.cols);
    },

    //返利订单总览
    rebate_platformAll_01(query , params , sendData){
        return params;
    },
    rebate_platformAll_01_f(data, query, dates){
        let source = data.first.data[0];
        let DealArr1 = [null , "unique_order_num" , "fee" , "unique_shop_num" , "unique_user_num" , "merchandise_num" , "cancel_order_num"];
        let DealArr3 = [null , "unique_back_merchandise_num" , "back_merchandise_num" , "unique_back_user_num" , "back_merchandise_amount"];
        //TODO 改动start
        data.cols[0][2].caption = "商品总金额";
        data.rows[0][2] = "is_rebate_item_fee";
        DealArr1.push("item_fee");
        data.cols[1][3].caption = "返利到账配送单数";
        let rows = [];
        let cols = [];
        for(let i = 0, len = data.rows[2].length; i < len; i++) {
            if(i != 1) {
                rows.push(data.rows[2][i]);
                cols.push(data.cols[2][i]);
            }
        }
        //TODO 改动end

        let Rows  = util.megerArray([] , [data.rows , DealArr1 , DealArr3]);
        let ThisOne = {
            "expect_rebate_amount":0
        } , AllOne = {};

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

        if(Object.keys(ThisOne).length <= 3){
            //all
            ThisOne = AllOne;
        }

        // for(let key of data.rows[1]){
        //     ThisOne[key] = 0;
        // }

        //拼装数据
        //表一
        

        let Table_1_row1 = {},Table_1_row2 = {};
        /*for(let key of data.rows[0]){
            if(key == "Blank") continue;
            Table_1_row1[key] = ThisOne[key] || 0;
            Table_1_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[key] || 0);
        }*/
        Table_1_row1["Blank"] = "返利订单";
        Table_1_row2["Blank"] = "总占比";

        for(let i=1;i<data.rows[0].length;i++){
            let key = data.rows[0][i];
            Table_1_row1[key] = ThisOne[key] || 0;
            Table_1_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[DealArr1[i]] || 0);
        }
        //TODO 改动start
        Table_1_row2.is_rebate_item_fee = util.toFixed(Table_1_row1.is_rebate_item_fee, AllOne.item_fee);
        Table_1_row1.is_rebate_item_fee = (Table_1_row1.is_rebate_item_fee / 100).toFixed(2);
        //TODO 改动end



        //表三
        

        let Table_3_row1 = {},Table_3_row2 = {};
        /*for(let key of data.rows[2]){
            if(key == "Blank") continue;
            Table_3_row1[key] = ThisOne[key] || 0;
            Table_3_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[key] || 0);
        }*/
        Table_3_row1["Blank"] = "返利订单";
        Table_3_row2["Blank"] = "返利退货订单占比";

        for(let i=1;i<data.rows[2].length;i++){
            let key = data.rows[2][i];
            Table_3_row1[key] = ThisOne[key] || 0;
            Table_3_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[DealArr3[i]] || 0);
        }

        Table_1_row1 = Deal100(Table_1_row1 , ["is_rebate_fee"]);
        ThisOne      = Deal100(ThisOne , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount"]);
        Table_3_row1 = Deal100(Table_3_row1 , ["is_rebate_back_merchandise_amount"]);

        // Table_1_row1.is_rebate_fee = Table_1_row1.is_rebate_fee.toFixed(2);
        // Table_1_row1.expect_rebate_amount = Table_1_row1.expect_rebate_amount.toFixed(2);
        Table_1_row1.cancel_rebate_amount = Table_1_row1.cancel_rebate_amount.toFixed(2);
        Table_1_row1.is_over_rebate_order_amount = Table_1_row1.is_over_rebate_order_amount.toFixed(2);
        Table_1_row1.is_rebate_back_merchandise_amount = Table_1_row1.is_rebate_back_merchandise_amount.toFixed(2);

        return util.toTable([[Table_1_row1 , Table_1_row2] , [ThisOne] , [Table_3_row1
            // , Table_3_row2
        ]], [data.rows[0], data.rows[1], rows], [data.cols[0], data.cols[1], cols]);
    },
    rebate_platformAll_01_fixed(req , query , cb){
        query.category_id_1 = "ALL";
        query.category_id_2 = "ALL";
        query.category_id_3 = "ALL";
        query.category_id_4 = "ALL";
        let category_id = query.category_id;
        delete query.category_id;
        if(!category_id && category_id == "all"){
            cb(null , query);
        }else{
            req.models.ConfCategories.find({
                id : category_id
            } , 1 , (err , data)=>{
                if(err) cb(err);
                if(data.length == 0){
                    return cb(null , query);
                }
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
        if(!category_id && category_id == "all"){
            cb(null , query);
        }else{
            req.models.ConfCategories.find({
                id : category_id
            } , 1 , (err , data)=>{
                if(err) cb(err);
                if(data.length == 0){
                    return cb(null , query);
                }
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
            item = Deal100(item , ["is_rebate_item_fee"]);
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
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
            item = Deal100(item , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param1[item.plan_type]){
                 Result1[param1[item.plan_type]].value += item[filter_key];
            }
        }

        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }

        for(let item of secondSource){
            item = Deal100(item , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);
            if(param2[item.rebate_level] && item.level == "ALL"){
                Result2[param2[item.rebate_level]].value += item[filter_key];
            }
        }

        //init data3.
        for(let key in param2){
            let obj = {};
            for(let one in param3){
                if(one > key){
                    continue;
                }
                obj[one] = 0;
            }
            Result3[param2[key]] = obj;
        }

        for(let item of secondSource){
            item = Deal100(item , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);
            if(param2[item.rebate_level] && item.level != "ALL"){
                Result3[param2[item.rebate_level]][item.level] += item[filter_key];
            }
        }
           
        return [{
            type : "pie",
            map : {value:"返利类型占比"},
            data : Result1,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "pie",
            map : {value:"返利层级占比"},
            data : Result2,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "bar",
            map : param3,
            data : Result3,
            config: { // 配置信息
                stack: true  // 图的堆叠
            }
        }];
    },


    //返利计划汇总
    rebate_platformAll_04(query , params , sendData){
        return params;
    },
    rebate_platformAll_04_second(query , params , sendData){
        return {};
    },
    rebate_platformAll_04_f(data, query, dates){
        let source = data.first.data[0],
            count  = data.first.count || 1,
            second = data.second.data[0];

        let TypeName = {} , FlowName = {};
        for(let item of second){
            if(!TypeName[item.type_code]){
                TypeName[item.type_code] = item.type_name;
            }
            if(!FlowName[item.flow_code]){
                FlowName[item.flow_code] = item.flow_name;
            }
        }


        query.page = query.page || 1;
        source.map((item , index) => {
            item.Number = (query.page - 1)*20 + index + 1;
            item.plan_type_Translate = TypeName[item.plan_type];
            item.rebate_type_Translate = FlowName[item.rebate_type];
            item["新增返利订单占比"] = util.toFixed( item.unique_is_rebate_order_num , item.unique_order_num || 0 );
        });
        //TODO 改动start
        if(data.cols[0][12]) data.cols[0][12].caption = "返利到账配送单数";
        if(data.cols[0][14]){
            data.cols[0][14].caption = "新增订单商品总金额";
            data.rows[0][14] = "is_rebate_item_fee";
        }
        let rows = [];
        let cols = [];
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i != 6 && len < 10) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            } else if(i != 7 && len > 10) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            }
        }
        //TODO 改动end

        source = Deal100(source , ["expect_rebate_amount","is_over_rebate_order_amount" , "is_rebate_fee" , "cancel_rebate_amount", "is_rebate_item_fee", "is_over_rebate_invite_amount"]);

        for(let key of source) {
            // key.expect_rebate_amount = key.expect_rebate_amount.toFixed(2);
            key.is_over_rebate_order_amount = key.is_over_rebate_order_amount.toFixed(2);
            key.is_rebate_fee = key.is_rebate_fee.toFixed(2);
            key.cancel_rebate_amount = key.cancel_rebate_amount.toFixed(2);
            key.is_rebate_item_fee = key.is_rebate_item_fee.toFixed(2);
            // key.is_over_rebate_invite_amount = key.is_over_rebate_invite_amount.toFixed(2);
        }

        return util.toTable([source] , [rows], [cols] , [count]);
    },
    rebate_platformAll_04_selectFilter(req , cb){
        req.models.TypeFlow.find({
            type : 1,
            status : 1
        }, (err, data) => {
            if(err) {
                cb(err);
            } else {
                var filter_select = [],
                    obj = {},
                    user_party = _.uniq(_.pluck(data, "type_code"));
                filter_select.push({
                    title: '使用方',
                    filter_key: 'plan_type',
                    groups : [
                        {
                            key: user_party,
                            value: '全部使用方',
                            cell: {
                                title: '关联流程',
                                filter_key : 'rebate_type',
                                groups : [{
                                    key: '',
                                    value: '全部相关流程'
                                }]
                            }
                        }
                    ]
                });
                for(var key of user_party) {
                    obj[key] = {
                        value: '',
                        cell: {
                            title: '关联流程',
                            filter_key : 'rebate_type',
                            groups : [{
                                key: '',
                                value: '全部相关流程'
                            }]
                        }
                    };
                }
                for(key of data) {
                    obj[key.type_code].value = key.type_name;
                    obj[key.type_code].key = key.type_code;
                    obj[key.type_code].cell.groups.push({
                        key : key.flow_code,
                        value : key.flow_name
                    });
                }
                for(key in obj) {
                    filter_select[0].groups.push(obj[key]);
                }
                cb(null, filter_select);
            }
        });
    },

    //平台基础返利 ---- 平台基础返利总览
    rebate_platformBase_01(query , params , sendData){
        // params.plan_type = 1;
        // rebate_platformBase_01
        params.category_id_1 = "ALL";
        params.category_id_2 = "ALL";
        params.category_id_3 = "ALL";
        params.category_id_4 = "ALL";

        return params;
    },
    rebate_platformBase_01_f(data, query, dates){
        //TODO 改动start
        let rows = [];
        let cols = [];
        data.rows[0][5] = "is_rebate_merchandise_num";
        data.cols[0][5].caption = "参与商品件数";
        data.rows[1][4] = "is_rebate_item_fee";
        data.cols[1][4].caption = "返利商品总金额";
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i != 3 && i != 6) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            }
        }
        //TODO 改动end
        let source = data.first.data[0];
        let Row = {};
        let Keys = [...data.rows[0] , ...data.rows[1]];

        for(let key of Keys){
            Row[key] = 0;
        }

        for(let item of source){
            for(let key of Keys){
                Row[key] += +item[key];
            }
        }

        // "unique_is_rebate_user_num",
        // "expect_rebate_user_num",
        



        Row = Deal100(Row , [
            "expect_rebate_amount",
            "cancel_rebate_amount",
            "is_rebate_fee",
            "is_over_rebate_order_amount",
            "is_rebate_back_merchandise_amount",
            "is_rebate_item_fee"
        ]);

        Row.expect_rebate_amount = Row.expect_rebate_amount.toFixed(2);
        Row.cancel_rebate_amount = Row.cancel_rebate_amount.toFixed(2);
        // Row.is_rebate_fee = Row.is_rebate_fee.toFixed(2);
        Row.is_over_rebate_order_amount = Row.is_over_rebate_order_amount.toFixed(2);
        Row.is_rebate_back_merchandise_amount = Row.is_rebate_back_merchandise_amount.toFixed(2);
        Row.is_rebate_item_fee = Row.is_rebate_item_fee.toFixed(2);

        return util.toTable([[Row] , [Row]], [rows, data.rows[1]], [cols, data.cols[1]]);
    },

    //平台基础返利 ---- 返利订单趋势
    rebate_platformBase_02(query , params , sendData){
        // params.plan_type = 1;

        // params.plan_type = 6;
        switch(params.plan_type){
            case 1:
                params.rebate_type = [1,2];
            break;
            case 2:
                params.rebate_type = [1,2];
            break;
            case 6:
                params.rebate_type = [11,12];
        }

        return params;
    },
    rebate_platformBase_02_f(data, query, dates){
        let source = data.first.data[0],
            filter_key = query.filter_key,
            Result = {};

        let typeFlow = {
            "1" : {
                "1" : "分享购买", 
                "2" : "邀请好友-购买返利"
            },
            "2" : {
                "1" : "分享购买",
                "2" : "邀请好友-购买返利"
            },
            "6" : {
                "11" : "单项单级返利-固定返利",
                "12" : "单项单级返利-比例返利"
            }
        };
        let using = typeFlow[query.plan_type];

        for(let date of dates){
            Result[date] = {};
            for(let key in using){
                Result[date][key] = 0;
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            item = Deal100(item , ["is_rebate_item_fee"]);

            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);

            if(Result[item.date][item.rebate_type] != undefined){
                Result[item.date][item.rebate_type] += item[filter_key];
            }
        }
        
        return [{
            type : "line",
            map : using,
            data : Result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },


    //平台基础返利 ---- 返利层级分布
    rebate_platformBase_03(query , params , sendData){
        // params.plan_type = 1;
        // params.plan_type = 6;
        switch(params.plan_type){
            case 1:
                params.rebate_type = [1,2];
                break;
            case 2:
                params.rebate_type = [1,2];
                break;
            case 6:
                params.rebate_type = [11,12];
        }
        return params;
    },
    rebate_platformBase_03_f(data, query, dates){
        let source = data.first.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        let param1 = {
            "1" : "分享购买",
            "2" : "分销购买"
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

        source = Deal100(source , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);

        //init data1.
        for(let key in param1){
            Result1[param1[key]] = {value:0};
        }

        for(let item of source){
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param1[item.plan_type] && item.level == "ALL"){
             Result1[param1[item.plan_type]].value += item[filter_key];

             Result1[param1[item.plan_type]].value = util.numberLeave( Result1[param1[item.plan_type]].value , 2 );
            }
        }

        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }

        for(let item of source){
            if(param2[item.rebate_level] && item.level == "ALL"){
                Result2[param2[item.rebate_level]].value += item[filter_key];

                Result2[param2[item.rebate_level]].value = util.numberLeave( Result2[param2[item.rebate_level]].value , 2 );
            }
        }

        //init data3.
        for(let key in param2){
            let obj = {};
            for(let one in param3){
                if(one > key){
                    continue;
                }
                obj[one] = 0;
            }
            Result3[param2[key]] = obj;
        }

        for(let item of source){
            if(param2[item.rebate_level] && item.level != "ALL"){
                Result3[param2[item.rebate_level]][item.level] += item[filter_key];
                Result3[param2[item.rebate_level]][item.level] = util.numberLeave( Result3[param2[item.rebate_level]][item.level] , 2 );
            }
        }
           
        return [{
            type : "pie",
            map : {value:"返利类型占比"},
            data : Result1,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "pie",
            map : {value:"返利层级占比"},
            data : Result2,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "bar",
            map : param3,
            data : Result3,
            config: { // 配置信息
                stack: true  // 图的堆叠
            }
        }];
    },

    //单项单级 -- 返利类型分布
    rebate_single_03(query , params , sendData){
        return params;
    },
    rebate_single_03_f(data, query, dates){
        let source = data.first.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        let param1 = {
            "12" : "比例返利",
            "11" : "固定返利"
        };

        source = Deal100(source , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);

        //init data1.
        for(let key in param1){
            Result1[param1[key]] = {value:0};
        }

        for(let item of source){
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param1[item.rebate_type]){
                Result1[param1[item.rebate_type]].value += +item[filter_key];
            }
        }

        //init data3.
        Result3 = {
            "比例返利" : { value:0 },
            "固定返利" : { value:0 }
        }

        for(let item of source){
            if(param1[item.rebate_type]){
                Result3[param1[item.rebate_type]].value += item[filter_key];
            }
        }
           
        return [{
            type : "pie",
            map : {value:"返利类型占比"},
            data : Result1,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "bar",
            map : {value:"返利类型"},
            data : Result3,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },

    //邀请商户分享返利--返利订单趋势
    rebate_invitation_01(query , params , sendData){
        params.rebate_type = 9;
        return params;
    },
    rebate_invitation_01_f(data, query, dates){
        let source = data.first.data[0],
            filter_key = query.filter_key,
            Result = {};

        source = Deal100(source , ["is_over_rebate_order_amount"]);

        for(let date of dates){
            Result[date] = {"1":0}
        }

        for(let item of source){
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);

            item.date = util.getDate(item.date);
            Result[item.date]["1"] = item[filter_key];
        }

        
        return [{
            type : "line",
            map : {
                "1" : "分享返利"
            },
            data : Result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },

    //邀请商户分享返利 -- 返利层级分布
    rebate_invitation_02(query , params , sendData){
        // params.plan_type = 1;
        params.level = orm.not_in(["all"]);
        return params;
    },
    rebate_invitation_02_f(data, query, dates){
        let source = data.first.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        source = Deal100(source , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);

        let param2 = {
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
        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }

        for(let item of source){
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param2[item.rebate_level]){
                Result2[param2[item.rebate_level]].value += item[filter_key];
            }
        }

        //init data3.
        for(let key in param2){
            let obj = {};
            for(let one in param3){
                if(one > key){
                    continue;
                }
                obj[one] = 0;
            }
            Result3[param2[key]] = obj;
        }

        for(let item of source){
            if(param2[item.rebate_level]){
                Result3[param2[item.rebate_level]][item.level] += item[filter_key];
            }
        }
           
        return [{
            type : "pie",
            map : {value:"返利层级分布"},
            data : Result2,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "bar",
            map : param3,
            data : Result3,
            config: { // 配置信息
                stack: true  // 图的堆叠
            }
        }];
    },


    //邀请注册／入驻 ---- 邀请好友注册总览
    rebate_regist_01(query , params , sendData){
        return params;
    },
    rebate_regist_01_f(data, query, dates){
        let source = data.first.data[0];

        let obj    = {
            "unique_rebate_invite_friend_planid_num" : 0,
            "unique_rebate_invite_friend_user_num" : 0,
            "unique_rebate_invite_friend_success_user_num" : 0,
            "is_over_rebate_invite_friend_amount" : 0,
            "all_register_user_num" : 0
        };

        for(let item of source) {
            for(let key in obj) {
                obj[key] += +item[key];
            }
        }

        obj.regist_lv = util.toFixed(obj.unique_rebate_invite_friend_success_user_num, obj.all_register_user_num);

        obj.is_over_rebate_invite_friend_amount = (obj.is_over_rebate_invite_friend_amount / 100).toFixed(2);
        return util.toTable([[obj]], data.rows, data.cols);
    },


    //邀请注册／入驻 ---- 邀请商户入驻总览
    rebate_regist_02(query , params , sendData){
        return params;
    },
    rebate_regist_02_f(data, query, dates){
        let source = data.first.data[0];

        let obj    = {
            "unique_rebate_invite_shop_planid_num" :  0,
            "unique_rebate_invite_shop_num" :  0,
            "unique_rebate_invite_shop_success_num" :  0,
            "is_over_rebate_invite_shop_amount" :  0,
            "all_enter_shop_num" : 0
        };

        for(let item of source) {
            for(let key in obj) {
                obj[key] += +item[key];
            }
        }

        obj = Deal100(obj , ["is_over_rebate_invite_shop_amount"]);
        obj.is_over_rebate_invite_shop_amount = obj.is_over_rebate_invite_shop_amount.toFixed(2);
        obj.regist_lv = util.toFixed(obj.unique_rebate_invite_shop_success_num , obj.all_enter_shop_num);
        //TODO 改动start
        let rows = [];
        let cols = [];
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i != 3) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            }
        }
        //TODO 改动end
        return util.toTable([[obj]], [rows], [cols]);
    },


    //邀请注册／入驻 ---- 邀请趋势
    rebate_regist_03(query , params , sendData){
        return params;
    },
    rebate_regist_03_f(data, query, dates){
        let source = data.first.data[0],
            filter_key = query.filter_key,
            Result = {};

        source = Deal100(source , ["is_over_rebate_invite_amount"]);

        for(let date of dates){
            Result[date] = {
                "one":0,
                "two":0,
                "three":0
            }
        }

        for(let item of source){
            item.is_over_rebate_invite_amount = item.is_over_rebate_invite_amount.toFixed(2);
            item.date = util.getDate(item.date);
            switch(item.plan_type){
                case "1":
                Result[item.date]["one"] = item[filter_key];
                break;

                case "2":
                Result[item.date]["two"] = item[filter_key];
                break;

                case "5":
                Result[item.date]["three"] = item[filter_key];
                break;
            }
        }

        return [{
            type : "line",
            map : {
                "one" : "邀请好友-平台基础返利",
                "two" : "邀请好友-平台促销返利",
                "three":"邀请商户入驻返利"
            },
            data : Result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },


    //商家返利汇总 -- 商家设置返利总览
    rebate_shop_01(query , params , sendData){
        params.plan_type = 3;
        params.category_id_1 = "ALL";
        params.category_id_2 = "ALL";
        params.category_id_3 = "ALL";
        params.category_id_4 = "ALL";
        return params;
    },
    rebate_shop_01_second(query , params , sendData){
        delete params.plan_type;
        return params;
    },
    rebate_shop_01_f(data, query, dates){
        let source = data.first.data[0],
            second = data.second.data[0];

        //TODO 改动start
        data.rows[0][2] = "is_rebate_item_fee";
        data.cols[0][2].caption = "商品总金额";
        data.cols[1][3].caption = "返利到账配送单数";
        //TODO 改动end
        let Table_Row1 = [
            "Blank",
            "unique_order_num",
            // "fee",
            "item_fee",

            "unique_shop_num",
            "unique_user_num",
            "merchandise_num",
            "cancel_order_num"
        ],
            Table_Row3 = [
            "Blank",
            "unique_back_merchandise_num",
            "back_merchandise_num",
            "unique_back_user_num",
            "back_merchandise_amount"
        ];

        let Rows  = util.megerArray([] , [data.rows , Table_Row1 , Table_Row3]);
        let RowsAll = util.megerArray([] , [Table_Row1 , Table_Row3]);
        let ThisOne = {"expect_rebate_amount":0};
        let AllOne  = {};


        for(let key of Rows){
            if(key == "Blank"){
                continue;
            }
            ThisOne[key] = 0;
        }
        //整理数据
        for(let item of source){
            for(let key of Rows){
                if(key == "Blank"){
                    continue;
                }
                if(ThisOne[key]){
                    ThisOne[key] += item[key];
                }else{
                    ThisOne[key] = item[key];
                }
            }
        }

        for(let key of RowsAll) {
            if (key == "Blank") {
                continue;
            }
            AllOne[key] = 0;
        }

        for(let item of second){
            for(let key of RowsAll){
                if(key == "Blank"){
                    continue;
                }
                if(AllOne[key]){
                    AllOne[key] += item[key];
                }else{
                    AllOne[key] = item[key];
                }
            }
        }

        //拼装数据
        //表一
        let Table_1_row1 = Object.assign({} , ThisOne),
            Table_1_row2 = {};
        data.rows[0].map((item , index) => {
            if(item != "Blank"){
                Table_1_row2[item] = util.toFixed( Table_1_row1[item] || 0 , AllOne[Table_Row1[index]] || 0 );
            } 
        });
        Table_1_row1["Blank"] = "返利订单";
        Table_1_row2["Blank"] = "总占比";


        //表三
        let Table_3_row1 = Object.assign({} , ThisOne) ,Table_3_row2 = {};
        data.rows[2].map((item , index) => {
            if(item != "Blank"){
                Table_3_row2[item] = util.toFixed( ThisOne[item] || 0 , AllOne[Table_Row3[index]] || 0 );
            } 
        });
        Table_3_row1["Blank"] = "返利订单";
        Table_3_row2["Blank"] = "返利退货订单占比";


        Table_1_row1 = Deal100(Table_1_row1 , [
            // "is_rebate_fee"
            "is_rebate_item_fee"
        ]);
        ThisOne      = Deal100(ThisOne , ["expect_rebate_amount" , "cancel_rebate_amount" , "is_over_rebate_order_amount" , "plat_rebate_order_amount"]);
        Table_3_row1 = Deal100(Table_3_row1 , ["is_rebate_back_merchandise_amount"]);

        Table_1_row1.is_rebate_item_fee = Table_1_row1.is_rebate_item_fee.toFixed(2);
        ThisOne.expect_rebate_amount = ThisOne.expect_rebate_amount.toFixed(2);
        ThisOne.cancel_rebate_amount = ThisOne.cancel_rebate_amount.toFixed(2);
        ThisOne.is_over_rebate_order_amount = ThisOne.is_over_rebate_order_amount.toFixed(2);
        ThisOne.plat_rebate_order_amount = ThisOne.plat_rebate_order_amount.toFixed(2);
        Table_3_row1.is_rebate_back_merchandise_amount = Table_3_row1.is_rebate_back_merchandise_amount.toFixed(2);

        //TODO 改动start
        let rows = [];
        let cols = [];
        for(let i = 0, len = data.rows[2].length; i < len; i++) {
            if(i != 1) {
                rows.push(data.rows[2][i]);
                cols.push(data.cols[2][i]);
            }
        }
        //TODO 改动end
           
        return util.toTable([[Table_1_row1 , Table_1_row2] , [ThisOne] , [Table_3_row1
            // , Table_3_row2
        ]],
            // data.rows, data.cols
            [data.rows[0], data.rows[1], rows],
            [data.cols[0], data.cols[1], cols]
        );
    },




    //商家返利汇总 -- 返利订单趋势
    rebate_shop_02(query , params , sendData){
        params.plan_type = 3;
        return params;
    },
    rebate_shop_02_second(query , params , sendData){
        return { type_code:3 };
    },
    rebate_shop_02_f(data, query, dates){
        let source = data.first.data[0],
            second = data.second.data[0],
            map = {}, Result = {};

        source = Deal100(source , ["is_rebate_fee"]);

        for(let item of second){
            map[item.flow_code] = item.flow_name;
        }
         
        for(let date of dates){
            let obj = {};
            for(let key in map){
                obj[key] = 0;
            }
            Result[date] = obj;
        }

        let colum = query.filter_key;
        for(let item of source){
            item.is_rebate_fee = item.is_rebate_fee.toFixed(2);
            item.date = util.getDate(item.date);
            if(Result[item.date][item.rebate_type] != undefined){
                Result[item.date][item.rebate_type] += item[colum];
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


    //商家返利汇总 ------ 返利层级分布

    rebate_shop_03(query , params , sendData){
        params.plan_type = 3;
        return params;
    },
    rebate_shop_03_param2(query , params , sendData){
        params.plan_type = 3;
        return params;
    },
    rebate_shop_03_param3(query , params , sendData){
        return { type_code:3 };
    },
    rebate_shop_03_f(data , query , dates){

        let source = data.first.data[0],
            second = data.second.data[0],
            third  = data.third.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        let param1 = {},  param2 = {
            "1" : "1级计划",
            "2" : "2级计划",
            "3" : "3级计划",
            "4" : "4级计划",
            "5" : "5级计划",
            "6" : "6级计划",
        },  param3 = {
            "1.0" : "返利层级一",
            "2.0" : "返利层级二",
            "3.0" : "返利层级三",
            "4.0" : "返利层级四",
            "5.0" : "返利层级五",
            "6.0" : "返利层级六",
        };

        source = Deal100(source , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);
        second = Deal100(second , ["is_rebate_item_fee" , "is_over_rebate_order_amount"]);

        for(let item of third){
            param1[item.flow_code] = item.flow_name;
        }

        //init data1.
        for(let key in param1){
            Result1[param1[key]] = {value:0};
        }

        for(let item of second){
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param1[item.rebate_type]){
             Result1[param1[item.rebate_type]].value += item[filter_key];
            }
        }



        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }
0
        for(let item of source){
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            if(param2[item.rebate_level] && item.level == "ALL"){
                Result2[param2[item.rebate_level]].value += item[filter_key];
            }
        }

        //init data3.
        for(let key in param2){
            let obj = {};
            for(let one in param3){
                // if(one > key){
                //     continue;
                // }
                obj[one] = 0;
            }
            Result3[param2[key]] = obj;
        }

        for(let item of source){
            if(param2[item.rebate_level] && item.level != "ALL"){
                Result3[param2[item.rebate_level]][item.level] += item[filter_key];
            }
        }
           
        return [{
            type : "pie",
            map : {value:"返利类型占比"},
            data : Result1,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "pie",
            map : {value:"返利层级占比"},
            data : Result2,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }, {
            type : "bar",
            map : param3,
            data : Result3,
            config: { // 配置信息
                stack: true  // 图的堆叠
            }
        }];
    },

    //商家返利汇总 ---- 商家返利TOP50
    rebate_shop_04(query , params , sendData){
        // params.plan_type = "ALL";
        params.plan_name = "ALL";
        params.rebate_level = "ALL";
        params.rebate_type = "ALL";
        params.plan_id = "ALL";
        params.unique_plan_id_num = orm.gt(0);
        return params;
    },
    rebate_shop_04_f(data, query, dates){
        let source = data.first.data[0],
            count  = data.first.count;
        count = count > 50 ? 50 : count;

        query.page = query.page || 1;
        query.limit = query.limit || 1;
        source.map((item , index) => {
            item.Number = (query.page - 1) * query.limit + index + 1;
        });

        source = Deal100(source , ["is_rebate_fee",
                "expect_rebate_amount",
                "is_over_rebate_order_amount",
                "plat_rebate_order_amount"]);

        for(let item of source){
            item.is_rebate_fee = item.is_rebate_fee.toFixed(2);
            item.expect_rebate_amount = item.expect_rebate_amount.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            item.plat_rebate_order_amount = item.plat_rebate_order_amount.toFixed(2);
            item.unique_is_rebate_order_num = item.unique_is_rebate_order_num + " / " + item.unique_order_num;
            item.is_rebate_fee = item.is_rebate_fee + " / " + item.fee;
        }
        //TODO 改动start
        data.rows[0][3] = "is_rebate_merchandise_num";
        data.cols[0][3].caption = "参与商品件数";
        let rows = [];
        let cols = [];
        for(let i = 0, len = data.rows[0].length; i < len; i++) {
            if(i != 6) {
                rows.push(data.rows[0][i]);
                cols.push(data.cols[0][i]);
            }
        }
        //TODO 改动end

        return util.toTable([source],
            // data.rows, data.cols ,
            [rows], [cols],
            [count]);
    },


    rebate_shop_05_api(obj){
        return (req , res , next)=>{
            let query = req.query;
            let ep = new eventproxy();

            req.models.ads2_new_rebate_order_shop_info.find({
                date        : orm.between(query.startTime , query.endTime),
                day_type    : query.day_type,
                rebate_type : orm.not_in(["ALL"]),
                plan_id     : orm.not_in(["ALL"]),
                unique_plan_id_num : orm.gt(0)
            } , {
                limit       : query.limit / 1 || 20,
                offset      : query.limit * (query.page - 1) / 1 || 0,
                order       : ["-unique_is_rebate_order_num"]
            } , (err , data) => {
                ep.emit("one"  , data);
            });

            req.models.ads2_new_rebate_order_shop_info.find({
                date        : orm.between(query.startTime , query.endTime),
                day_type    : query.day_type,
                rebate_type : orm.not_in(["ALL"]),
                plan_id     : orm.not_in(["ALL"]),
                unique_plan_id_num : orm.gt(0)
            }).count((err , data) => {
                ep.emit("two" , data);
            });
            
            req.models.TypeFlow.find({
                type_code : 3
            } , (err , data)=>{
                ep.emit("three" , data);
            });

            ep.all("one" , "two" , "three" , (one , two , three) =>{
                let ss = module.exports.rebate_shop_05_f([one , two , three] , query , obj);
                res.json({
                    code: 200,
                    components: {
                        date_picker:{
                            name : "startTime",
                            endname: "endTime",
                            cancelDateLimit : false,
                            defaultData     : 1,
                            show            : true,
                            showDayUnit     : true
                        },
                        "control_table_col": {
                            show : true
                        },
                        "flexible_btn": [
                            {
                                "content": "<a href='#!/rebate/shopPlan'>更多</a>",
                                "preMethods": [],
                                "customMethods": ""
                            }
                        ],
                        filter_select : []
                    },
                    modelData: ss,
                });
            });            
        }
    },
    rebate_shop_05(query , params , sendData){
        // params.plan_type = "ALL";
        // params.plan_name = "ALL";
        // params.rebate_level = "ALL";
        // params.rebate_type = "ALL";
        return params;
    },
    rebate_shop_05_f(data, query, Obj){
        let source = data[0],
            count  = data[1],
            second = data[2];
        count = count > 50 ? 50 : count || 1;

        if(query.page == 3){
            source.splice(10 , source.length - 1);
        }

        let Translate = {};
        second.map((item , index) => {
            Translate[item.flow_code] = item.flow_name;
        });

        query.page = query.page || 1;
        query.limit = query.limit || 1;
        source.map((item , index) => {
            item.Number = (query.page - 1) * query.limit + index + 1;
            item.Return_lv = util.toFixed( item.is_rebate_back_merchandise_num , item.is_rebate_merchandise_num );
            item["新增订单占比"] = util.toFixed( item.unique_is_rebate_order_num , item.unique_order_num || 0 );
            item["新增订单金额占比"] = util.toFixed( item.is_rebate_fee , item.fee || 0 );

            item.rebate_type = Translate[item.rebate_type];
        });

        source = Deal100(source , ["expect_rebate_amount" , "is_over_rebate_order_amount" , "cancel_rebate_amount" , "is_rebate_fee"]);

        //TODO 改动start
        Obj.rows[0][14] = "is_rebate_merchandise_num";
        Obj.cols[0][14].caption = "参与商品件数";
        let rows = [];
        let cols = [];
        for(let i = 0, len = Obj.rows[0].length; i < len; i++) {
            if(i != 11 && i != 15 && i != 18) {
                rows.push(Obj.rows[0][i]);
                cols.push(Obj.cols[0][i]);
            }
        }
        //TODO 改动end

        return util.toTable([source],
            // Obj.rows, Obj.cols ,
            [rows], [cols],
            [count]);
    },


    rebate_shopPlan_01(query , params , sendData){

        if(query.search_key){
            if(query.search_key / 1){
                params.merchant_id = query.search_key;
            }else{
                params.shop_name = orm.like("%" + query.search_key + "%");
            }

            delete params.search_key;
            delete query.search_key;
        }
        params.rebate_type = params.rebate_type.split(",");
        return params;
    },
    rebate_shopPlan_01_second(query , params , sendData){
        return {type_code : 3};
    },
   /* rebate_shopPlan_01_f(data, query, dates){
        let source = data.first.data[0],
            count  = data.first.count,
            second = data.second.data[0];
        count = count > 50 ? 50 : count;


        let Translate = {};
        second.map((item , index) => {
            Translate[item.flow_code] = item.flow_name;
        });


        source.map((item , index) => {
            item.Number = (query.page - 1) * query.limit + index + 1;
            item.Return_lv = util.toFixed( item.is_rebate_back_merchandise_num , item.is_rebate_merchandise_num );
            item.rebate_type = Translate[item.rebate_type];
        });

        return util.toTable([source], data.rows, data.cols , count);
    },*/


    rebate_shopPlan_SelectFilter(req , cb){
        let filter_select = {
            "title" : "关联流程",
            "filter_key" : "rebate_type",
            "groups" : [{
                "key" : [],
                "value":"全部返利"
            }]
        };

        req.models.TypeFlow.find({
            type_code : 3,
            status : 1
        }, (err, data) => {
            if(err) {
                cb(err);
            } else {
                var user_party = _.uniq(_.pluck(data, "flow_code"));
                filter_select.groups[0].key = user_party.join(",");

                for(let item of data){
                    let obj = {
                        "key" : item.flow_code,
                        "value":item.flow_name
                    };
                    filter_select.groups.push(obj);
                }
                cb(null, [filter_select]);
            }
        });
    },
    rebate_shop_plan_01_f(data, query, dates){
         let source = data.first.data[0],
            count  = data.first.count,
            second = data.second.data[0];

        // count = count > 50 ? 50 : count;

        if(query.page == 3){
            source.splice(10 , source.length - 1);
        }

        let Translate = {};
        second.map((item , index) => {
            Translate[item.flow_code] = item.flow_name;
        });

        query.page = query.page || 1;
        query.limit = query.limit || 1;
        source.map((item , index) => {
            item.Number = (query.page - 1) * query.limit + index + 1;
            item.Return_lv = util.toFixed( item.is_rebate_back_merchandise_num , item.is_rebate_merchandise_num );
            item["新增订单占比"] = util.toFixed( item.unique_is_rebate_order_num , item.unique_order_num || 0 );
            item["新增订单金额占比"] = util.toFixed( item.is_rebate_fee , item.fee || 0 );
            item.rate = util.toFixed(item.unique_is_rebate_order_num, item.unique_order_num);

            item.rebate_type = Translate[item.rebate_type];
        });

        source = Deal100(source , ["expect_rebate_amount", "is_over_rebate_order_amount", "cancel_rebate_amount",
            "is_rebate_fee", "is_rebate_item_fee"]);

        for(let item of source) {
            item.expect_rebate_amount = item.expect_rebate_amount.toFixed(2);
            item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
            item.cancel_rebate_amount = item.cancel_rebate_amount.toFixed(2);
            item.is_rebate_fee = item.is_rebate_fee.toFixed(2);
            item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
        }

        return util.toTable([source], data.rows, data.cols , count);
    }
}
