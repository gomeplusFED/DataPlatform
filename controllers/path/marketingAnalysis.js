/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 营销分析
 */

module.exports = {
    overview() {
        return {
            id : 0,
            name: "实时活动分析",
            path: "/marketingAnalysis/overview",
            display: true,
            defaultData: [{
                type: "chart",
                title: "",
                query_api: "/marketingAnalysis/overviewZero"
            }, {
                type: "table",
                title: "实时概况",
                query_api: "/marketingAnalysis/overviewOne"
            }, {
                type: "chart",
                title: "实时流量趋势",
                query_api: "/marketingAnalysis/overviewTwo"
            }, {
                type: "chart",
                title: "实时订单趋势",
                query_api: "/marketingAnalysis/overviewThree"
            }]
        };
    },
    all() {
        return {
            id : 1,
            name: "活动流量",
            path: "/marketingAnalysis/activityFlow",
            display: true,
            defaultData: [{
                type: "table",
                title: "营销流量总览",
                query_api: "/marketingAnalysis/allOne"
            },{
                type: "chart",
                title: "营销趋势",
                query_api: "/marketingAnalysis/allTwo"
            },{
                type: "table",
                title: "营销列表",
                query_api: "/marketingAnalysis/allThree"
            }]
        };
    },
    operating() {
        return {
            name: "活动流量",
            path: "/marketingAnalysis/operating",
            display: true,
            defaultData: [{
                type: "chart",
                title: "活动效果分布",
                query_api: "/marketingAnalysis/operatingOne"
            },{
                type: "table",
                title: "活动效果明细",
                query_api: "/marketingAnalysis/operatingTwo"
            }]
        };
    }
};