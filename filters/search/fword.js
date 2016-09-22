/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索 api 对应的数据整理函数
 */
var utils = require("../../utils");

/* 统一计算 */
function Computer(key , son , mother , obj1 , obj2){
    if(!obj1[son] || !obj1[mother]){
        obj1[key] = 0;
    }else{
        obj1[key] = utils.toFixed(obj1[son] / obj1[mother] , 0);
    }
    
    if(!obj2[son] || !obj2[mother]){
        obj2[key] = 0;
    }else{
        obj2[key] = utils.toFixed(obj2[son] / obj2[mother] , 0);
    }
}

module.exports = {
    wordOne(data , query , dates){
        let source = data.first.data[0];
        let newData= {};
        for(let item of source){
            newData[item.search_position] = {
                value : item.search_num
            }
        }

        return [{
            type : "pie",
            map : {
                value: "商品搜索关键词分析－入口位置占比"
            },
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    wordTwo(data , query , dates){
        let source = data.first.data[0];
        let newData= {};
        for(let item of source){
            newData[item.search_source] = {
                value : item.search_num
            }
        }

        return [{
            type : "pie",
            map : {
                value: "商品搜索关键词分析-来源占比"
            },
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    wordThree(data , query , dates){
        return utils.toTable([[]], data.rows, data.cols);
    }
}