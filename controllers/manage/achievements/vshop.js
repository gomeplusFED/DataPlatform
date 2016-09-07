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


    return Router;
};