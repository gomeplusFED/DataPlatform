/**
 * @author yanglei
 * @date 2017-01-23
 * @fileoverview 美办数据
 */

module.exports = {
    index(){
        return {
            id : 301,
            name : "数据总览",
            path : "/office/index",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "整体数据",
                    query_api : "/office/indexOne"
                },{
                    type : "chart",
                    title: "整体数据趋势",
                    query_api : "/office/indexTwo"
                },{
                    type : "table",
                    title: "整体数据明细",
                    query_api : "/office/indexThree"
                },{
                    type : "chart",
                    title: "Top 版本",
                    query_api : "/office/indexFour"
                }
            ]
        }
    },
    version(){
        return {
            id : 302,
            name : "版本分析",
            path : "/office/version",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "Top10版本趋势",
                    query_api : "/office/versionOne"
                },{
                    type : "table",
                    title: "版本统计",
                    query_api : "/office/versionTwo"
                }
            ]
        }
    },
    terminal(){
        return {
            id : 303,
            name : "终端属性",
            path : "/office/terminal",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "Top10",
                    query_api : "/office/terminalOne"
                },{
                    type : "table",
                    title: "数据明细",
                    query_api : "/office/terminalTwo"
                }
            ]
        }
    },
    terminalOther(){
        return {
            id : 304,
            name : "终端属性",
            path : "/office/terminalOther",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "Top10",
                    query_api : "/office/terminalOtherOne"
                },{
                    type : "table",
                    title: "数据明细",
                    query_api : "/office/terminalOtherTwo"
                }
            ]
        }
    },
    date(){
        return {
            id : 305,
            name : "时段分析",
            path : "/office/date",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    query_api : "/office/dateZero"
                // },{
                //     type : "chart",
                //     title: "时段详情(在线人数)",
                //     query_api : "/office/dateOne"
                // },{
                //     type : "table",
                //     title: "详情(在线人数)",
                //     query_api : "/office/dateTwo"
                }
            ]
        }
    },
};