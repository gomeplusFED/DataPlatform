/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */

module.exports = {
    index() {
        return {
            id : 71,
            name : "分享数据概览",
            path : "/share/index",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "分享数据总览",
                    query_api : "/share/indexOne"
                },
                {
                    type : "chart",
                    title : "分享趋势",
                    query_api : "/share/indexTwo"
                },
                {
                    type : "chart",
                    title : "分享渠道分布",
                    query_api : "/share/indexThree"
                },
                {
                    type : "chart",
                    title : "分享类型分布",
                    query_api : "/share/indexFour"
                },
                {
                    type : "chart",
                    title : "分享平台分布",
                    query_api : "/share/indexFive"
                }
            ]
        }
    },
    channel() {
        return {
            id : 667,
            name : "分享渠道分析",
            path : "/share/channel",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "分享渠道总览",
                    query_api : "/share/channelOne"
                },
                {
                    type : "chart",
                    title : "分享渠道趋势",
                    query_api : "/share/channelTwo"
                },
                {
                    type : "chart",
                    title : "分享渠道分类型",
                    query_api : "/share/channelThree"
                },
                {
                    type : "chart",
                    title : "分享渠道分平台",
                    query_api : "/share/channelFour"
                },
                {
                    type : "table",
                    title : "分享渠道TOP100",
                    query_api : "/share/channelFive"
                }
            ]
        }
    },
    type() {
        return {
            id : 668,
            name : "分享类型分析",
            path : "/share/type",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "分享类型总览",
                    query_api : "/share/typeOne"
                },
                {
                    type : "chart",
                    title : "分享类型趋势",
                    query_api : "/share/typeTwo"
                },
                {
                    type : "chart",
                    title : "分享类型分渠道",
                    query_api : "/share/typeThree"
                },
                {
                    type : "chart",
                    title : "分享类型分平台",
                    query_api : "/share/typeFour"
                },
                {
                    type : "table",
                    title : "分享类型TOP100",
                    query_api : "/share/typeFive"
                }
            ]
        }
    }
};