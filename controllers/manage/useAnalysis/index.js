/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用时长
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/useAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/useAnalysis/useTimeOne",
        modelName : ["UserCompose"],
        fixedParams : {
            use_type : 1
        },
        filter(data, filter_key, dates) {
            return filter.useTimeOne(data, [ '1-3秒', '4-10秒', '11-30秒', '31-60秒',
                '1-3分', '3-10分', '10-30分', '30分+' ], "单次使用时长");
        }
    });

    return Router;
};