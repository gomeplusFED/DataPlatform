/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计，数据过滤处理
 */
var util = require("../../utils"),
    _ = require("lodash");

/* 环比计算 */
function Chain(lastday , beforeLastday){
    if(lastday == 0 && beforeLastday == 0) return '0%';

    if(!beforeLastday) beforeLastday = 1;
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
        initObj.new_play_num = 1;

        //source应该有三项，没有时给初始化对象
        var Other = true;
        for(var i=0;i<3;i++){
            if(allSource[i] == undefined){
                allSource.push(initObj);
                if(i==0){
                    Other = false;
                }
            }
        }

        //保存输出数据的三个数组
        var one = [],two = [], three = [];

        //用于第一行的数据
        var source = allSource[0];
        one.push({
            "new_play_num" : Other ? source.new_play_num : 0,
            "active_user"  : source.active_user
        });

        //表二，表三都应当有三行，进行三次循环将对应的值放入two,three两个数组中
        for(var i=1;i<=3;i++){
            var Obj2 = {},  //表二的数据结构 
                Obj3 = {};  //表三的数据结构
            switch(i){
                case 1:
                    for(let item of data.rows[1]){
                        Obj2[item] = source[item];
                        if(item == "health_play"){
                            Obj2[item] = "数值";
                        }
                    }
                    for(let item of data.rows[2]){
                        Obj3[item] = source[item];
                        if(item == "unhealth_play"){
                            Obj3[item] = "数值";
                        }
                    }
                    break;
                case 2:
                    //概率 除以新增播放次数
                    for(let item of data.rows[1]){
                        Obj2[item] = util.toFixed(source[item] / source.new_play_num , 0);
                        if(item == "health_play"){
                            Obj2[item] = "概率";
                        }
                    }
                    for(let item of data.rows[2]){
                        Obj3[item] = util.toFixed(source[item] / source.new_play_num , 0);
                        if(item == "unhealth_play"){
                            Obj3[item] = "概率";
                        }
                    }
                    break;
                case 3:
                    for(let item of data.rows[1]){
                        Obj2[item] = Chain(allSource[1][item] , allSource[2][item]);
                        if(item == "health_play"){
                            Obj2[item] = "日环比";
                        }
                    }

                    for(let item of data.rows[2]){
                        Obj3[item] = Chain(allSource[1][item] , allSource[2][item]);
                        if(item == "unhealth_play"){
                            Obj3[item] = "日环比";
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
                "health_pro"   : "健康播放概率",
                "unhealth_play": "错误播放数",
                "unhealth_pro" : "错误播放概率"
            },
            filter_key = query.filter_key;
        var map  = { value : filterKey[filter_key] };

        /* init Data */
        var source = data.first.data[0];
        var obj = {}, //以日期为键保存数据
            newData = {};  //输出的数据
        for(let item of source){
            var date = util.getDate(item.date);
            obj[date] = item;
        }

        for(let item of dates){
            var theobj = { value:0 };
            if(!obj[item]){
                newData[item] = theobj;
                continue;
            }

            if(filter_key == "new_play_num" || filter_key == "unhealth_play" || filter_key == "health_play"){
                
                theobj.value = obj[item][filter_key];
                
            }else{
                if(obj[item].new_play_num == 0){
                    obj[item].new_play_num = 1;
                }
                if(filter_key == "health_pro"){
                    theobj.value = util.division(obj[item].health_play , obj[item].new_play_num);
                }else if(filter_key == "unhealth_pro"){
                    theobj.value = util.division(obj[item].unhealth_play , obj[item].new_play_num);
                }
            }

            newData[item] = theobj;
        }
        
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
        }
        return util.toTable([source], data.rows, data.cols);
    },

    videoFour(data , query , params){
        var source = data.first.data[0],
            count  = data.first.count;

        /* 整理数据 */
        var total_new_play_num = 0;
        for(let item of source){
            item.date = util.getDate(item.date);
            total_new_play_num += item.new_play_num;
        }

        for(let item of source){
            item["l-11"] = util.percentage(item.port_io_failed , item.new_play_num) + "%";
        }






        var merge = util.mergeCell(source , ["date", "sdk_app_type"]);

        console.log(merge);

        return util.toTable([source], data.rows, data.cols, {
            count : [count],
            config : [merge]
        });
    }
};