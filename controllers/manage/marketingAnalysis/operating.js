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
        modelName : ["CamCamlistChannel", "Channel"],
        platform : false,
        secondParams(query, params, data) {
            let ids = _.uniq(_.pluck(data.first.data[0], "channel_no"));
            return {
                channel_id : ids
            };
        },
        filter(data, query, dates) {
            return filter.operatingOne(data, query, dates);
        },
        global_platform : {
            show : true,
            name : "(默认日期)",
            key : "filter_type",
            list : [{
                key: 'date',
                name: '日期'
            }, {
                key: 'channel',
                name: '渠道'
            }]
        },
        filter_select : [{
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