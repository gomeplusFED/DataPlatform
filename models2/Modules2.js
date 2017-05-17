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
    },

    //返利部分 ----------------
    ads2_new_rebate_invite_overview : {
        modelName : "ads2_new_rebate_invite_overview"
    },
    ads2_new_rebate_invite_plan_info : {
        modelName : "ads2_new_rebate_invite_plan_info"
    },

    ads2_new_rebate_invite_trend : {
        modelName : "ads2_new_rebate_invite_trend"
    },
    ads2_new_rebate_order_level_sum : {
        modelName : "ads2_new_rebate_order_level_sum"
    },
    ads2_new_rebate_order_muiltiple_trend : {
        modelName : "ads2_new_rebate_order_muiltiple_trend"
    },
    ads2_new_rebate_order_overview : {
        modelName : "ads2_new_rebate_order_overview"
    },
    ads2_new_rebate_order_plan_info : {
        modelName : "ads2_new_rebate_order_plan_info"
    },
    ads2_new_rebate_order_plantype_level_sum : {
        modelName : "ads2_new_rebate_order_plantype_level_sum"
    },

    ads2_new_rebate_order_shop_info : {
        modelName : "ads2_new_rebate_order_shop_info"
    },
    ads2_new_rebate_order_trend : {
        modelName : "ads2_new_rebate_order_trend"
    },
    //返利   END --------------
    
    //o2o店铺
    ads2_o2m_shop_trade_info : {
        modelName : "ads2_o2m_shop_trade_info"
    },

    //社交三期
    ads2_soc_total_summary : {
        modelName : "ads2_soc_total_summary"
    },
    ads2_soc_topic_ordered : {
        modelName : "ads2_soc_topic_ordered"
    },
    ads2_soc_topic_item : {
        modelName : "ads2_soc_topic_item"
    },
    ads2_soc_group : {
        modelName : "ads2_soc_group"
    },
    ads2_soc_group_topic : {
        modelName : "ads2_soc_group_topic"
    },
    tbl_rt_group : {
        modelName : "tbl_rt_group"
    },
    //视频
    ads2_videoplay_overview2 : {
        modelName : "ads2_videoplay_overview2"
    },
    ads2_livevideo_overview2 : {
        modelName : "ads2_livevideo_overview2"
    },

    //IM 
    ads2_im_bring_transaction : {
        modelName : "ads2_im_bring_transaction"
    },
    ads2_im_customerservice_msg : {
        modelName : "ads2_im_customerservice_msg"
    },
    //分享数据统计
    ads_share_data_analysis_info : {
        modelName : "ads_share_data_analysis_info"
    },
    //分享数据统计top100
    ads_share_share_type_top : {
        modelName : "ads_share_share_type_top"
    },
    //分享数据统计小时
    ads_share_source_type_hour : {
        modelName : "ads_share_source_type_hour"
    },
    //分享数据渠道
    ads_share_dim_channel : {
        modelName : "ads_share_dim_channel"
    },
    //分享数据分享页面
    ads_share_dim_page : {
        modelName : "ads_share_dim_page"
    },
    //分享数据平台
    ads_share_dim_platform : {
        modelName : "ads_share_dim_platform"
    },
    //分享数据类型
    ads_share_dim_type : {
        modelName : "ads_share_dim_type"
    },
};















