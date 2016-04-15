/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    shopOne(data, filter_key, dates) {
        var source = data.data,
            filter_name = {
                shop_new_num : "新增注册店铺",
                shop_succ_num : "成功入驻店铺",
                shop_order_succ_num : "成功交易店铺",
                shop_access_num : "被访问店铺数"
            },
            type = "line",
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            newData[util.getDate(key.date)].value += key[filter_key];
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }]
    },
    shopTwo(data, dates) {
        var source = data.data,
            obj = {},
            newData = [];
        dates.sort((a, b) => {
            return new Date(b) - new Date(a);
        });
        for(var date of dates) {
            obj[date] = {
                shop_new_num : 0,
                shop_succ_num : 0,
                shop_total_num : 0,
                shop_order_num : 0,
                shop_order_succ_num : 0,
                shop_access_num : 0,
                shop_share_num : 0
            };
        }
        for(var key of source) {
            obj[util.getDate(key.date)].shop_new_num += key.shop_new_num;
            obj[util.getDate(key.date)].shop_succ_num += key.shop_succ_num;
            obj[util.getDate(key.date)].shop_total_num += key.shop_total_num;
            obj[util.getDate(key.date)].shop_order_num += key.shop_order_num;
            obj[util.getDate(key.date)].shop_order_succ_num += key.shop_order_succ_num;
            obj[util.getDate(key.date)].shop_access_num += key.shop_access_num;
            obj[util.getDate(key.date)].shop_share_num += key.shop_share_num;
        }
        for(var date of dates) {
            newData.push({
                date : date,
                shop_new_num : obj[date].shop_new_num,
                shop_succ_num : obj[date].shop_succ_num,
                shop_total_num : obj[date].shop_total_num,
                shop_order_num : obj[date].shop_order_num,
                shop_order_succ_num : obj[date].shop_order_succ_num,
                shop_access_num : obj[date].shop_access_num,
                shop_share_num : obj[date].shop_share_num
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    shopThree(data) {
        var source = data.data,
            ids = util.uniq(_.pluck(source, "shop_id")),
            newData = [],
            total_access_num = 0,
            total_access_users = 0,
            obj = [];
        for(var id of ids) {
            obj.push()
        }
        var top = source.length > 50 ? 50 : source.length;
        for(var i = 0; i < top; i++) {
            obj[source[i].shop_id] = {
                top : i + 1,
                shop_name : source[i].shop_name,
                access_num : 0,
                access_users : 0,
                share_commodity_num : 0
            };
        }
        for(var key of source) {
            total_access_num += key.access_num;
            total_access_users += key.access_users;
            if(obj[key.shop_id]) {
                obj[key.shop_id].access_num += key.access_num;
                obj[key.shop_id].access_users += key.access_users;
                obj[key.shop_id].share_commodity_num += key.share_commodity_num;
            }
        }
        //console.log(obj);
        for(var i = 0; i < top; i++) {
            newData.push({
                top : obj[source[i].shop_id].top,
                shop_name : obj[source[i].shop_id].shop_name,
                access_num : obj[source[i].shop_id].access_num,
                access_users : obj[source[i].shop_id].access_users,
                share_commodity_num : obj[source[i].shop_id].share_commodity_num,
                access_num_rate : util.toFixed(obj[source[i].shop_id].access_num, total_access_num),
                access_users_rate : util.toFixed(obj[source[i].shop_id].access_users, total_access_users)
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};