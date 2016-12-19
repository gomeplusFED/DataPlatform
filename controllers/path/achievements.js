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
    shopOverview(){
        return {
            id : 0,
            name : "店铺总览",
            path : "/achievements/shopOverview",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "店铺总览",
                    query_api : "/achievements/shopOverviewOne"
                },
                {
                    type : "table",
                    title : "店铺申请运营",
                    query_api : "/achievements/shopOverviewTwo"
                },
                {
                    type : "chart",
                    title : "店铺运营趋势",
                    query_api : "/achievements/shopOverviewThree"
                },
                {
                    type : "chart",
                    title : "店铺评级分布",
                    query_api : "/achievements/shopOverviewFour"
                },
                {
                    type : "table",
                    title : "店铺TOP100",
                    query_api : "/achievements/shopOverviewFive"
                }
            ]
        }
    },
    shopRun(){
        return {
            id : 1,
            name : "店铺运营分析",
            path : "/achievements/shopRun",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "店铺总览",
                    query_api : "/achievements/shopRunOne"
                },
                {
                    type : "chart",
                    title : "店铺趋势分析",
                    query_api : "/achievements/shopRunTwo"
                },
                {
                    type : "table",
                    title : "店铺流量排行TOP50",
                    query_api : "/achievements/shopRunThree"
                },
                {
                    type : "table",
                    title : "店铺交易排行TOP50",
                    query_api : "/achievements/shopRunFour"
                }
            ]
        }
    },
    product() {
        return {
            id : 2,
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
                    title : "商品价格区间分布－总商品数(万)-新增商品数(万)",
                    query_api : "/achievements/productThree"
                },
                /*{
                    type : "chart",
                    title : "商品价格区间分布－新增商品数",
                    query_api : "/achievements/productFour"
                },*/
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
            id : 3,
            name : "商品销售分析",
            path : "/achievements/productSale",
            display : true,
            defaultData : [
                 {
                     type : "chart",
                     query_api : "/achievements/product22Zero"
                 },
                {
                    type : "table",
                    title : "商品销售总览",
                    query_api : "/achievements/productSaleOne"
                },
                {
                    type : "chart",
                    title : "商品销售趋势",
                    query_api : "/achievements/productSaleTwo"
                },
                {
                    type : "table",
                    title : "商品销售明细",
                    query_api : "/achievements/productSaleThree"
                },
                {
                    type : "table",
                    title : "商品排行TOP100",
                    query_api : "/achievements/productSaleFour"
                }
            ]
        }
    },
    trade() {
        return {
            id : 5,
            name : "交易分析",
            path : "/achievements/trade",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    query_api : "/achievements/tradeZero"
                },
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
                    type : "chart",
                    title : "交易用户分布",
                    query_api : "/achievements/tradeThree"
                },
                {
                    type : "table",
                    title : "交易类目构成",
                    query_api : "/achievements/tradeFour"
                }
            ]
        }
    },
    tradePanel(){
        return {
            id : 4,
            name : "交易面板",
            path : "/achievements/tradePanel",
            display : true,
            subPages : [{
                id : 0,
                url : "/achievements/trade",
                name : "交易分析"
            }, {
                id : 1,
                url : "/achievements/order",
                name : "订单分析"
            }, {
                id : 2,
                url : "/achievements/productSale",
                name : "商品分析"
            }, {
                id : 3,
                url : "/achievements/pay",
                name : "支付分析"
            }, {
                id : 4,
                url : "/coupon",
                name : "优惠劵分析"
            }],
            defaultData : [
                {
                    type : "chart",
                    query_api : "/achievements/tradePanelZero"
                },
                {
                    type : "table",
                    title : "交易汇总",
                    query_api : "/achievements/tradePanelOne"
                },
                {
                    type : "table",
                    title : "交易商品汇总",
                    query_api : "/achievements/tradePanelTwo"
                },
                {
                    type : "table",
                    title : "支付方式汇总",
                    query_api : "/achievements/tradePanelThree"
                },
                {
                    type : "table",
                    title : "国美币汇总",
                    query_api : "/achievements/tradePanelFour"
                },
                {
                    type : "table",
                    title : "交易优惠劵汇总",
                    query_api : "/achievements/tradePanelFive"
                },
                {
                    type : "table",
                    title : "转化率",
                    query_api : "/achievements/tradePanelSix"
                }
            ]
        }
    },
    vshop() {
        return {
            id : 6,
            name : "美店店铺商品",
            path : "/achievements/vshop",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "美店总览",
                    query_api : "/achievements/vshopOne"
                },
                {
                    type : "chart",
                    title : "数据趋势",
                    query_api : "/achievements/vshopTwo"
                },
                {
                    type : "table",
                    title : "每日明细",
                    query_api : "/achievements/vshopThree"
                },
                {
                    type : "table",
                    title : "商品来源分布",
                    query_api : "/achievements/vshopFour"
                },
                {
                    type : "table",
                    title : "流量top100",
                    query_api : "/achievements/vshopFive"
                }
            ]
        }
    },
    vtrade() {
        return {
            id : 7,
            name : "美店交易",
            path : "/achievements/vtrade",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "美店交易总览",
                    query_api : "/achievements/vtradeOne"
                },
                {
                    type : "chart",
                    title : "交易趋势",
                    query_api : "/achievements/vtradeTwo"
                },
                {
                    type : "table",
                    title : "交易明细",
                    query_api : "/achievements/vtradeThree"
                },
                {
                    type : "table",
                    title : "妥投与退货",
                    query_api : "/achievements/vtradeFour"
                },
                {
                    type : "table",
                    title : "交易top100",
                    query_api : "/achievements/vtradeFive"
                }
            ]
        }
    },

    //订单分析
    order(){
        return {
            id : 1,
            name : "订单分析",
            path : "/achievements/order",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    query_api : "/achievements/orderZero"
                },
                {
                    type : "chart",
                    title : "订单趋势",
                    query_api : "/achievements/orderOne"
                },
                {
                    type : "table",
                    title : "订单来源类型",
                    query_api : "/achievements/orderTwo"
                },
                {
                    type : "chart",
                    title : "订单评级分布",
                    query_api : "/achievements/orderThree"
                }
            ]
        }
    },

    //支付分析 
    pay(){
        return {
            id : 0,
            name : "支付分析",
            path : "/achievements/pay",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    query_api : "/achievements/payZero"
                },
                {
                    type : "chart",
                    title : "支付趋势",
                    query_api : "/achievements/payOne"
                },
                {
                    type : "chart",
                    title : "支付方式",
                    query_api : "/achievements/payTwo"
                },
                {
                    type : "chart",
                    title : "支付构成",
                    query_api : "/achievements/payThree"
                }
            ]
        }
    }
};