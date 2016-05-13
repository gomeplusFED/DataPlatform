/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 社交分析
 */

module.exports = {
    group() {
        return {
            name : "圈子数据",
            path : "/socialAnalysis/group",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "圈子数据总览",
                    query_api : "/socialAnalysis/groupOne"
                },
                {
                    type : "chart",
                    title : "圈子数据趋势",
                    query_api : "/socialAnalysis/groupTwo"
                },
                {
                    type : "chart",
                    title : "圈子类型分布",
                    query_api : "/socialAnalysis/groupThree"
                },
                {
                    type : "chart",
                    title : "圈子类型分布",
                    query_api : "/socialAnalysis/groupFour"
                },
                {
                    type : "table",
                    title : "热门圈子排行TOP100",
                    query_api : "/socialAnalysis/groupFive"
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
                    type : "table",
                    title : "话题数据总览",
                    query_api : "/socialAnalysis/topicsOne"
                },
                {
                    type : "chart",
                    title : "话题数据趋势",
                    query_api : "/socialAnalysis/topicsTwo"
                },
                {
                    type : "chart",
                    title : "圈子类型分布",
                    query_api : "/socialAnalysis/topicsThree"
                },
                {
                    type : "table",
                    title : "热门话题排行TOP100",
                    query_api : "/socialAnalysis/topicsFour"
                }
            ]
        }
    },
    groupHost() {
        return {
            name : "圈主数据",
            path : "/socialAnalysis/host",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "圈主数据总览",
                    query_api : "/socialAnalysis/hostOne"
                },
                {
                    type : "chart",
                    title : "圈主数据趋势",
                    query_api : "/socialAnalysis/hostTwo"
                },
                {
                    type : "chart",
                    title : "圈主类型分布",
                    query_api : "/socialAnalysis/hostThree"
                },
                {
                    type : "table",
                    title : "热门圈主排行TOP100",
                    query_api : "/socialAnalysis/hostFour"
                }
            ]
        }
    }
};