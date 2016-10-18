/**
 * @author Mr.He
 * @date 20161011
 * @fileoverview im模块 api 对应的数据整理函数
 */
var utils = require("../../utils");

module.exports = {

    EventOne(data , query , dates){
        let source = data.first.data[0];
        let map = {
            "click_uv" : "点击用户",
            "click_pv" : "点击次数"
        }

        let newDate = {};
        for(let date of dates){
            let obj = {};
            for(let key in map){
                obj[key] = 0;
            }
            newDate[date] = obj;
        }

        for(let item of source){
            item.date = utils.getDate(item.date);
            newDate[item.date] = item;
        }

        return [{
            type : "line",
            map : map,
            data : newDate,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    EventTwo(data , query , dates){

        let dataSource = data.first.data[0];
        let Source = [];
        for(let date of dates){
            let obj = {
                "date" : date
            }
            Source.push(obj);
        }

        for(let item of dataSource){
            item.date = utils.getDate(item.date);
            let num;
            num = dates.indexOf(item.date);
            item.click_lv = utils.numberLeave( item.click_pv / item.click_uv , 3 );
            Source[num] = item;
        }

        let Source2 = utils.ArraySort(Source);

        return utils.toTable([Source2], data.rows, data.cols);
    }
}