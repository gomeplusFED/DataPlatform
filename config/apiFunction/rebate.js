
/**
 * 返利分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment"),
    orm  = require("orm"),
    _ = require("lodash");

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

        //拼装数据
        //表一
        let Table_1_row1 = {},Table_1_row2 = {};
        for(let key of data.rows[0]){
            if(key == "Blank") continue;
            Table_1_row1[key] = ThisOne[key];
            Table_1_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[key] || 0);
        }
        Table_1_row1["Blank"] = "返利订单";
        Table_1_row2["Blank"] = "总占比";

        //表三
        let Table_3_row1 = {},Table_3_row2 = {};
        for(let key of data.rows[2]){
            if(key == "Blank") continue;
            Table_3_row1[key] = ThisOne[key];
            Table_3_row2[key] = util.toFixed( ThisOne[key] || 0 , AllOne[key] || 0);
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
            if(param2[item.rebate_level]){
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
        });
        
        return util.toTable([source] , data.rows, data.cols);
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
        return params;
    },
    rebate_platformBase_01_f(data, query, dates){
        let source = data.first.data[0];
        let Row = {};
        let Keys = [...data.rows[0] , ...data.rows[1]];

        for(let key of Keys){
            Row[key] = 0;
        }

        for(let item of source){
            for(let key of Keys){
                Row[key] += item[key];
            }
        }

        return util.toTable([[Row] , [Row]], data.rows, data.cols);
    },

    //平台基础返利 ---- 返利订单趋势
    rebate_platformBase_02(query , params , sendData){
        // params.plan_type = 1;
        params.rebate_type = [1,2];
        return params;
    },
    rebate_platformBase_02_f(data, query, dates){
        let source = data.first.data[0],
            filter_key = query.filter_key,
            Result = {};

        for(let date of dates){
            Result[date] = {"1":0 , "2":0}
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            if(item.rebate_type == "1"){
                Result[item.date]["1"] = item[filter_key];
            }else{
                Result[item.date]["2"] = item[filter_key];
            }
        }

        
        return [{
            type : "line",
            map : {
                "1" : "分享购买",
                "2" : "邀请好友-购买返利"
            },
            data : Result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    },


    //平台基础返利 ---- 返利层级分布
    rebate_platformBase_03(query , params , sendData){
        // params.plan_type = 1;
        return params;
    },
    rebate_platformBase_03_f(data, query, dates){
        let source = data.first.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

        let param1 = {
            "1" : "分享购买",
            "2" : "邀请好友-购买返利"
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

        for(let item of source){
            if(param1[item.plan_type]){
             Result1[param1[item.plan_type]].value += item[filter_key];
            }
        }

        //init data2.
        for(let key in param2){
            Result2[param2[key]] = {value:0};
        }

        for(let item of source){
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

        //init data1.
        for(let key in param1){
            Result1[param1[key]] = {value:0};
        }

        for(let item of source){
            if(param1[item.plan_type]){
                Result1[param1[item.plan_type]].value += item[filter_key];
            }
        }

        //init data3.
        Result3 = {
            "比例返利" : { value:0 },
            "固定返利" : { value:0 }
        }

        for(let item of source){
            if(param1[item.rebate_level]){
                Result3[param1[item.rebate_level]].value += item[filter_key];
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

        for(let date of dates){
            Result[date] = {"1":0}
        }

        for(let item of source){
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
        return params;
    },
    rebate_invitation_02_f(data, query, dates){
        let source = data.first.data[0],
            filter_key  = query.filter_key,
            Result1 = {} , Result2 = {} , Result3 = {};

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
            map : {value:"0"},
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
        let source = data.first.data[0],
            sum    = data.first.sum;
        let obj    = {
            "unique_rebate_invite_friend_planid_num" : sum[0] || 0,
            "unique_rebate_invite_friend_user_num" : sum[1] || 0,
            "unique_rebate_invite_friend_success_user_num" : sum[2] || 0,
            "is_over_rebate_invite_friend_amount" : sum[3] || 0
        }
        obj.regist_lv = util.toFixed(sum[2] , sum[4] || 0);
        return util.toTable([[obj]], data.rows, data.cols);
    },


    //邀请注册／入驻 ---- 邀请商户入驻总览
    rebate_regist_02(query , params , sendData){
        return params;
    },
    rebate_regist_02_f(data, query, dates){
        let source = data.first.data[0],
            sum    = data.first.sum;
        let obj    = {
            "unique_rebate_invite_shop_planid_num" : sum[0] || 0,
            "unique_rebate_invite_shop_num" : sum[1] || 0,
            "unique_rebate_invite_shop_success_num" : sum[2] || 0,
            "is_over_rebate_invite_shop_amount" : sum[3] || 0
        }
        obj.regist_lv = util.toFixed(sum[2] , sum[4] || 0);
        return util.toTable([[obj]], data.rows, data.cols);
    },


    //邀请注册／入驻 ---- 邀请趋势
    rebate_regist_03(query , params , sendData){
        return params;
    },
    rebate_regist_03_f(data, query, dates){
        let source = data.first.data[0],
            filter_key = query.filter_key,
            Result = {};

        for(let date of dates){
            Result[date] = {
                "one":0,
                "two":0,
                "three":0
            }
        }

        for(let item of source){
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
    rebate_shop_01_f(data, query, dates){
        let source = data.first.data[0];

        let Table_Row1 = [
            "Blank",
            "unique_order_num",
            "fee",
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
        let ThisOne = {"expect_rebate_amount":0};

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

        //拼装数据
        //表一
        let Table_1_row1 = Object.assign({} , ThisOne),
            Table_1_row2 = {};
        data.rows[0].map((item , index) => {
            if(item != "Blank"){
                Table_1_row2[item] = util.toFixed( ThisOne[item] || 0 , ThisOne[Table_Row1[index]] || 0 );
            } 
        });
        Table_1_row1["Blank"] = "返利订单";
        Table_1_row2["Blank"] = "总占比";

        //表三
        let Table_3_row1 = Object.assign({} , ThisOne) ,Table_3_row2 = {};
        data.rows[2].map((item , index) => {
            if(item != "Blank"){
                Table_3_row2[item] = util.toFixed( ThisOne[item] || 0 , ThisOne[Table_Row3[index]] || 0 );
            } 
        });
        Table_3_row1["Blank"] = "返利订单";
        Table_3_row2["Blank"] = "返利退货订单占比";

           
        return util.toTable([[Table_1_row1 , Table_1_row2] , [ThisOne] , [Table_3_row1 , Table_3_row2]], data.rows, data.cols);
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

    //商家返利汇总 ---- 商家返利TOP50
    rebate_shop_04(query , params , sendData){
        // params.plan_type = "ALL";
        params.plan_name = "ALL";
        params.rebate_level = "ALL";
        params.rebate_type = "ALL";
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

        return util.toTable([source], data.rows, data.cols , count);
    },


    rebate_shop_05(query , params , sendData){
        // params.plan_type = "ALL";
        // params.plan_name = "ALL";
        // params.rebate_level = "ALL";
        // params.rebate_type = "ALL";
        return params;
    },
    rebate_shop_05_f(data, query, dates){
        let source = data.first.data[0],
            count  = data.first.count,
            second = data.second.data[0];

        count = count > 50 ? 50 : count;

        let Translate = {};
        second.map((item , index) => {
            Translate[item.flow_code] = item.flow_name;
        });

        query.page = query.page || 1;
        query.limit = query.limit || 1;
        source.map((item , index) => {
            item.Number = (query.page - 1) * query.limit + index + 1;
            item.Return_lv = util.toFixed( item.is_rebate_back_merchandise_num , item.is_rebate_merchandise_num );
            item.rebate_type = Translate[item.rebate_type];
        });

        return util.toTable([source], data.rows, data.cols , count);
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
                filter_select.groups[0].key = user_party;
                
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
}
