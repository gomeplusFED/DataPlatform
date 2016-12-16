/**
 *  author@Mr.He
 * content@Modules.js的补充文件，避免冲突
 *  time  @ 20161021
 *
 * 手动指定主键eg:
 * "tbl_rt_useranalysis_newuser": {
 *      "modelName": "NewAccount",
 *      "primary"  : "channal_id"
 *   }
 */

module.exports = {
    //销售业绩，美店店铺部分
    ads2_shop_overview : {
        modelName : "ShopOverview"
    },
    ads2_shop_overview_day : {
        modelName : "ShopOverviewDay"
    },
    ads2_shop_level : {
        modelName : "ShopLevel"
    },
    ads2_redis_shop_scores : {
        modelName : "RedisShopScores"
    },
    ads2_shop_run_overview : {
        modelName : "ShopRunOverview"
    },
    ads2_shop_run_analyze : {
        modelName : "ShopRunAnalyze"
    },
    ads2_shop_run_top_muil : {
        modelName : "ShopRunTopMuil"
    },
    ads2_shop_run_top_deal : {
        modelName : "ShopRunTopDeal"
    },

    //销售业绩，交易面板-交易汇总
    ads2_sales_perf_total2 : {
        modelName : "SalesPerfTotal2"
    },
    //交易面板-交易商品汇总
    ads2_sales_perf_pro_total2 : {
        modelName : "SalesPerfProTotal2"
    },
    //交易面板-支付方式汇总
    ads2_sales_perf_pay_mode_total2 : {
        modelName : "SalesPerfPayModeTotal2"
    },
    //交易面板-国美币汇总
    ads2_sales_perf_guomeibi_total2 : {
        modelName : "SalesPerfGuomeibiTotal2"
    },
    //交易面板-交易优惠券汇总
    ads2_sales_perf_couple_total2 : {
        modelName : "SalesPerfCoupleTotal2"
    },
    //交易面板-转化率
    ads2_sales_perf_conversion2 : {
        modelName : "SalesPerfConversion2"
    },



    //订单分析-订单趋势
    ads2_order_trend2 : {
        modelName : "OrderTrend2"
    },
    //订单分析-订单来源类型
    ads2_order_source2 : {
        modelName : "OrderSource2"
    },
    //订单分析-订单评级分布
    ads2_order_comments2 : {
        modelName : "OrderComments2"
    },
    //支付分析-支付趋势
    ads2_pay_trend2 : {
        modelName : "PayTrend2"
    },
    //支付分析-支付方式
    ads2_pay_way2 : {
        modelName : "PayWay2"
    },
    //支付分析-支付构成
    ads2_order_constitute2 : {
        modelName : "OrderConstitue2"
    },



    
    //交易分析-交易总览、交易趋势
    ads2_sales_overview2 : {
        modelName : "SalesOverview2"
    },
    //交易分析-交易用户分布
    ads2_sales_user_distribute2 : {
        modelName : "SalesUserDistribute2"
    },
    //交易分析-交易类目构成
    ads2_sales_category_constitute2 : {
        modelName : "SalesCategoryConstitute2"
    },


    //性能分析
    ads2_performance_analysis : {
        modelName : "PerformanceAnalysis"
    }


};















