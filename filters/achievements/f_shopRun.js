/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    shopRunOne(data, query , dates) {
        //累计求和
        let source = data.first.data[0],
            source2= data.second.data[0],
            obj = {},
            obj_two = {},
            total_shop_pay = 0,
            total_shop_pay_order = 0;

        for(let row of data.rows[0]) {
            obj[row] = 0;
        }
        for(let row of data.rows[1]) {
            obj_two[row] = 0;
        }

        for(let item of source){
            item["shop_visit_lv"] = util.numberLeave(item.shop_visit/item.shop_uv , 3);
            item["shop_deep"] = util.numberLeave(item.shop_pv/item.shop_uv , 3);
        }

        for(let item of source2) {
            total_shop_pay += item.shop_pay;
            total_shop_pay_order += item.shop_pay_order;
            obj["Man_price"] += util.numberLeave(item.shop_pay / item.shop_user , 2);
        }

        for(let item of source) {
            for(let key in obj) {
                if(key !== "Man_price") {
                    obj[key] += item[key];
                }
            }
        }
        for(let item of source2) {
            for(let key in obj_two) {
                if(key !== "Every_price") {
                    obj_two[key] += item[key];
                }
            }
        }

        obj.shop_visit_lv = (obj.shop_visit_lv / source.length).toFixed(2);
        obj.shop_deep = (obj.shop_deep / source.length).toFixed(2);
        obj.Man_price = (obj.Man_price / source2.length).toFixed(2);
        obj_two.Every_price = (total_shop_pay / total_shop_pay_order).toFixed(2);
        obj_two.shop_pay_all = obj_two.shop_pay_all.toFixed(2);
        obj_two.shop_pay = obj_two.shop_pay.toFixed(2);
        obj_two.shop_success = obj_two.shop_success.toFixed(2);
        obj_two.shop_return_money = obj_two.shop_return_money.toFixed(2);

        return util.toTable([[obj] , [obj_two]], data.rows, data.cols);
    },
    shopRunTwo(data, query , dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            rows   = data.rows[0],
            cols   = data.cols[0],
            obj = {},
            type   = query.main_show_type_filter;

        for(let date of dates) {
            obj[date] = {};
            for(let row of data.rows[0]) {
                if(row !== "date") {
                    obj[date][row] = 0;
                }
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            for(let key in obj[date]){
                if(item[key]){
                    obj[date][key] += item[key];
                }
            }
        }

        for(let item of second) {
            let date = util.getDate(item.date);
            for(let key in obj[date]){
                if(item[key]){
                    obj[date][key] += item[key];
                }
            }
        }

        if(type !== "table"){
            let map = {};
            let n = 0;
            for(let key of rows){
                if(key == "date"){
                    n++; 
                    continue;
                } 
                map[key] = cols[n].caption;
                n++;
            }


            return [{
                type : "line",
                map : map,
                data : obj,
                config: { // 配置信息
                    stack: false  // 图的堆叠
                }
            }];
        }

        let newData = [];

        for(let key in obj) {
            obj[key].date = key;
            newData.push(obj[key]);
        }
        return util.toTable([newData], data.rows, data.cols/*, [count]*/);
    },
    shopRunThree(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;
        let i = 1;

        if(!data.first.sum) data.first.sum = [];

        for(let item of source){
            if(query.page){
                item.sort = (query.page - 1)*query.limit + i;
            }else{
                item.sort = i;
            }
            if(!data.first.sum[0]) data.first.sum[0] = 1;
            if(!data.first.sum[1]) data.first.sum[1] = 1;
            item["shop_pv_lv"] = util.toFixed( item.shop_pv / data.first.sum[0] , 0);
            item["shop_uv_lv"] = util.toFixed( item.shop_uv / data.first.sum[1] , 0 );
            i++;
        }
        
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    shopRunFour(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;
        let i = 1;

        for(let item of source){
            if(query.page){
                item.sort = (query.page - 1)*query.limit + i;
            }else{
                item.sort = i;
            }

            if(!data.first.sum[0]) data.first.sum = [1];

            item["shop_pay_order_lv"] = util.toFixed( item.shop_pay_order / data.first.sum[0] , 0);
            item["Every_price"] = util.numberLeave(item.shop_pay / item.shop_pay_order , 2);
            item["Every_Man_price"] = util.numberLeave(item.shop_pay / item.shop_pay_order , 2);
            i++;
        }
        
        return util.toTable([source], data.rows, data.cols, [count]);
    },
};