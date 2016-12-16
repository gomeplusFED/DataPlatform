/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 报表导出
 */

module.exports = {
    table() {
        return {
            id : 0,
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
        }
    }
};