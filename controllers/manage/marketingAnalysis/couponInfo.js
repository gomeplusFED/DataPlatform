/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 优惠券信息
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/marketingAnalysis/couponInfo");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/couponInfoOne",
        modelName : ["MarketingCoupon" ],
        platform : false,
        coupon : true,
        filter(data, filter_key, dates) {
            return filter.couponInfoOne(data);
        }
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/couponInfoTwo",
        modelName : ["MarketingCouponDetails"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.couponInfoTwo(data);
        },
        rows : [
            [ 'date', 'coupon_id', 'coupon_type', 'shop_name', 'coupon_scope',
                'coupon_facevalue', 'coupon_describe', 'coupon_status' ]
        ],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '优惠券ID',
                    type : 'string'
                },
                {
                    caption : '优惠券类型',
                    type : 'string'
                },
                {
                    caption : '商家名称',
                    type : 'string'
                },
                {
                    caption : '使用范围',
                    type : 'string'
                },
                {
                    caption : '优惠券面值',
                    type : 'string'
                },
                {
                    caption : '优惠活动',
                    type : 'string'
                },
                {
                    caption : '优惠券状态',
                    type : 'string'
                }
            ]
        ]
    });

    return Router;
};