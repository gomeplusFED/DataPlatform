/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    filter = require("../../../filters/channelAnalysis/market");

module.exports = (Router) => {
    Router = new main(Router,{
        router : "/channelAnalysis/marketOne",
        modelName : ["ChaChalistChannel"],
        platform : false,
        selectFilter(req, cb) {
            let filter_select = [{
                title: '指标',
                filter_key : 'filter_key',
                groups: [{
                    key: 'active_pv',
                    value: '活动页面PV'
                }, {
                    key: 'register',
                    value: '活动新增注册'
                }, {
                    key: 'coupon_get_num',
                    value: '优惠券领取数量'
                }, {
                    key: 'coupon_use_num',
                    value: '优惠券使用数量'
                }, {
                    key: 'order_num',
                    value: '订单总量'
                }, {
                    key: 'pay_num',
                    value: '支付总量'
                }, {
                    key: 'order_num_money',
                    value: '订单总金额'
                }, {
                    key: 'pay_num_money',
                    value: '实际支付总金额'
                }]
            }];
        },
        filter(data, query, dates, type) {
            return filter.shopOne(data, query.filter_key, dates);
        }
    });

    return Router;
};