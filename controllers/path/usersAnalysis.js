/**
 * @author yanglei
 * @date 20160330
 * @fileoverview 用户分析
 */

module.exports = {
    newUsers() {
        return {
            path : "/userAnalysis/newUsers",
            name : "新增用户",
            display : true,
            defaultData : [{
                type : "chart",
                title : "新增用户趋势",
                query_api : "/userAnalysis/newUsersOne"
            }, {
                type : "table",
                title : "新增用户明细",
                query_api : "/userAnalysis/newUsersTwe"
            }]
        }
    }
};