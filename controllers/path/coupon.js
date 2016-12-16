/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */

module.exports = {
    all() {
        return {
            id : 0,
            name: "优惠券汇总",
            path: "/coupon",
            display: true,
            defaultData: [{
                type: "table",
                title: "优惠券总览",
                query_api: "/coupon/allOne"
            },{
                type: "chart",
                title: "优惠券趋势",
                query_api: "/coupon/allTwo"
            },{
                type: "chart",
                title: "优惠券分布",
                query_api: "/coupon/allThree"
            }]
        };
    },
    platformCoupon() {
        return {
            id : 1,
            name: "平台优惠券总览",
            path: "/coupon/platformCoupon",
            display: true,
            defaultData: [{
                type: "table",
                title: "优惠券总览",
                query_api: "/coupon/platformCouponOne"
            },{
                type: "chart",
                title: "优惠券趋势",
                query_api: "/coupon/platformCouponTwo"
            },{
                type: "chart",
                title: "面值分布",
                query_api: "/coupon/platformCouponThree"
            },{
                type: "table",
                title: "优惠券使用明细",
                query_api: "/coupon/platformCouponFour"
            },{
                type: "table",
                title: "优惠券列表",
                query_api: "/coupon/platformCouponFive"
            }]
        };
    },
    shopCoupon() {
        return {
            id : 2,
            name: "店铺优惠券总览",
            path: "/coupon/shopCoupon",
            display: true,
            defaultData: [{
                type: "table",
                title: "优惠券总览",
                query_api: "/coupon/shopCouponOne"
            },{
                type: "chart",
                title: "优惠券趋势",
                query_api: "/coupon/shopCouponTwo"
            },{
                type: "chart",
                title: "面值分布",
                query_api: "/coupon/shopCouponThree"
            },{
                type: "table",
                title: "优惠券明细",
                query_api: "/coupon/shopCouponFour"
            },{
                type: "table",
                title: "店铺优惠券TOP100",
                query_api: "/coupon/shopCouponFive"
            }]
        };
    }
};