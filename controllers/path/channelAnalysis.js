/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 渠道分析
 */

module.exports = {
    channel() {
        return {
            name: "渠道列表",
            path: "/channelAnalysis",
            display: true,
            defaultData: [{
                type: "chart",
                title: "TOP 10渠道",
                query_api: "/channelAnalysis/channelOne"
            },{
                type: "table",
                title: "渠道数据明细",
                query_api: "/channelAnalysis/channelTwo"
            }]
        };
    },
    channelOperating() {
        return {
            name: "渠道列表",
            path: "/channelAnalysis/operating",
            display: true,
            defaultData: [{
                type: "table",
                title: "渠道统计",
                query_api: "/channelAnalysis/operatingOne"
            }, {
                type: "chart",
                title: "日趋势变化",
                query_api: "/channelAnalysis/operatingTwo"
            },{
                type: "table",
                title: "渠道数据明细",
                query_api: "/channelAnalysis/operatingThree"
            }]
        };
    },
    market() {
        return {
            id : 1,
            name: "营销渠道分析",
            path: "/channelAnalysis/market",
            display: true,
            defaultData: [{
                type: "chart",
                title: "TOP10渠道",
                query_api: "/channelAnalysis/marketOne"
            }, {
                type: "table",
                title: "渠道TOP50列表",
                query_api: "/channelAnalysis/marketTwo"
            }]
        };
    },
    marketOperating() {
        return {
            id : 0,
            name: "营销渠道详情",
            path: "/channelAnalysis/marketOperating",
            display: true,
            defaultData: [{
                type: "chart",
                title: "渠道效果趋势",
                query_api: "/channelAnalysis/marketOperatingOne"
            }, {
                type: "table",
                title: "渠道效果明细",
                query_api: "/channelAnalysis/marketOperatingTwo"
            }]
        };
    },
    apk() {
        return {
            id : 0,
            name: "APK渠道列表",
            path: "/channelAnalysis/apk",
            display: true,
            defaultData: [{
                type: "chart",
                title: "TOP 10 渠道",
                query_api: "/channelAnalysis/apkOne"
            }, {
                type: "table",
                title: "渠道TOP 50 列表",
                query_api: "/channelAnalysis/apkTwo"
            }]
        };
    },
    apkOperating() {
        return {
            id : 1,
            name: "渠道 分析",
            path: "/channelAnalysis/apkOperating",
            display: true,
            defaultData: [{
                type: "table",
                title: "渠道统计",
                query_api: "/channelAnalysis/apkOperatingOne"
            }, {
                type: "chart",
                title: "日趋势变化",
                query_api: "/channelAnalysis/apkOperatingTwo"
            }, {
                type: "table",
                title: "渠道数据明细",
                query_api: "/channelAnalysis/apkOperatingThree"
            }]
        };
    }
};