/**
 * @author Mr.He
 * @date 20161011
 * @fileoverview IM使用模块控制
 */

module.exports = {
    Index(){
        return {
            id : 54,
            name : "IM使用查看",
            path : "/IM/index",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "数据总览",
                    query_api : "/IM/indexOne"
                },{
                    type : "chart",
                    title: "数据趋势",
                    query_api : "/IM/indexTwo"
                },{
                    type : "table",
                    title: "每日明细",
                    query_api : "/IM/indexThree"
                },{
                    type : "table",
                    title: "自定义事件",
                    query_api : "/IM/indexFour"
                },{
                    type : "table",
                    title: "表情下载",
                    query_api : "/IM/indexFive"
                },{
                    type : "table",
                    title: "群活跃排行top50",
                    query_api : "/IM/indexSix"
                }
            ]
        }
    },
    Event(){
        return {
            name : "自定义事件",
            path : "/IM/event",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "数据趋势",
                    query_api : "/IM/eventOne"
                },
                {
                    type : "table",
                    title: "数据详情",
                    query_api : "/IM/eventTwo"
                }
            ]
        }
    },
    FaceDownload(){
        return {
            name : "表情下载",
            path : "/IM/face",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "数据趋势",
                    query_api : "/IM/faceOne"
                },
                {
                    type : "table",
                    title: "数据详情",
                    query_api : "/IM/faceTwo"
                }
            ]
        }
    }
}