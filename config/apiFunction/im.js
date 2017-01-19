
/**
 * IM分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment"),
    orm  = require("orm"),
    _ = require("lodash");

// let cluster = global.cluster;
// cluster.get("message:app:0112:notdisturb:count" , (err , result)=>{
//     console.log(23333);
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// })

// cluster.pipeline([
//     "message:app:0112:notdisturb:count"
// ]).exec((err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });
// 



module.exports = {
    im_realtime_one_api(obj){
        return (req , res , next) => {

            res.send("ok");
        }
    },

    
    im_using_one_api(obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                cancelDateLimit : false,
                defaultData     : 1,
                show            : true,
                showDayUnit     : true
            },
            filter_select : []
        };
        let Text = [
            "",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数",
            "IM使用占比",
            "新增使用占比",
            "群活跃度",
            "设置免打扰次数",
            "表情下载次数"
        ];
        return (req , res , next) => {
            let query = req.query;
            let date = util.beforeDate(query.startTime , 2 , query.day_type);
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            req.models.ImDetail.find({
                date : date,
                day_type: query.day_type
            } , (err , data) => {
                //表一
                let Result1 = [] , Rows1 = obj.rows[0];
                let obj1 = {},obj2 = {};
                for(let key of Rows1){
                    obj1[key] = 0;
                    obj2[key] = 0;
                }
                obj1.Date = date[0];
                obj2.Date = date[1];
                Result1.push(obj1,obj2);

                for(let item of data){
                    item.date = util.getDate(item.date);
                    let useObj;
                    if(item.date == date[0]){
                        useObj = obj1;
                    }else{
                        useObj = obj2;
                    }

                    for(let key in useObj){
                        if(key == "Date") continue;
                        useObj[key] = item[key];
                    }
                }

                //表二
                let Result2 = [] , Rows2 = obj.rows[1];
                let  Tobj0 = {} , Tobj1 = {} , Tobj2 = {} , Tobj3 = {};
                Result2.push(Tobj0 , Tobj1 , Tobj2 , Tobj3);

                Rows2.map((item , index) => {
                    Tobj0[item] = Text[index];
                    if(item == "Date"){
                        Tobj1[item] = date[0];
                        Tobj2[item] = date[1];
                        switch(query.day_type){
                            case "1":
                            Tobj3[item] = "日环比";
                            break;
                            case "2":
                            Tobj3[item] = "周环比";
                            break;
                            case "3":
                            Tobj3[item] = "月环比";
                            break;
                        }
                    }else{
                        Tobj1[item] = 0;
                        Tobj2[item] = 0;
                        Tobj3[item] = 0;
                    }
                });

                //表二装载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    let useObj;
                    if(item.date == date[0]){
                        useObj = Tobj1;
                    }else{
                        useObj = Tobj2;
                    }

                    for(let key in useObj){
                        if(item[key]){
                            useObj[key] = item[key];
                        }
                    }
                    useObj["IM使用占比"] = util.numberLeave( item.total_mess_uv / (item.app_dau || 1) , 2 );
                    useObj["新增使用占比"] = util.numberLeave( item.im_register_users / (item.register_users || 1) , 2 );
                    useObj["群活跃度"] = util.numberLeave( item.group_mess_pv / (item.group_member_count || 1) , 2 );
                }

                //计算环比
                for(let key in Tobj3){
                    if(key == "Date") continue;

                    Tobj3[key] = util.toFixed( (Tobj1[key] - Tobj2[key]) , Tobj2[key] );
                }


                let DATA = util.toTable([Result1 , Result2] , obj.rows , obj.cols);

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },


    //使用分析-数据趋势
    im_using_two_api(Obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                defaultData     : 7,
                show            : true,
            },
            toggle : {
                show : true
            },
            filter_select : [
                {
                    title: '指标',
                    filter_key: 'message_type',
                    groups : [
                        {
                            key: "number",
                            value: '发消息数'
                        },
                        {
                            key: "human",
                            value: '发消息人数'
                        }
                    ]
                }
            ]
        };
        let Text = [
            "日期",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数"
        ];
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            let dates = util.times(query.startTime, query.endTime, "1");
            
            req.models.ImDetail.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , (err , data) => {
                let map;
                if(query.message_type == "number"){
                    map = {
                        "single_mess_pv" : "单聊",
                        "group_mess_pv"  : "群聊"
                    }
                }else{
                    map = {
                        "single_mess_uv" : "单聊",
                        "group_mess_uv"  : "群聊"
                    }
                }
                let Result = util.ChartData(dates , Object.keys(map));
                //加载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    if(Result[item.date]){
                        for(let key in map){
                            Result[item.date][key] += item[key];
                        }
                    }
                }

                let DATA = [{
                    type : "bar",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: true,  // 图的堆叠
                        categoryY : true
                    }
                }];

                if(query.main_show_type_filter == "table"){
                    let obj = {};
                    Obj.rows[0].map((item , index) => {
                        obj[item] = Text[index];
                    });
                    data.unshift(obj);
                    DATA = util.toTable([data] , Obj.rows , Obj.cols);
                }

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
                
        }
    },

    //使用分析--IM使用情况
    im_using_three_api(OBJ){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                defaultData     : 7,
                show            : true,
            },
            toggle : {
                show : true
            },
            filter_select : []
        };
        let Text = [
            "日期",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数"
        ];
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            let dates = util.times(query.startTime , query.endTime, "1");
            
            req.models.ImDetail.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , (err , data) => {
                // "IM使用占比",
                // "新增使用占比",
                // "群活跃度",
                // "设置免打扰次数",
                // "表情下载次数"
                let Arr1 = ["IM使用占比" , "新增使用占比", "群活跃度"];
                let map = {
                    "IM使用占比" : "IM使用占比",
                    "新增使用占比": "新增使用占比",
                    "群活跃度"   : "群活跃度",
                    "set_group_shield_pv" : "设置免打扰次数",
                    "face_load_pv" : "表情下载次数"
                };
                let Result = util.ChartData(dates , Object.keys(map));
                // 加载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    if(Result[item.date]){
                        let Useobj = Result[item.date];
                        for(let key in map){
                            switch(key){
                                case "IM使用占比":
                                Useobj[key] = util.numberLeave( item.total_mess_uv / (item.app_dau || 1) , 2 );
                                break;
                                case "新增使用占比":
                                 Useobj[key] = util.numberLeave( item.im_register_users / (item.register_users || 1) , 2 );
                                break;
                                case "群活跃度":
                                 Useobj[key] = util.numberLeave( item.group_mess_pv / (item.group_member_count || 1) , 2 );
                                break;
                                default:
                                Useobj[key] += item[key];
                            }
                        }
                    }
                }

                let DATA = [{
                    type : "line",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: false,  // 图的堆叠
                        categoryY : false
                    }
                }];

                // if(query.main_show_type_filter == "table"){
                //     let obj = {};
                //     Obj.rows[0].map((item , index) => {
                //         obj[item] = Text[index];
                //     });
                //     data.unshift(obj);
                //     DATA = util.toTable([data] , Obj.rows , Obj.cols);
                // }

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    }

   
}
