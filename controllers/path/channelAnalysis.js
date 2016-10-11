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
            name: "营销渠道分析",
            path: "/channelAnalysis/market",
            display: true,
            defaultData: [{
                type: "chart",
                title: "TOP10渠道",
                query_api: "/channelAnalysis/marketOne"
            //}, {
            //    type: "table",
            //    title: "渠道TOP50列表",
            //    query_api: "/channelAnalysis/marketTwo"
            }]
        };
    }
};