/**
 * @author yanglei
 * @date 20160330
 * @fileoverview 用户分析
 */

module.exports = {
    newUsers() {
        return {
            router : "/userAnalysis/newUsers",
            pageTitle : "用户分析",
            defaultData : [{
                type : "chart",
                title : "新增用户趋势",
                query_api : "/userAnalysis/newUsers"
            }, {
                type : "table",
                title : "新增用户明细",
                query_api : "/userAnalysis/newUsers"
            }]
        }
    }
};