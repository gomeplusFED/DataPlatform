/**
 * @author yanglei
 * @date 20160905
 * @fileoverview 活动总览
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/marketingAnalysis/all");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/allOne",
        modelName : ["CamOverview" ],
        platform : false,
        procedure : [{
            aggregate : "params",
            sum : ["active_uv", "active_pv", "register", "coupon_get_num",
                "coupon_use_num", "order_num", "order_num_money",
                "pay_num", "pay_num_money", "return_num", "return_num_money"],
            get : ""
        }],
        filter(data) {
            return filter.allOne(data);
        },
        rows : [
            ["active_uv", "active_pv", "register", "coupon_get_num",
                "coupon_use_num", "order_num", "order_num_money",
                "pay_num", "pay_num_money", "return_num", "return_num_money"]
        ],
        cols : [
            [
                {
                    caption : "活动页UV"
                },{
                    caption : "活动页PV"
                },{
                    caption : "新增注册"
                },{
                    caption : "优惠券领取数量"
                },{
                    caption : "优惠券使用数量"
                },{
                    caption : "订单总量"
                },{
                    caption : "订单总金额"
                },{
                    caption : "支付总量"
                },{
                    caption : "实际支付总金额"
                },{
                    caption : "退单订单数"
                },{
                    caption : "退单总金额"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/allTwo",
        modelName : ["CamCamlistActive"],
        platform : false,
        filter(data, query, dates) {
            return filter.allTwo(data, query, dates);
        },
        filter_select : [{
            title: '',
            filter_key : 'filter_type',
            groups: [{
                key: 'date',
                value: '日期'
            }, {
                key: 'activity',
                value: '活动'
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