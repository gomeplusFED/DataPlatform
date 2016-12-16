/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */

module.exports = {
    all() {
        return {
            id : 0,
            name : "商家返利汇总",
            path : "/businessRebate",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "商家返利汇总",
                    query_api : "/businessRebate/businessAllSeven"
                },
                {
                    type : "table",
                    title : "商家设置返利总览",
                    query_api : "/businessRebate/businessAllOne"
                },
                {
                    type : "chart",
                    title : "返利订单趋势",
                    query_api : "/businessRebate/businessAllTwo"
                },
                {
                    type : "chart",
                    title : "返利层级分布",
                    query_api : "/businessRebate/businessAllThree"
                },
                {
                    type : "chart",
                    title : "返利类型分布",
                    query_api : "/businessRebate/businessAllFour"
                },
                {
                    type : "table",
                    title : "商家返利TOP50",
                    query_api : "/businessRebate/businessAllFive"
                },
                {
                    type : "table",
                    title : "商家返利计划TOP50",
                    query_api : "/businessRebate/businessAllSix"
                }
            ]
        }
    },
    plan() {
        return {
            id : 1,
            name : "商家返利计划",
            router : "/businessRebate/plan",
            path : "/businessRebate/plan",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "商家设置返利",
                    query_api : "/businessRebate/planOne"
                }
            ]
        }
    }
};