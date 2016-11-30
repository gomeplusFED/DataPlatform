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
            name : "社交报表",
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
    }
};