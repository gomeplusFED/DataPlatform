/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */

module.exports = {
    total() {
        return {
            id : "00002",
            path : "/rebate/total",
            name : "返利汇总",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "返利总览",
                    query_api : "/rebate/totalZero"
                },
                {
                    type : "table",
                    title : "返利总览",
                    query_api : "/rebate/totalOne"
                },
                {
                    type : "chart",
                    title : "返利订单趋势",
                    query_api : "/rebate/totalTwo"
                },
                // {
                //     type : "chart",
                //     title : "返利订单趋势",
                //     query_api : "/rebate/totalThree"
                // },
                {
                    type : "table",
                    title : "返利功能详情",
                    query_api : "/rebate/totalFour"
                }
            ]
        }
    }
};