/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 社交分析
 */

module.exports = {
    panel(){
        return {
            name : "社交面板",
            path : "/socialAnalysis/panel",
            display: true,
            id   : "00209",
            defaultData : [
                {
                    title: "",
                    query_api : "/achievements/tradePanelZero"
                },
                {
                    type : "table",
                    title : "圈子汇总",
                    query_api : "/socialAnalysis/panelOne"
                },
                {
                    type : "table",
                    title : "话题汇总",
                    query_api : "/socialAnalysis/panelTwo"
                },
                {
                    type : "table",
                    title : "话题交易汇总",
                    query_api : "/socialAnalysis/panelThree"
                },
                {
                    type : "table",
                    title : "好友关系汇总",
                    query_api : "/socialAnalysis/panelFour"
                },
                {
                    type : "table",
                    title : "兴趣点汇总",
                    query_api : "/socialAnalysis/panelFive"
                }
            ]
        }
    },
    total(){
        return {
            name : "累计数据",
            path : "/socialAnalysis/total",
            display:true,
            id   : "00210",
            defaultData : [
                {
                    type : "table",
                    title: "社交数据总览",
                    query_api: "/socialAnalysis/totalOne"
                },
                {
                    type : "chart",
                    title: "话题数据一级分布",
                    query_api: "/socialAnalysis/totalTwo"
                }
            ]
        }
    },
    group() {
        return {
            id : 72,
            name : "圈子数据",
            path : "/socialAnalysis/group",
            display : true,
            defaultData : [    
                /*{
                    type : "table",
                    title : "圈子数据总览",
                    query_api : "/socialAnalysis/groupSix"
                },*/
                {
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
                }
            ]
        }
    },
    groupDetail(){
        return {
            name : "单条圈子数据",
            path : "/socialAnalysis/groupDetail",
            display : true,
            id   : "00212",
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
            id : 73,
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
                    type : "table",
                    title : "话题数据统计",
                    query_api : "/socialAnalysis/topicsTwo"
                },
                {
                    type : "chart",
                    title : "话题数据趋势",
                    query_api : "/socialAnalysis/topicsThree"
                },
                {
                    type : "chart",
                    title : "一级圈子类型分布",
                    query_api : "/socialAnalysis/topicsFour"
                },
                {
                    type : "chart",
                    title : "二级圈子类型分布",
                    query_api : "/socialAnalysis/topicsFive"
                },
                {
                    type : "table",
                    title : "热门话题排行TOP100",
                    query_api : "/socialAnalysis/topicsSix"
                }
            ]
        }
    },
    topicsDetail(){
        return {
            name : "单条话题数据",
            path : "/socialAnalysis/topicsDetail",
            display : true,
            id   : "00213",
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
            id : 74,
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