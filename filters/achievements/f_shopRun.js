/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    shopRunOne(data, query , dates) {
        //累计求和
        let source = data.first.data[0],
            source2= data.second.data[0];

        let i = 0;
        for(let item of source){
            item["shop_visit_lv"] = util.numberLeave(item.shop_visit/item.shop_uv , 3);
            item["shop_deep"] = util.numberLeave(item.shop_pv/item.shop_uv , 3);
            item["Man_price"] = util.numberLeave(source2[i].shop_pay / source2[i].shop_user , 2);

            source2[i]["Every_price"] = util.numberLeave(source2[i].shop_pay / source2[i].shop_pay_order , 2);
            i++;
        }

        return util.toTable([source , source2], data.rows, data.cols);
    },
    shopRunTwo(data, query , dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            Result = [],
            rows   = data.rows[0],
            cols   = data.cols[0],
            type   = query.main_show_type_filter,
            count  = data.first.count;

        let i = 0;
        for(let item of source){
            item.date = util.getDate(item.date);
            for(let key of rows){
                if(!item[key]){
                    item[key] = second[i][key];
                }
            }
            i++;
        }

        if(type == "chart"){
            let map = {};
            let n = 0;
            for(let key of rows){
                console.log(key);
                if(key == "date"){
                    n++; 
                    continue;
                } 
                map[key] = cols[n].caption;
                n++;
            }

            let newData = {};
            for(let date of dates){
                newData[date] = {};
                for(let key in map){
                    newData[date][key] = 0;
                }
            }

            for(let item of source){
                for(let key in map){
                    newData[item.date][key] = item[key];
                }
            }

            return [{
                type : "line",
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }];
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    shopRunThree(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;

        let i = 1;
        for(let item of source){
            item.sort = (query.page - 1)*query.limit + i;
            i++;
        }
        
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    shopRunFour(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;

        let i = 1;
        for(let item of source){
            item.sort = (query.page - 1)*query.limit + i;
            i++;
        }
        
        return util.toTable([source], data.rows, data.cols, [count]);
    },
};