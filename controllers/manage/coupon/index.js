/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/coupon");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/allOne",
        modelName : ["SalesPerfTranKv"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.tradeOne(data);
        },
        rows: [
            []
        ],
        cols: [
            []
        ]
    });

    return Router;
};