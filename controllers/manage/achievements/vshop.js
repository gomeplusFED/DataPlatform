/**
 * @author lzn
 * @date 20160906
 * @fileoverview 美店
 */
var api = require(RootPath+"/base/main"),
    vshopFilter = require("../../../filters/achievements/vshop"),
    orm = require("orm"),
    util = require("../../../utils");

module.exports = (Router) => {

    Router = new api(Router, {
        router: "/achievements/vshopOne",
        modelName: ['VshopInfo'],
        date_picker : false,
        platform : false,
        "filter_select": [
            {
                "title": "",
                "filter_key": "type",
                "groups": [
                    {
                        "key": "shop",
                        "value": "店铺"
                    },
                    {
                        "key": "product",
                        "value": "商品"
                    }
                ]
            }
        ],
        params(query) {
            // 取出近7天记录
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopOne(data, query.type);
        }
    });


    Router = new api(Router, {
        router: "/achievements/vshopTwo",
        modelName: ["VshopInfo"],
        platform : false,
        params(query) {
            return {
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopTwo(data, query, dates);
        }
    });


    // 每日明细
    Router = new api(Router, {
        router: "/achievements/vshopThree",
        modelName: ['VshopInfo'],
        date_picker: {show: true, defaultData: 7},
        platform : false,
        excel_export : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        "filter_select": [
            {
                "title": "",
                "filter_key": "type",
                "groups": [
                    {
                        "key": "shop",
                        "value": "店铺"
                    },
                    {
                        "key": "product",
                        "value": "商品"
                    }
                ]
            }
        ],
        params(query) {
            return {
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopThree(data, query.type, dates);
        }
    });

    // 商品来源分布
    Router = new api(Router, {
        router: "/achievements/vshopFour",
        modelName: ['VshopMerchandiseResources'],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        params : function(query , params , sendData){
            return params;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopFour(data, dates);
        }
    });

    // 流量Top 100
    Router = new api(Router, {
        router: "/achievements/vshopFive",
        modelName: ['VshopFlowTop'],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        "filter_select": [
            {
                "title": "",
                "filter_key": "type",
                "groups": [
                    {
                        "key": "visitor_num",
                        "value": "访问人数"
                    },
                    {
                        "key": "visited_time",
                        "value": "访问次数"
                    }
                ]
            }
        ],
        params : function(query , params , sendData){
            delete params.type;
            return params;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopFive(data, query.type);
        }
    });

    /**
     * 美店交易
     */
    // 美店交易总览
    Router = new api(Router, {
        router: "/achievements/vtradeOne",
        modelName: ['VtradeInfo'],
        date_picker : false,
        platform : false,
        params(query) {
            // 取出近7天记录
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeOne(data);
        }
    });

    // 交易趋势

    Router = new api(Router, {
        router: "/achievements/vtradeTwo",
        modelName: ["VtradeInfo"],
        platform : false,
        params(query) {
            return {
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeTwo(data, query, dates);
        }
    });

    // 交易明细
    Router = new api(Router, {
        router: "/achievements/vtradeThree",
        modelName: ['VtradeInfo'],
        date_picker: {show: true, defaultData: 7},
        platform : false,
        excel_export : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        "filter_select": [
            {
                "title": "",
                "filter_key": "type",
                "groups": [
                    {
                        "key": "all",
                        "value": "全部"
                    },
                    {
                        "key": "pc",
                        "value": "PC"
                    },
                    {
                        "key": "ios",
                        "value": "iOS"
                    },
                    {
                        "key": "android",
                        "value": "Android"
                    },
                    {
                        "key": "h5",
                        "value": "WAP"
                    }
                ]
            }
        ],
        params(query) {
            var obj = {
                day_type : 1
            }
            if(query.type && query.type !== 'all') {
                obj.type = query.type;
            }
            return obj;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeThree(data, query.type, dates);
        }
    });

    return Router;
};