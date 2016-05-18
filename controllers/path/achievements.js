/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 销售业绩
 */

module.exports = {
    shop() {
        return {
            name : "店铺分析",
            path : "/achievements/shop",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "店铺趋势分析",
                    query_api : "/achievements/shopOne"
                },
                {
                    type : "table",
                    title : "店铺趋势明细",
                    query_api : "/achievements/shopTwo"
                },
                {
                    type : "table",
                    title : "店铺流量排行TOP 50",
                    query_api : "/achievements/shopThree"
                //},
                //{
                //    type : "table",
                //    title : "店铺交易排行TOP 50",
                //    query_api : "/achievements/shopFour"
                }
            ]
        }
    },
    product() {
        return {
            name : "商品分析",
            path : "/achievements/product",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "商品信息总览",
                    query_api : "/achievements/productOne"
                },
                {
                    type : "chart",
                    title : "商品销售趋势",
                    query_api : "/achievements/productTwo"
                },
                {
                    type : "table",
                    title : "商品销售明细",
                    query_api : "/achievements/productThree"
                },
                {
                    type : "table",
                    title : "商品流量排行TOP100",
                    query_api : "/achievements/productFour"
                },
                {
                    type : "table",
                    title : "商品销售排行TOP100",
                    query_api : "/achievements/productFive"
                }
            ]
        }
    },
    trade() {
        return {
            name : "交易分析",
            path : "/achievements/trade",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "交易总览",
                    query_api : "/achievements/tradeOne"
                },
                {
                    type : "chart",
                    title : "交易趋势",
                    query_api : "/achievements/tradeTwo"
                },
                {
                    type : "table",
                    title : "交易明细",
                    query_api : "/achievements/tradeThree"
                },
                {
                    type : "table",
                    title : "交易类目构成",
                    query_api : "/achievements/tradeFour"
                },
                {
                    type : "table",
                    title : "交易用户构成",
                    query_api : "/achievements/tradeFive"
                }
            ]
        }
    }

};