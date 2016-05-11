/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 社交分析
 */

module.exports = {
    circle() {
        return {
            name : "圈子数据",
            path : "/socialAnalysis/circle",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "圈子数据总览",
                    query_api : "/share/insideOne"
                },
                {
                    type : "chart",
                    title : "圈子数据趋势",
                    query_api : "/share/insideOne"
                },
                {
                    type : "chart",
                    title : "圈子类型分布",
                    query_api : "/share/insideOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/insideTwo"
                }
            ]
        }
    },
    topics() {
        return {
            name : "话题数据",
            path : "/socialAnalysis/topics",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "站内分享趋势",
                    query_api : "/share/insideOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/insideTwo"
                }
            ]
        }
    },
    circleHost() {
        return {
            name : "圈主数据",
            path : "/socialAnalysis/circleHost",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "站内分享趋势",
                    query_api : "/share/outerOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/outerTwo"
                }
            ]
        }
    }
};