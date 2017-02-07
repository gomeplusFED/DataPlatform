/**
 * @author yanglei
 * @date 2017-02-07
 * @fileoverview
 */
const main = require("../../../base/main"),
    utils = require("../../../utils"),
    global_platform = {
        show: true,
        key: 'wm',
        list: [{
            key: 'ios',
            name: 'IOS'
        }, {
            key: 'android',
            name: 'Android'
        }, {
            key: 'app',
            name: 'APP'
        }, {
            key: 'pc',
            name: 'PC'
        }]
    },
    filter = require("../../../filters/office/function");

module.exports = (Router) => {

    //通讯录功能
    Router = new main(Router , {
        router : "/office/versionOne",
        modelName : ["ads2_company_oa_version_analysis"],
        platform : false,
        global_platform : global_platform,
        toggle : {
            show : true
        },
        filter (data, query){
            return filter.one(data, query, utils.timesTwo(query.startTime, query.endTime, "1"));
        }
    });

    return Router;
};