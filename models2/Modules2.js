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
    }
};