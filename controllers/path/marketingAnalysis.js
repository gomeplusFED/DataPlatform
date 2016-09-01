/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 营销分析
 */

module.exports = {
    overview() {
        return {
            name: "实时活动分析",
            path: "/marketingAnalysis/overview",
            display: true,
            defaultData: [{
                type: "chart",
                title: "",
                query_api: "/marketingAnalysis/overviewZero"
            //}, {
            //    type: "table",
            //    title: "实时概况",
            //    query_api: "/marketingAnalysis/overviewOne"
            // }, {
            //     type: "chart",
            //     title: "实时概况",
            //     query_api: "/marketingAnalysis/overviewFour"
            }]
        };
    },
    activityFlow() {
        return {
            name: "活动流量",
            path: "/marketingAnalysis/activityFlow",
            display: true,
            defaultData: [{
                type: "chart",
                title: "营销流量趋势",
                query_api: "/marketingAnalysis/activityFlowOne"
            },{
                type: "table",
                title: "营销流量明细表",
                query_api: "/marketingAnalysis/activityFlowTwo"
            }]
        };
    },
    couponInfo() {
        return {
            name: "优惠券信息",
            path: "/marketingAnalysis/couponInfo",
            display: true,
            defaultData: [{
                type: "chart",
                title: "优惠券分布",
                query_api: "/marketingAnalysis/couponInfoOne"
            },{
                type: "table",
                title: "优惠券明细",
                query_api: "/marketingAnalysis/couponInfoTwo"
            }]
        };
    }
};