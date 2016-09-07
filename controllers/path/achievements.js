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
                },
                {
                    type : "table",
                    title : "店铺交易排行TOP 50",
                    query_api : "/achievements/shopFour"
                }
            ]
        }
    },
    product() {
        return {
            name : "商品运营分析",
            path : "/achievements/product",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    query_api : "/achievements/productZero"
                },
                {
                    type : "table",
                    title : "商品总览",
                    query_api : "/achievements/productOne"
                },
                {
                    type : "table",
                    title : "商品管理总览",
                    query_api : "/achievements/productTwo"
                },
                {
                    type : "chart",
                    title : "商品价格区间分布－总商品数（万）",
                    query_api : "/achievements/productThree"
                },
                {
                    type : "chart",
                    title : "商品价格区间分布－新增商品数",
                    query_api : "/achievements/productFour"
                },
                {
                    type : "chart",
                    title : "商品运营趋势",
                    query_api : "/achievements/productFive"
                },
                {
                    type : "table",
                    title : "商品运营明细",
                    query_api : "/achievements/productSix"
                }
            ]
        }
    },
    productSale() {
        return {
            name : "商品销售分析",
            path : "/achievements/productSale",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "商品销售总览",
                    // query_api : "/achievements/productOne"
                },{
                    type : "table",
                    title : "商品销售趋势",
                    // query_api : "/achievements/productOne"
                },{
                    type : "table",
                    title : "商品销售明细",
                    // query_api : "/achievements/productOne"
                },{
                    type : "table",
                    title : "商品排行TOP100",
                    // query_api : "/achievements/productOne"
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