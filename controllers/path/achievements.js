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
    outer() {
        return {
            name : "站外分享",
            path : "/share/outer",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "站内分享趋势",
                    query_api : "/share/outerOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/outerTwo"
                }
            ]
        }
    }
};