/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用分析
 */

module.exports = {
    useTime() {
        return {
            path : "/useAnalysis/useTime",
            name : "使用时长",
            display : true,
            defaultData : [{
                type : "chart",
                title : "单次使用时长分布",
                query_api : "/useAnalysis/useTimeOne"
            //},{
            //    type : "table",
            //    title : "单次使用时长分布明细",
            //    query_api : "/useAnalysis/useTimeTwe"
            //},{
            //    type : "chart",
            //    title : "日使用时长分布",
            //    query_api : "/useAnalysis/useTimeThree"
            //},{
            //    type : "table",
            //    title : "日使用时长分布明细",
            //    query_api : "/useAnalysis/useTimeFour"
            }]
        };
    }
};