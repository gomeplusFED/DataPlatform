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
    indexOne(data , query , dates){
        //需要输出两个一样的数组，每个数组包涵三条数据，每条数据包括两个表的所有字段

        let keys = data.rows[0].concat(data.rows[1]);
        
        // console.log(keys);
        // console.log(123,query.date , data);


        let source = data.first.data[0];
        if(!source[0]){
            source[0] = {};
        }
        if(!source[1]){
            source[1] = {};
        }

        let Result = [source[0] , source[1]];

        for(let key of keys){
            switch(key){
                case "date":
                    source[0].date = utils.beforeDate(source[0].date , 1)[0];
                    source[1].date = utils.beforeDate(source[1].date , 1)[0];
                    break;
                case "5_ipv_uv_lv":
                    Computer(key , "search_prodet_ipv_uv" , "search_result_uv" , source[0] ,source[1]);
                    break;
                case "6_uv_lv":
                    Computer(key , "search_order_uv" , "search_result_uv" , source[0] ,source[1]);
                    break;
                case "7_ipv_lv":
                    Computer(key , "search_order_uv" , "search_prodet_ipv_uv" , source[0] ,source[1]);
                    break;
                case "8_ctr":
                    Computer(key , "search_prodet_ipv" , "search_exposure_product_num" , source[0] ,source[1]);
                    break;
            }
        }


        let obj = {};
        let Reg = /\%/ig;
        for(let key of keys){
            if(key == "date"){
                obj.date = "GAP";
                continue;
            }

            if(source[0][key]/1 && source[1][key]/1){
                obj[key] = (source[0][key] - source[1][key]) / source[1][key];
            }else{
                let num = source[0][key].replace(Reg , "") / 1.0;
                let num1= source[1][key].replace(Reg , "") / 1.0;
                obj[key] = (num - num1) / num1;
            }
            obj[key] = utils.toFixed(obj[key] , 0);
        }

        Result.push(obj);

        return utils.toTable([Result , Result], data.rows, data.cols);
    }
}