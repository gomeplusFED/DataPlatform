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
            name : "数据报表",
            path : "/socialAnalysis/dataTableDay",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "总体数据情况",
                    query_api : "/socialAnalysis/dataTableDayOne"
                },
                {
                    type : "table",
                    title : "新增数据情况",
                    query_api : "/socialAnalysis/dataTableDayTwo"
                }
            ]
        };
    },
    data_table_week() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableWeek",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "总体数据情况",
                    query_api : "/socialAnalysis/dataTableWeekOne"
                }
            ]
        };
    },
    data_table_month() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableMonth",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "总体数据情况",
                    query_api : "/socialAnalysis/dataTableMonthOne"
                }
            ]
        };
    },
    data_table_day_order() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableDayOrder",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "订单数据",
                    query_api : "/socialAnalysis/dataTableDayOrderOne"
                }
            ]
        };
    },
    data_table_week_order() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableWeekOrder",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "订单数据",
                    query_api : "/socialAnalysis/dataTableWeekOrderOne"
                }
            ]
        };
    },
    data_table_month_order() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableMonthOrder",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "订单数据",
                    query_api : "/socialAnalysis/dataTableMonthOrderOne"
                }
            ]
        };
    },
    data_table_day_user() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableDayUser",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "用户数据",
                    query_api : "/socialAnalysis/dataTableDayUserOne"
                }
            ]
        };
    },
    data_table_week_user() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableWeekUser",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "用户数据",
                    query_api : "/socialAnalysis/dataTableWeekUserOne"
                }
            ]
        };
    },
    data_table_month_user() {
        return {
            name : "数据报表",
            path : "/socialAnalysis/dataTableMonthUser",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "用户数据",
                    query_api : "/socialAnalysis/dataTableMonthUserOne"
                }
            ]
        };
    }
};