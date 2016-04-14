/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */

module.exports = {
    retained() {
        return {
            name: "留存分析",
            path: "/retainedAnalysis",
            display: true,
            defaultData: [{
                type: "table",
                title: "留存用户情况",
                query_api: "/retainedAnalysis/retainedOne"
            }]
        };
    }
};