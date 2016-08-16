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
                /*{
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
                    title : "圈子一级新增分布",
                    query_api : "/socialAnalysis/groupThree"
                },
                {
                    type : "chart",
                    title : "圈子二级新增分布",
                    query_api : "/socialAnalysis/groupFour"
                },
                {
                    type : "table",
                    title : "热门圈子排行TOP100",
                    query_api : "/socialAnalysis/groupFive"
                },*/
                /* {
                    type : "table",
                    title:"话题列表",
                    query_api : "/socialAnalysis/groupNine"
                },*/
                //新的修改
                {
                    type : "table",
                    title : "圈子数据总览",
                    query_api : "/socialAnalysis/groupSix"
                },
                /*{
                    type: "table",
                    title:"圈子数据统计",
                    query_api : "/socialAnalysis/groupSeven"
                },
                {
                    type : "chart",
                    title : "圈子数据趋势",
                    query_api : "/socialAnalysis/groupEight"
                },
                {
                    type : "chart",
                    title : "一级圈子类型分布",
                    query_api : "/socialAnalysis/groupNine"
                },
                {
                    type : "chart",
                    title : "二级圈子类型分布",
                    query_api : "/socialAnalysis/groupTen"
                },
                {
                    type : "table",
                    title : "热门圈子排行",
                    query_api : "/socialAnalysis/groupEleven"
                }*/
            ]
        }
    },
    groupDetail(){
        return {
            name : "单条圈子数据",
            path : "/socialAnalysis/groupDetail",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "数据总览",
                    query_api : "/socialAnalysis/groupDetailOne"
                },
                {
                    type : "table",
                    title : "数据统计",
                    query_api : "/socialAnalysis/groupDetailTwo"
                },
                {
                    type : "chart",
                    title : "数据趋势",
                    query_api : "/socialAnalysis/groupDetailThree"
                },
                {
                    type : "table",
                    title : "话题列表",
                    query_api : "/socialAnalysis/groupDetailFour"                    
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
                //},
                //{
                //    type : "table",
                //    title : "话题数据统计",
                //    query_api : "/socialAnalysis/topicsTwo"
                //},
                //{
                //    type : "chart",
                //    title : "话题数据趋势",
                //    query_api : "/socialAnalysis/topicsThree"
                //},
                //{
                //    type : "chart",
                //    title : "一级圈子类型分布",
                //    query_api : "/socialAnalysis/topicsFour"
                //},
                //{
                //    type : "chart",
                //    title : "二级圈子类型分布",
                //    query_api : "/socialAnalysis/topicsFive"
                //},
                //{
                //    type : "table",
                //    title : "热门话题排行TOP100",
                //    query_api : "/socialAnalysis/topicsSix"
                }
            ]
        }
    },
    topicsDetail(){
        return {
            name : "单条话题数据",
            path : "/socialAnalysis/topicsDetail",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "数据总览",
                    query_api : "/socialAnalysis/topicDetailOne"
                },
                {
                    type : "table",
                    title : "数据统计",
                    query_api : "/socialAnalysis/topicDetailTwo"
                },
                {
                    type : "chart",
                    title : "数据趋势",
                    query_api : "/socialAnalysis/topicDetailThree"
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
                    type : "table",
                    title : "圈主数据统计",
                    query_api : "/socialAnalysis/hostTwo"
                },
                {
                    type : "chart",
                    title : "圈主数据趋势",
                    query_api : "/socialAnalysis/hostThree"
                },
                {
                    type : "chart",
                    title : "新增圈主一级分布",
                    query_api : "/socialAnalysis/hostFour"
                },
                {
                    type : "chart",
                    title : "新增圈主二级分布",
                    query_api : "/socialAnalysis/hostFive"
                },
                {
                    type : "table",
                    title : "热门圈主排行TOP100",
                    query_api : "/socialAnalysis/hostSix"
                }
            ]
        }
    }
};