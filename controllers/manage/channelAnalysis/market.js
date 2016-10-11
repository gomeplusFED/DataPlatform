/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    filter = require("../../../filters/channelAnalysis/market");

module.exports = (Router) => {
    Router = new main(Router,{
        router : "/channelAnalysis/marketOne",
        modelName : ["ChaChalistChannel"],
        platform : false,
        filter(data, query, dates, type) {
            return filter.shopOne(data, query.filter_key, dates);
        }
    });

    return Router;
};