var str = `
models.NewAccount = db.define("ads2_user_analysis_users", obj.NewAccount);
            models.UserAnalysisVersion = db.define("ads2_user_analysis_version", obj.UserAnalysisVersion);
            models.Configure = db.define("tbl_rt_configure", obj.Configure);
            models.UsersAccess = db.define("ads2_user_access", obj.UsersAccess);
            models.UserCompose = db.define("ads2_use_time", obj.UserCompose);
            models.MarketingFlow = db.define("tbl_rt_marketing_flow", obj.MarketingFlow);
            models.MarketingCoupon = db.define("tbl_rt_marketing_coupon", obj.MarketingCoupon);
            models.MarketingCouponDetails = db.define("tbl_rt_marketing_coupon_details", obj.MarketingCouponDetails);
            models.OverviewPage = db.define("ads2_overview_page", obj.OverviewPage);
            models.OverviewPlatf = db.define("ads2_overview_platf", obj.OverviewPlatf);
            models.KpiValue = db.define("tbl_rt_kpi_value", obj.KpiValue);
            //返利
            models.Rebate = db.define("ads2_rebate_order_overview", obj.Rebate);
            models.RebateOrderMuiltipleOverview = db.define("ads2_rebate_order_muiltiple_overview", obj.RebateOrderMuiltipleOverview);
            models.RebateOrderMuiltipleTrend = db.define("ads2_rebate_order_muiltiple_trend", obj.RebateOrderMuiltipleTrend);
            models.RebatetSheduleDetails = db.define("ads2_rebate_order_plan_info", obj.RebatetSheduleDetails);
            models.RebateOrderTredencyDetails = db.define("ads2_rebate_order_trend", obj.RebateOrderTredencyDetails);
            models.RebateTypeLevelDetails = db.define("ads2_rebate_order_level_sum", obj.RebateTypeLevelDetails);
            models.RebateOrderPlantypeLevelSum = db.define("ads2_rebate_order_plantype_level_sum", obj.RebateOrderPlantypeLevelSum);
            models.RebateInviteOverview = db.define("ads2_rebate_invite_overview", obj.RebateInviteOverview);
            models.RebateInvitePlanInfo = db.define("ads2_rebate_invite_plan_info", obj.RebateInvitePlanInfo);
            models.RebateInviteTrend = db.define("ads2_rebate_invite_trend", obj.RebateInviteTrend);
            models.RebateOrderPlantypeRebatetypeCategorySum = db.define("ads2_rebate_order_plantype_rebatetype_category_sum", obj.RebateOrderPlantypeRebatetypeCategorySum);
            models.RebateOrderTypeSum = db.define("ads2_rebate_order_type_sum", obj.RebateOrderTypeSum);

            models.ConfCategories = db.define("ecp_back_categories", obj.ConfCategories);
            models.UrlAccessWap = db.define("ads2_url_access_wap", obj.UrlAccessWap);
            models.KeyValue = db.define("ads2_terminal_key_value", obj.KeyValue);
            //models.KeyValue = db.define("tbl_rt_key_value", obj.KeyValue);
            models.Count = db.define("tbl_dataplatform_count", obj.Count);
            models.User2 = db.define("tbl_dataplatform_nodejs_users2", obj.User2);
            models.Role = db.define("tbl_dataplatform_nodejs_role", obj.Role);
            models.Log = db.define("tbl_dataplatform_nodejs_log", obj.Log);
            models.SocialCategory = db.define("tbl_social_category", obj.SocialCategory);
            models.ShopPayTop = db.define("tbl_rt_shop_pay_top", obj.ShopPayTop);
            models.ShopAccesTop = db.define("tbl_rt_shop_acces_top", obj.ShopAccesTop);
            //models.TradeCaty = db.define("ads2_deal_caty", obj.TradeCaty);
            models.DealCaty = db.define("ads2_deal_caty", obj.DealCaty);
            models.TradeUser = db.define("ads2_deal_user", obj.TradeUser);
            models.SalesPerfProductKv = db.define("tbl_rt_sales_perf_product_kv", obj.SalesPerfProductKv);
            models.SalesPerfShopKv = db.define("tbl_rt_sales_perf_shop_kv", obj.SalesPerfShopKv);
            models.SalesPerfTranKv = db.define("ads2_sales_perf_tran_kv", obj.SalesPerfTranKv);
            models.SalesProductMarketTop = db.define("tbl_rt_sales_product_market_top", obj.SalesProductMarketTop);
            models.SalesProductFlowtTop = db.define("tbl_rt_sales_product_flow_top", obj.SalesProductFlowtTop);
            models.UserKeepResult = db.define("ads2_user_analysis_keep", obj.UserKeepResult);
            models.ChannelAnalysis = db.define("tbl_rt_channel_analysis", obj.ChannelAnalysis);
            models.ChannelUserKeep = db.define("tbl_rt_channel_user_keep", obj.ChannelUserKeep);
            models.ChannelUserActive = db.define("tbl_rt_channel_user_active", obj.ChannelUserActive);
            models.ChannelIdNameChart = db.define("tbl_rt_channel_id_name_chart", obj.ChannelIdNameChart);
            models.ShareAnalyzeOverview = db.define("ads2_share_analyze_overview", obj.ShareAnalyzeOverview);
            models.ShareAnalyzeTrend = db.define("ads2_share_analyze_trend", obj.ShareAnalyzeTrend);
            models.ShareAnalyzeChannel = db.define("ads2_share_analyze_channel", obj.ShareAnalyzeChannel);
            models.ShareAnalyzeChannelTrend = db.define("ads2_share_analyze_channel_trend", obj.ShareAnalyzeChannelTrend);
            models.UrlToName = db.define("tbl_rt_url_to_name", obj.UrlToName);
            models.CouponGroupPriceInterrgional = db.define("ads2_coupon_group_price_interrgional", obj.CouponGroupPriceInterrgional);
            models.CouponGroupShopTop = db.define("ads2_coupon_group_shop_top", obj.CouponGroupShopTop);
            models.CouponInfo = db.define("ads2_coupon_info", obj.CouponInfo);
            models.CouponGroupDate = db.define("ads2_coupon_group_date", obj.CouponGroupDate);
            models.GroupownerStatistics = db.define("ads2_soc_groupowner_statistics", obj.GroupownerStatistics);
            models.GroupownerCategoryDistribution = db.define("ads2_soc_groupowner_category_distribution", obj.GroupownerCategoryDistribution);
            models.GroupownerList = db.define("ads2_soc_groupowner_list", obj.GroupownerList);
            models.GroupReport = db.define("ads2_soc_group_report", obj.GroupReport);
            models.Statistics = db.define("tbl_soc_statistics", obj.Statistics);
            //8.15
            models.GroupStatistics = db.define("ads2_soc_group_statistics" , obj.GroupStatistics);
            models.GroupCategoryDistribution = db.define("ads2_soc_group_category_distribution" , obj.GroupCategoryDistribution);
            models.SocialGroupList = db.define("ads2_soc_group_list" , obj.SocialGroupList);
            models.SocialGroupDetailStatistic = db.define("ads2_soc_group_detail_statistic" , obj.SocialGroupDetailStatistic);
            models.SocialGroupDetailList = db.define("ads2_soc_group_detail_list" , obj.SocialGroupDetailList);
            models.SocialTopicStatistics = db.define("ads2_soc_topic_statistics" , obj.SocialTopicStatistics);
            models.SocialTopicCategoryDistribution = db.define("ads2_soc_topic_category_distribution" , obj.SocialTopicCategoryDistribution);
            models.SocialTopicList = db.define("ads2_soc_topic_list" , obj.SocialTopicList);
            models.SocialTopicDetailStatistics = db.define("ads2_soc_topic_detail_statistics" , obj.SocialTopicDetailStatistics);
            models.Activity = db.define("activity" , obj.Activity);
            models.ActivityChannelRelationship = db.define("activity_channel_relationship" , obj.ActivityChannelRelationship);
            models.Channel = db.define("channel" , obj.Channel);

            models.VideoPlay = db.define("ads2_video_playing" , obj.VideoPlay);

            //8.30商品分析部分
            models.ItemManager = db.define("ads2_itm_manager" , obj.ItemManager);
            models.ItemOverview = db.define("ads2_itm_overview" , obj.ItemOverview);
            models.ItemPie = db.define("ads2_itm_pie" , obj.ItemPie);
            models.ItemRunSales = db.define("ads2_itm_run_sales" , obj.ItemRunSales);
            models.ItemRunTop = db.define("ads2_itm_run_top" , obj.ItemRunTop);
            //营销
            models.CamOverview = db.define("ads2_cam_overview" , obj.CamOverview);
            models.CamCamlistActive = db.define("ads2_cam_camlist_active" , obj.CamCamlistActive);
            models.CamCamlistChannel = db.define("ads2_cam_camlist_channel" , obj.CamCamlistChannel);
            //商家返利
            models.RebateShopOverview = db.define("tbl_rt_rebate_shop_overview" , obj.RebateShopOverview);
            models.RebateShopRefund = db.define("tbl_rt_rebate_shop_refund" , obj.RebateShopRefund);
            models.RebateShopOrderTredencyDetails = db.define("tbl_rt_rebate_shop_order_tredency_details" , obj.RebateShopOrderTredencyDetails);
            models.RebateShopTypeLevelDetails = db.define("tbl_rt_rebate_shop_type_level_details" , obj.RebateShopTypeLevelDetails);
            models.RebateShopTop = db.define("tbl_rt_rebate_shop_top" , obj.RebateShopTop);
            models.RebateShopPlanTop = db.define("tbl_rt_rebate_shop_plan_top" , obj.RebateShopPlanTop);
`;


module.exports = str;


