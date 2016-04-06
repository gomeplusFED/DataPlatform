/**
 * @author yanglei
 * @date 20160405
 * @fileoverview 商家返利汇总
 */

module.exports = {
    all() {
        return {
            name : "商家返利汇总",
            path : "/businessRebate",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "商家设置返利总览",
                    query_api : "/businessRebate/businessAllOne"
                },
                {
                    type : "chart",
                    title : "返利订单趋势",
                    query_api : "/businessRebate/businessAllTwo"
                }
            ]
        }
    }
};