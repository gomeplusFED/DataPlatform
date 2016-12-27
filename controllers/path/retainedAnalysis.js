/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */

module.exports = {
    retained() {
        return {
            id : 67,
            name: "留存分析",
            path: "/retainedAnalysis/retained",
            display: true,
            defaultData: [{
                type : "chart",
                query_api : "/retainedAnalysis/retainedZero"
            },{
                type: "chart",
                title: "留存用户情况",
                query_api: "/retainedAnalysis/retainedOne"
            }, {
                type: "table",
                title: "留存用户情况",
                query_api: "/retainedAnalysis/retainedTwo"
            }]
        };
    }
};