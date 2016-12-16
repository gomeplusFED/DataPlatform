/**
 * @author Mr.He
 * @date 20161011
 * @fileoverview im模块 api 对应的数据整理函数
 */
var utils = require("../../utils");

module.exports = {

    FaceOne(data , query , dates){
        let source = data.first.data[0];
        let map = {
            "load_uv" : "下载人数",
            "load_pv" : "下载次数"
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

    FaceTwo(data , query , dates){
        let dataSource = data.first.data[0];
        let Source = [];
        /*for(let date of dates){
            let obj = {
                "date" : date
            }
            Source.push(obj);
        }*/

        // console.log(dataSource)
        for(let item of dataSource){
            item.date = utils.getDate(item.date);
            /*let num;
            num = dates.indexOf(item.date);
            console.log(num)*/
            Source.push(item);
        }

        // let Source2 = utils.ArraySort(Source);

        return utils.toTable([Source], data.rows, data.cols);
    }
}