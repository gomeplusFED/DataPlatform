/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计，数据过滤处理
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    
    videoOne(data , query){
        var source = data.first.data[0];

        //初始化字段
        var obj = {};
        for(let key in source[0]){
            if(typeof source[0][key] == "number"){
                obj[key] = 0;
            }
        }
        //累加所有数据
        for(let item of source){
            for(let key in obj){
                obj[key] += item[key];
            }
        }
        var endArr = [];

        function DealRows (arr){
            var obj2 = {};
            for(let item of arr){
                if(item instanceof Array){
                    DealRows(item);
                }else{
                    obj2[item] = obj[item];
                }
            }
            if(!util.isEmptyObject(obj2)){
                endArr.push([obj2]);
            }
        }
        DealRows(data.rows);

        console.log(endArr);


        return util.toTable(endArr, data.rows, data.cols);
    }
};