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
    }
};