/**
 * @author yanglei
 * @date 20160104
 * @fileoverview 销售业绩/交易分析/数据概览
 */
var achievements = require('../libs/achievements');
    _ = require('lodash'),
    utils = require('../libs/utils'),
    achievementsFilter = require('../filters/achievements'),
    filter = require('../filters/dataOverview'),
    retained = require("../libs/pathConfig/retained"),
    config = require('../config.json'),
    inter = require("../libs/interface/index"),
    dataOverview = require("../libs/interface/dataOverview"),
    usersAccess = require("../filters/usersAccess"),
    achie = require("../libs/pathConfig/achievements"),
    api = require("../libs/api"),
    dataView = require("../libs/dataOverview"),
    marketing_analysis = require("../libs/pathConfig/marketing");

module.exports = function(Router) {
    Router = new achievements(Router, achie.transaction("/achievements/commodityTotalSKU", 2));

    Router = new achievements(Router, achie.transaction("/achievements/commodityTotal", 1));

    Router = new achievements(Router, {
        router: '/achievements/transactionCategoryTwo',
        view: 'analysis/table',
        links : config.achievements_orderPrice,
        pageTitle: '交易分析',
        tableTitle: '交易类目构成-二级类目',
        modelName: ['SalesCategory'],
        defaultOption : {
            day_type: 1,
            category_type : 2
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.category(data);
        },
        cols : [{
            caption: '类目名称',
            type: 'string'
        }, {
            caption: '浏览量',
            type: 'number'
        }, {
            caption: '访客数',
            type: 'number'
        }, {
            caption: '销售数量',
            type: 'number'
        }, {
            caption: '销售数量占比',
            type: 'string'
        }, {
            caption: '销售金额',
            type: 'number'
        }, {
            caption: '销售占比',
            type: 'string'
        }],
        rows : [ 'category_name', 'access_num', 'access_users', 'commodity_num', 'commodity_rate', 'pay_price', 'pay_rate' ]
    });

    Router = new achievements(Router, {
        router: '/achievements/transactionCategoryThree',
        view: 'analysis/table',
        links : config.achievements_orderPrice,
        pageTitle: '交易分析',
        tableTitle: '交易类目构成-三级类目',
        modelName: ['SalesCategory'],
        defaultOption : {
            day_type: 1,
            category_type : 3
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.category(data);
        },
        cols : [{
            caption: '类目名称',
            type: 'string'
        }, {
            caption: '浏览量',
            type: 'number'
        }, {
            caption: '访客数',
            type: 'number'
        }, {
            caption: '销售数量',
            type: 'number'
        }, {
            caption: '销售数量占比',
            type: 'string'
        }, {
            caption: '销售金额',
            type: 'number'
        }, {
            caption: '销售占比',
            type: 'string'
        }],
        rows : [ 'category_name', 'access_num', 'access_users', 'commodity_num', 'commodity_rate', 'pay_price', 'pay_rate' ]
    });

    Router = new achievements(Router, {
        router: '/achievements/transactionCategoryFour',
        view: 'analysis/table',
        links : config.achievements_orderPrice,
        pageTitle: '交易分析',
        tableTitle: '交易类目构成-四级类目',
        modelName: ['SalesCategory'],
        defaultOption : {
            day_type: 1,
            category_type : 4
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.category(data);
        },
        cols : [{
            caption: '类目名称',
            type: 'string'
        }, {
            caption: '浏览量',
            type: 'number'
        }, {
            caption: '访客数',
            type: 'number'
        }, {
            caption: '销售数量',
            type: 'number'
        }, {
            caption: '销售数量占比',
            type: 'string'
        }, {
            caption: '销售金额',
            type: 'number'
        }, {
            caption: '销售占比',
            type: 'string'
        }],
        rows : [ 'category_name', 'access_num', 'access_users', 'commodity_num', 'commodity_rate', 'pay_price', 'pay_rate' ]
    });

    Router = new achievements(Router, {
        router: '/achievements/transactionArea',
        view: 'analysis/table',
        links : config.achievements_orderPrice,
        pageTitle: '交易分析',
        tableTitle: '交易用户构成',
        modelName: ['SalesArea'],
        defaultOption : {
            day_type: 1
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            var price_total = 0;
            var commodity_total = 0;
            var newdata = [];
            data.forEach(function(key) {
                if(key.country === 'cn') {
                    price_total = price_total + key.order_price;
                    commodity_total = commodity_total + key.order_commodity;
                    newdata.push(key);
                }
            });
            newdata.forEach(function(key) {
                key.area = utils.decode(key.province, '').province;
                key.order_price_rate =
                    (key.order_price / (price_total === 0 ? 1 : price_total) * 100).toFixed(2) + '%';
                key.order_commodity_rate =
                    (key.order_commodity / (commodity_total === 0 ? 1 : commodity_total) * 100).toFixed(2) + '%';
                key.customer_price =
                    (key.order_price / (key.order_users === 0 ? 1 : key.order_users)).toFixed(2);
            });
            newdata.sort(function(a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            return newdata;
        },
        cols : [{
            caption: '地区',
            type: 'string'
        }, {
            caption: '成交金额',
            type: 'number'
        }, {
            caption: '成交金额占比',
            type: 'string'
        }, {
            caption: '成交商品数',
            type: 'number'
        }, {
            caption: '成交商品数占比',
            type: 'string'
        }, {
            caption: '客单价',
            type: 'number'
        }],
        rows : [ 'area', 'order_price', 'order_price_rate', 'order_commodity', 'order_commodity_rate', 'customer_price' ]
    });

    Router = new achievements(Router, {
        router: '/achievements/shopTop',
        view: 'analysis/table',
        links : config.achievements_shop,
        pageTitle: '店铺分析',
        tableTitle: '店铺排行TOP50-流量',
        modelName: ['ShopTop'],
        defaultOption : {
            day_type: 1,
            sku_type : 0
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.shopTop(data, 'access_num');
        },
        cols : [{
            caption: '排名',
            type: 'number'
        }, {
            caption: '店铺名称',
            type: 'string'
        }, {
            caption: '浏览量',
            type: 'number'
        }, {
            caption: '浏览量占比',
            type: 'string'
        }, {
            caption: '访客数',
            type: 'number'
        }, {
            caption: '访客数占比',
            type: 'string'
        }, {
            caption: '被分享次数',
            type: 'number'
        }, {
            caption: '支付金额',
            type: 'number'
        }, {
            caption: '支付金额占比',
            type: 'string'
        }, {
            caption: '支付商品数',
            type: 'number'
        }, {
            caption: '支付商品数占比',
            type: 'string'
        }, {
            caption: '被分享商品数',
            type: 'number'
        }],
        rows : [ 'top', 'shop_name', 'access_num', 'access_num_rate', 'access_users',
            'access_users_rate', 'share_num', 'pay_price', 'pay_price_rate', 'pay_commodity_num',
            'pay_commodity_rate', 'share_commodity_num']
    });

    Router = new achievements(Router, achie.shopSalesTop("/achievements/shopSalesTop", 1));

    Router = new achievements(Router, achie.shopSalesTop("/achievements/shopSalesTopSKU", 2));

    Router = new achievements(Router, achie.commodityTotal('/achievements/commodityTotal'));

    Router = new achievements(Router, {
        router: '/achievements/commodityTop',
        view: 'analysis/table',
        links : config.achievements_commodity,
        pageTitle: '商品分析',
        tableTitle: '商品排行TOP100-流量',
        modelName: ['CommodityTop'],
        defaultOption : {
            day_type: 1
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.commodityTop(data, 'access_num');
        },
        cols : [
            {
            caption: '排名',
            type: 'number'
        }, {
            caption: '商品名称',
            type: 'string'
        }, {
            caption: '浏览量',
            type: 'number'
        }, {
            caption: '浏览量占比',
            type: 'string'
        }, {
            caption: '访客数',
            type: 'number'
        }, {
            caption: '访客数占比',
            type: 'string'
        }, {
            caption: '被分享次数',
            type: 'number'
        }, {
            caption: '下单人数',
            type: 'number'
        }, {
            caption: '成交金额',
            type: 'number'
        }, {
            caption: '成交金额占比',
            type: 'string'
        }, {
            caption: '退货数',
            type: 'number'
        }, {
            caption: '退货金额',
            type: 'number'
        }],
        rows : [ 'top', 'commodity_name', 'access_num', 'access_num_rate', 'access_users',
            'access_users_rate', 'share_num', 'order_users', 'order_price', 'order_price_rate',
            'refund_num', 'refund_price']
    });

    Router = new achievements(Router, {
        router: '/achievements/commodityPriceTop',
        view: 'analysis/table',
        links : config.achievements_commodity,
        pageTitle: '商品分析',
        tableTitle: '商品排行TOP100-销售',
        modelName: ['CommodityTop'],
        defaultOption : {
            day_type: 1
        },
        isSetEndTimeEleDisabled : true,
        filter : function(data) {
            return achievementsFilter.commodityTop(data, 'order_price');
        },
        cols : [
            {
                caption: '排名',
                type: 'number'
            }, {
                caption: '商品名称',
                type: 'string'
            }, {
                caption: '浏览量',
                type: 'number'
            }, {
                caption: '浏览量占比',
                type: 'string'
            }, {
                caption: '访客数',
                type: 'number'
            }, {
                caption: '访客数占比',
                type: 'string'
            }, {
                caption: '被分享次数',
                type: 'number'
            }, {
                caption: '下单人数',
                type: 'number'
            }, {
                caption: '成交金额',
                type: 'number'
            }, {
                caption: '成交金额占比',
                type: 'string'
            }, {
                caption: '退货数',
                type: 'number'
            }, {
                caption: '退货金额',
                type: 'number'
            }],
        rows : [ 'top', 'commodity_name', 'access_num', 'access_num_rate', 'access_users',
            'access_users_rate', 'share_num', 'order_users', 'order_price', 'order_price_rate',
            'refund_num', 'refund_price']
    });

    Router = new achievements(Router, marketing_analysis.overview());

    Router = new achievements(Router, retained());

    Router = new dataView(Router, {
        router: '/dataTrends',
        modelName: ['OverviewPlatf', 'KpiValue'],
        filter: function(data, users, rows) {
            return filter.tableData(data, users, rows);
        },
        links : config.dataOverview,
        rows : ['name', 'start_up', 'open_user_total', 'open_user_avg', 'new_user',
            'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg', 'users'],
        cols : [{
            caption: ' ',
            type: 'string'
        }, {
            caption: '启动次数',
            type: 'number'
        },  {
            caption: '启动用户',
            type: 'number'
        },  {
            caption: '人均启动次数',
            type: 'string'
        }, {
            caption: '新用户',
            type: 'number'
        }, {
            caption: '新用户占比',
            type: 'string'
        }, {
            caption: '新增账户',
            type: 'number'
        }, {
            caption: '注册转化率',
            type: 'string'
        }, {
            caption: '每人使用时长',
            type: 'string'
        }, {
            caption: '每次使用时长',
            type: 'string'
        }, {
            caption: '累计注册账户',
            type: 'number'
        }]
    });

    Router = new dataView(Router, {
        router: '/dataTrends/wap',
        modelName: ['OverviewPlatf', 'KpiValue'],
        filter: function(data, users, rows) {
            return filter.tableData(data, users, rows);
        },
        links : config.dataOverview,
        rows : ['name', 'uv', 'pv', 'ip_count', 'jump_loss_rate',
            'new_user', 'new_user_rate', 'new_account', 'register_rate', 'visit_time_avg', 'users'],
        cols : [{
            caption: ' ',
            type: 'string'
        }, {
            caption: '访客数',
            type: 'number'
        },  {
            caption: '浏览量',
            type: 'number'
        },  {
            caption: 'IP数',
            type: 'number'
        }, {
            caption: '跳出率',
            type: 'number'
        }, {
            caption: '新用户',
            type: 'number'
        }, {
            caption: '新用户占比',
            type: 'string'
        }, {
            caption: '新增账户',
            type: 'number'
        }, {
            caption: '注册转化率',
            type: 'string'
        }, {
            caption: '平均访问时长',
            type: 'string'
        }, {
            caption: '累计注册账户',
            type: 'number'
        }]
    });

    Router = new inter(Router, {
        modelName : "OverviewPage",
        router : "/OverviewPage/top",
        limitKey : "pv",
        limit : 10,
        filter(data){
            return filter.accessPage(data);
        },
        cols : [ "序号", "访问页面", "访问页面备注名称", "访问次数", "访问次数占比" ],
        rows : [ "id", "page_url", "page_describe", "pv", "pv_rate" ],
        jump_url : "/useAnalysis/pvPrice"
    });

    Router = new inter(Router, {
        modelName : "OverviewPlatf",
        router : "/OverviewPlatf/top",
        limitKey : "pv",
        limit : 10,
        filter(data){
            return filter.accessPage(data);
        },
        cols : [ "序号", "地区", "访客数", "浏览量", "浏览量占比" ],
        rows : [ "id", "region", "uv", "pv", "pv_rate" ]
    });

    Router = new dataOverview(Router, {
        modelName : "UsersAccess",
        router : "/useAnalysis",
        filter(data) {
            return usersAccess.inter(data);
        },
        cols : [ "序号", "日期", "访问次数", "平均停留时间", "页面跳出率" ],
        rows : [ "id", "date", "acc_num", "acc_time", "bounce_rate" ]
    });

    Router = new dataOverview(Router, {
        modelName : "OverviewPage",
        router : "/useAnalysis/wap",
        filter(data) {
            return usersAccess.inter_wap(data);
        },
        cols : [ "日期", "页面URL", "浏览量", "访客数", "贡献下游浏览", "平均停留时间" ],
        rows : [ "date", "page_url", "pv", "uv", "follow_page_sum", "stay_time_avg" ]
    });

    return Router;
};