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
                xpop_shops_num_add_al : "新增注册店铺",
                xpop_shops_num_succ_add_al : "成功入驻店铺",
                xpop_shops_num_succ_deal_al : "成功交易店铺",
                xpop_shops_num_share_al : "被访问店铺数"
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
            date = util.getDate(key.date);
            newData[date].value += key.value;
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
                xpop_shops_num_add_al : 0,
                xpop_shops_num_succ_add_al : 0,
                xpop_shops_num_acc_al : 0,
                xpop_shops_num_succ_tot_al : 0,
                xpop_shops_num_share_al : 0,
                xpop_shops_num_succ_order_al : 0,
                xpop_shops_num_succ_deal_al : 0
            };
        }

        for(var key of source) {
            date = util.getDate(key.date);
            obj[date][key.key_type] += key.value;
        }

        for(var date of dates) {
            newData.push({
                date : date,
                one : obj[date].xpop_shops_num_add_al,
                two : obj[date].xpop_shops_num_succ_add_al,
                three : obj[date].xpop_shops_num_succ_tot_al,
                four : obj[date].xpop_shops_num_succ_order_al,
                five : obj[date].xpop_shops_num_succ_deal_al,
                six : obj[date].xpop_shops_num_acc_al,
                seven : obj[date].xpop_shops_num_share_al
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    shopThree(data) {
        var source = data.data,
            newData = [],
            two_total = 0,
            three_total = 0,
            length = source.length,
            top = length > 50 ? 50 : length;

        source.sort((a, b) => {
            return b.access_num - a.access_num;
        });

        for(var key of source) {
            two_total += key.access_num;
            three_total += key.access_users;
        }

        for(var i = 0; i < top; i++) {
            key = source[i];
            newData.push({
                top : i + 1,
                one : key.shop_name,
                two : key.access_num,
                two_rate : util.toFixed(key.access_num, two_total),
                three : key.access_users,
                three_rate : util.toFixed(key.access_users, three_total),
                four : key.share_num
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    shopFour(data, sku_type) {
        var source = data.data,
            newData = [],
            total_pay_price = 0,
            total_pay_commodity_num = 0,
            length = source.length,
            top = length > 50 ? 50 : length;

        source.sort((a, b) => {
            return b.pay_price - a.pay_price;
        });

        for(var key of source) {
            total_pay_price += key.pay_price;
            total_pay_commodity_num += key.pay_commodity_num;
        }

        if(sku_type === "2") {
            data.cols[0][4].caption = "支付商品件数";
            data.cols[0][5].caption = "支付商品件数占比";
        } else {
            data.cols[0][4].caption = "支付商品数";
            data.cols[0][5].caption = "支付商品数占比";
        }

        for(var i = 0; i < top; i++) {
            key = source[i];
            newData.push({
                top : 1 + i,
                shop_name : key.shop_name,
                pay_price : key.pay_price.toFixed(2),
                pay_price_rate : util.toFixed(key.pay_price, total_pay_price),
                pay_commodity_num : key.pay_commodity_num,
                pay_commodity_rate : util.toFixed(key.pay_commodity_num, total_pay_commodity_num),
                share_commodity_num : key.share_commodity_num
            })
        }

        return util.toTable([newData], data.rows, data.cols);
    }
};