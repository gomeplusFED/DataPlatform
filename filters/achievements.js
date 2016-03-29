/**
 * @author yanglei
 * @date 20160105
 * @fileoverview 销售业绩
 */
var _ = require('lodash');

module.exports = {
    transaction : function(data) {
        var source = data.data;
        var keys = _.uniq(_.pluck(source, 'date'));
        var newdata = [];
        var obj = {
            date : '',
            order_num : 0,
            pay_num : 0,
            order_price : 0,
            pay_price : 0,
            coupons_num : 0,
            coupons_use : 0,
            refund_price : 0,
            refund_num : 0,
            price_total : 0,
            users_total : 0
        };
        keys.forEach(function(date) {
            obj.order_num = 0;
            obj.pay_num = 0;
            obj.order_price = 0;
            obj.pay_price = 0;
            obj.coupons_num = 0;
            obj.coupons_use = 0;
            obj.refund_price = 0;
            obj.refund_num = 0;
            obj.price_total = 0;
            obj.users_total = 0;
            source.forEach(function(key) {
                if(date === key.date) {
                    obj.date = date;
                    obj.order_num = obj.order_num + key.order_num;
                    obj.pay_num = obj.pay_num + key.pay_num;
                    obj.order_price = obj.order_price + key.order_price;
                    obj.pay_price = obj.pay_price + key.pay_price;
                    obj.coupons_num = obj.coupons_num + key.coupons_num;
                    obj.coupons_use = obj.coupons_use + key.coupons_use;
                    obj.refund_price = obj.refund_price + key.refund_price;
                    obj.refund_num = obj.refund_num + key.refund_num;
                    obj.price_total = obj.price_total + key.pay_price;
                    obj.users_total = obj.users_total + key.pay_users;
                }
            });
            newdata.push({
                date : date,
                order_num : obj.order_num,
                pay_num : obj.pay_num,
                order_price : obj.order_price,
                pay_price : obj.pay_price,
                customer_price :
                    (obj.price_total / (obj.users_total === 0 ? 1 : obj.users_total)).toFixed(2),
                coupons_rate :
                (obj.coupons_use / (obj.coupons_num === 0 ? 1 : obj.coupons_num) * 100).toFixed(2) + '%',
                refund_price : obj.refund_price,
                refund_num : obj.refund_num
            });
        });
        newdata.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        data.data = newdata;
        return data;
    },
    shop : function(data) {
        var newdata = [];
        var source = data.data;
        source.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        var keys = _.uniq(_.pluck(source, 'date'));
        var obj = {
            date : '',
            shop_new_num : 0,
            shop_succ_num : 0,
            shop_total: 0,
            shop_order_num : 0,
            shop_order_succ_num : 0,
            shop_access_num : 0,
            shop_share_num : 0
        };
        keys.forEach(function(key) {
            obj.shop_new_num = 0;
            obj.shop_succ_num = 0;
            obj.shop_order_num = 0;
            obj.shop_order_succ_num = 0;
            obj.shop_access_num = 0;
            obj.shop_share_num = 0;
            source.forEach(function(k) {
                if(key === k.date) {
                    obj.shop_new_num = obj.shop_new_num + k.shop_new_num;
                    obj.shop_succ_num = obj.shop_succ_num + k.shop_succ_num;
                    obj.shop_order_num = obj.shop_order_num +k.shop_order_num;
                    obj.shop_order_succ_num = obj.shop_order_succ_num + k.shop_order_succ_num;
                    obj.shop_access_num = obj.shop_access_num + k.shop_access_num;
                    obj.shop_share_num = obj.shop_share_num + k.shop_share_num;
                    obj.shop_total = k.shop_total_num;
                }
            });
            newdata.push({
                date : key,
                shop_new_num : obj.shop_new_num,
                shop_succ_num :  obj.shop_succ_num,
                shop_total: obj.shop_total,
                shop_order_num : obj.shop_order_num,
                shop_order_succ_num : obj.shop_order_succ_num,
                shop_access_num : obj.shop_access_num,
                shop_share_num : obj.shop_share_num
            });
        });
        data.data = newdata;
        return data;
    },
    shopTop : function(data, name) {
        var newdata = [];
        var access_num_total = 0;
        var access_users_total = 0;
        var pay_price_total = 0;
        var commodity_num_total = 0;
        data.sort(function(a, b) {
            return b[name] - a[name];
        });
        data.forEach(function(key) {
            access_num_total = access_num_total + key.access_num;
            access_users_total = access_users_total + key.access_users;
            pay_price_total = pay_price_total + key.pay_price;
            commodity_num_total = commodity_num_total + key.pay_commodity_num;
        });
        var times = data.length > 50 ? 50 : data.length;
        for(var i = 0; i < times; i++) {
            data[i].top = i + 1;
            data[i].access_num_rate =
                (data[i].access_num / (access_num_total === 0 ? 1 : access_num_total) * 100).toFixed(2) + '%';
            data[i].access_users_rate =
                (data[i].access_users / (access_users_total === 0 ? 1 : access_users_total) * 100).toFixed(2) + '%';
            data[i].pay_price_rate =
                (data[i].pay_price / (pay_price_total === 0 ? 1 : pay_price_total) * 100).toFixed(2) + '%';
            data[i].pay_commodity_rate =
                (data[i].pay_commodity_num / (commodity_num_total === 0 ? 1 : commodity_num_total) * 100).toFixed(2) + '%';
            newdata.push(data[i]);
        }
        return newdata;
    },
    commodity : function(data) {
        var source = data.data;
        var keys = _.uniq(_.pluck(source, 'date'));
        var newdata = [];
        var obj = {
            commodity_access_num : 0,
            order_commodity_num : 0,
            pay_commodity_num : 0,
            refund_num : 0,
            pay_price : 0,
            refund_price : 0
        };
        keys.forEach(function(key) {
            obj.commodity_access_num = 0;
            obj.order_commodity_num = 0;
            obj.pay_commodity_num = 0;
            obj.refund_num = 0;
            obj.pay_price = 0;
            obj.refund_price = 0;
            source.forEach(function(k) {
                if(key === k.date) {
                    obj.commodity_access_num = obj.commodity_access_num + k.commodity_access_num;
                    obj.order_commodity_num = obj.order_commodity_num + k.order_commodity_num;
                    obj.pay_commodity_num = obj.pay_commodity_num + k.pay_commodity_num;
                    obj.refund_num = obj.refund_num + k.refund_num;
                    obj.pay_price = obj.pay_price + k.pay_price;
                    obj.refund_price = obj.refund_price + k.refund_price;
                }
            });
            newdata.push({
                date : key,
                commodity_access_num : obj.commodity_access_num,
                order_commodity_num : obj.order_commodity_num,
                pay_commodity_num : obj.pay_commodity_num,
                refund_num : obj.refund_num,
                pay_price : obj.pay_price,
                refund_price : obj.refund_price
            });
        });
        newdata.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        data.data = newdata;
        return data;
    },
    commodityTop : function(data, name) {
        var access_num_total = 0;
        var access_users_total = 0;
        var order_price_total = 0;
        var newdata = [];
        data.sort(function(a, b) {
            return b[name] - a[name];
        });
        data.forEach(function(key) {
            access_num_total = access_num_total + key.access_num;
            access_users_total = access_users_total + key.access_users;
            order_price_total = order_price_total + key.order_price;
        });
        var times = data.length > 100 ? 100 : data.length;
        for(var i = 0; i < times; i++) {
            data[i].top = i + 1;
            data[i].access_num_rate =
                (data[i].access_num / (access_num_total === 0 ? 1 : access_num_total) * 100).toFixed(2) + '%';
            data[i].access_users_rate =
                (data[i].access_users / (access_users_total === 0 ? 1 : access_users_total) * 100).toFixed(2) + '%';
            data[i].order_price_rate =
                (data[i].order_price / (order_price_total === 0 ? 1 : order_price_total) * 100).toFixed(2) + '%';
            newdata.push(data[i]);
        }
        return newdata;
    },
    category : function(data) {
        var price_total = 0;
        var commodity_total = 0;
        data.forEach(function(key) {
            price_total = price_total + key.pay_price;
            commodity_total = commodity_total + key.commodity_num;
        });
        data.forEach(function(key) {
            key.pay_rate =
                (key.pay_price / (price_total === 0 ? 1 : price_total) * 100).toFixed(2) + '%';
            key.commodity_rate =
                (key.commodity_num / (commodity_total === 0 ? 1 : commodity_total) * 100).toFixed(2) + '%';
        });
        data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        return data;
    }
};