/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计，数据过滤处理
 */
var util = require("../../utils"),
    _ = require("lodash");

/* 环比计算 , 昨天－前天  ／  前天 */
function Chain(lastday , beforeLastday){
    if(lastday == 0 || beforeLastday == 0){
        return '0%';
    } 

    var num = (lastday - beforeLastday) / beforeLastday;

    return util.toFixed(num , 0);
}


module.exports = {
    
    videoOne(data , query , params){
        //查询数据
        var allSource = data.first.data[0];

        //初始化字段
        var initObj = {};
        for(let item of data.rows){
            if(item instanceof Array){
                for(let key of item){
                    initObj[key] = 0;
                }
            }else{  
                initObj[item] = 0;
            }
        }
        //作为除数不能为0
        initObj.sid_num = 1;

        //source应该有两项，没有时给初始化对象
        for(var i=0;i<2;i++){
            if(allSource[i] == undefined){
                allSource.push(initObj);
            }
        }

        //保存输出数据的三个数组
        var one = [],two = [], three = [];

        //用于第一行的数据
        var source = allSource[0];
        one.push({
            "new_play_num" : source.new_play_num,
            "active_user"  : source.active_user
        });

        //表二，表三都应当有三行，进行三次循环将对应的值放入two,three两个数组中
        var day_type = [0 ,"日环比" , "周环比" , "月环比"];
        for(var i=1;i<=3;i++){
            var Obj2 = {},  //表二的数据结构 
                Obj3 = {};  //表三的数据结构
            switch(i){
                case 1:
                    for(let item of data.rows[1]){
                        if(item == "health_play"){
                            Obj2[item] = "数值";
                            continue;
                        }
                        Obj2[item] = source[item];
                    }
                    for(let item of data.rows[2]){
                        if(item == "unhealth_play"){
                            Obj3[item] = "数值";
                            continue;
                        }
                        Obj3[item] = source[item];
                    }
                    break;
                case 2:
                    //概率 除以sid_num
                    for(let item of data.rows[1]){
                        Obj2[item] = util.toFixed(source[item] / source.sid_num , 0);
                        if(item == "health_play"){
                            Obj2[item] = "概率";
                        }
                    }
                    for(let item of data.rows[2]){
                        Obj3[item] = util.toFixed(source[item] / source.sid_num , 0);
                        if(item == "unhealth_play"){
                            Obj3[item] = "概率";
                        }
                    }
                    break;
                case 3:
                    for(let item of data.rows[1]){
                        if(item == "health_play"){
                            Obj2[item] = day_type[query.day_type];
                        }else{
                            Obj2[item] = Chain(allSource[0][item] , allSource[1][item]);
                        }
                    }

                    for(let item of data.rows[2]){
                        if(item == "unhealth_play"){
                            Obj3[item] = day_type[query.day_type];
                        }else{
                            Obj3[item] = Chain(allSource[0][item] , allSource[1][item]);
                        }
                    }
            }

            two.push(Obj2);
            three.push(Obj3);
        }

        return util.toTable([one , two , three], data.rows, data.cols);
    },

    videoTwo(data , query , dates){
        /* 前端组件参数 */
        var type = "line";
        var filterKey = {
                "new_play_num" : "播放次数",
                "health_play"  : "健康播放数",
                "health_pro"   : "健康播放概率(%)",
                "unhealth_play": "错误播放数",
                "unhealth_pro" : "错误播放概率(%)"
            },
            filter_key = query.filter_key;
        var map  = {
            "ios" : "ios",
            "andriod" : "andriod",
            "h5_custom" : "h5_custom",
            "h5_native" : "h5_native",
            "flash" : "flash"
        };

        /* init Data */
        var source = data.first.data[0];
        var newData = {};  //输出的数据

        //有几个时间输出几个以时间为键的值
        for(let item of dates){
            //每一个时间的键都应包含以下数据
            var theobj = {
                "ios" : 0,
                "andriod" : 0,
                "h5_custom":0,
                "h5_native":0,
                "flash":0
            };

            //遍历查询结果找出和当前时间相等的值
            for(let key of source){
                if(util.getDate(key.date) != item){
                    continue;
                }
                //与当前时间相等的值包括sdk的所有类型,找出这条记录与谁相等
                for(var onekey in theobj){
                    if(onekey == key.sdk_app_type){
                        //找到了对应的记录，根据filter_key赋值
                        var number;
                        switch(filter_key){
                            case "new_play_num":
                            case "unhealth_play":
                            case "health_play":
                                number = key[filter_key];
                                break;
                            case "health_pro":
                                number = util.percentage(key.health_play , key.sid_num);
                                break;
                            case "unhealth_pro":
                                number = util.percentage(key.unhealth_play , key.sid_num);
                                break;
                        }
                        theobj[onekey] = number;
                    }
                }
            }

            newData[item] = theobj;
        }

        /* 输出格式
        {
            "2016-08-22" : {
                "ios" : 3333,
                "andriod" : 2323,
                "h5_custom" : 2344,
                "h5_native" : 2111,
                "flash" : 333
            },
            "2016-08-23" : {
                "ios" : 66,
                "andriod" : 54,
                "h5_custom" : 443,
                "h5_native" : 22,
                "flash" : 333
            }
        }*/

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    videoThree(data , query , params){
        var source = data.first.data[0];

        for(let item of source){
            item.date = util.getDate(item.date);
            item["l-16"] = util.percentage(item.port_succ , item.sid_num) + "%";
            item["l-17"] = util.percentage(item.start_frame_succ , item.sid_num) + "%";
            item["l-18"] = util.percentage(item.stop_play_num , item.sid_num) + "%";
            item["l-19"] = util.percentage(item.play_fluent , item.sid_num) + "%";
            item["l-20"] = util.percentage(item.port_io_failed , item.sid_num) + "%";
            item["l-21"] = util.percentage(item.port_data_failed , item.sid_num) + "%";
            item["l-22"] = util.percentage(item.port_overtime , item.sid_num) + "%";
            item["l-23"] = util.percentage(item.play_failed , item.sid_num) + "%";
            item["l-24"] = util.percentage(item.play_error , item.sid_num) + "%";
            item["l-25"] = util.percentage(item.improper_play , item.sid_num) + "%";
        }
        return util.toTable([source], data.rows, data.cols);
    },

    videoFour(data , query , params){
        var source = data.first.data[0],
            count  = data.first.count;

        /* 整理数据 */
        // var total_new_play_num = 0;
        for(let item of source){
            item.date = util.getDate(item.date);
            // total_new_play_num += item.sid_num;
        }

        //sdk_app_type,相同的放一起,最后重新排序
        var ArrObj = {};
        for(let item of source){
            item["5"] = util.percentage(item.new_play_num , item.new_play_num + item.play_failed) + "%";
            item["l-11"] = util.percentage(item.port_data_failed , item.sid_num) + "%";
            item["l-12"] = util.percentage(item.port_overtime , item.sid_num) + "%";
            item["l-13"] = util.percentage(item.play_failed , item.sid_num) + "%";
            item["l-14"] = util.percentage(item.play_error , item.sid_num) + "%";
            item["l-15"] = util.percentage(item.improper_play , item.sid_num) + "%";

            if(!ArrObj[item.sdk_app_type]){
                ArrObj[item.sdk_app_type] = [];
            }
            ArrObj[item.sdk_app_type].push(item);
        }

        //重新排序
        var EndArr = [];
        for(var key in ArrObj){
            for(let item of ArrObj[key]){
                EndArr.push(item);
            }
        }

        var merge = util.mergeCell(EndArr , ["date", "sdk_app_type"]);

        return util.toTable([EndArr], data.rows, data.cols, {
            count : [count],
            config : [merge]
        });
    }
};