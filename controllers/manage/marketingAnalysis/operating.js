/**
 * @author yanglei
 * @date 20160906
 * @fileoverview 活动详情
 */
var api = require("../../../base/main"),
    _ = require("lodash"),
    filter = require("../../../filters/marketingAnalysis/operating");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/operatingOne",
        modelName : ["CamOverview" ],
        platform : false,
        filter(data) {
            return filter.allOne(data);
        },
        filter_select : [{
            title: '',
            filter_key : 'filter_type',
            groups: [{
                key: 'date',
                value: '日期'
            }, {
                key: 'channel',
                value: '渠道'
            }]
        }, {
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'active_pv-register',
                value: '活动页PV、新增注册'
            }, {
                key: 'coupon_get_num-coupon_use_num',
                value: '优惠卷领取数量、优惠卷使用数量'
            }, {
                key: 'order_num-pay_num',
                value: '订单总量、支付总量'
            }, {
                key: 'order_num_money-pay_num_money',
                value: '订单总金额、实际支付总金额'
            }]
        }]
    });

    return Router;
};