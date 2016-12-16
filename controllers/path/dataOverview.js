/**
 * @author luoye
 * @date 20160406
 * @fileoverview 数据概览
 */

module.exports = {
    all() {
        return {
            name: "数据概览",
            path: "/dataOverview/app",
            display: true,
            subPages : [{
                url : "/terminal/provinces",
                name : "地域"
            }, {
                url : "/useAnalysis/accessPage",
                name : "访问页面"
            }],
            defaultData: [{
                type: "table",
                title: "数据概览",
                query_api: "/dataOverview/dataOverviewAllOne"
            }, {
                type: "chart",
                title: "数据趋势",
                query_api: "/dataOverview/dataOverviewAllTwo"
            }, {
                type: "table",
                title: "地域分布 TOP10",
                query_api: "/dataOverview/dataOverviewAllThree"
            }, {
                type: "table",
                title: "访问页面 TOP10",
                query_api: "/dataOverview/dataOverviewAllFour"
            }]
        }
    },
    wap() {
        return {
            name: "数据概览-WAP",
            path: "/dataOverview/wap",
            display: true,
            defaultData: [{
                type: "table",
                title: "数据概览",
                query_api: "/dataOverview/wapOne"
            }, {
                type: "chart",
                title: "数据趋势",
                query_api: "/dataOverview/wapTwo"
            }, {
                type: "table",
                title: "地域分布 TOP10",
                query_api: "/dataOverview/wapThree"
            }, {
                type: "table",
                title: "访问页面 TOP10",
                query_api: "/dataOverview/wapFour"
            }]
        }
    }
};
