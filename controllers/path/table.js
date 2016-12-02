/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 报表导出
 */

module.exports = {
    table() {
        return {
            name : "社交报表",
            path : "/socialAnalysis/table",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "我的报表",
                    query_api : "/socialAnalysis/tableOne"
                }
            ]
        };
    },
    rebate_total() {
        return {
            name : "返利报表",
            path : "/socialAnalysis/rebate",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "总体返利情况",
                    query_api : "/socialAnalysis/rebateOne"
                }
            ]
        };
    },
    rebate_total_new() {
        return {
            name : "返利报表",
            path : "/socialAnalysis/rebateNew",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "新增返利",
                    query_api : "/socialAnalysis/rebateNewOne"
                }
            ]
        };
    },
    data_table_day() {
        return {
            name : "返利报表",
            path : "/socialAnalysis/dataTableDay",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "总体数据情况",
                    query_api : "/socialAnalysis/dataTableDayOne"
                }
            ]
        };
    }
};