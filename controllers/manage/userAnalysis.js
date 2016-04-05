/**
 * @author yanglei
 * @date 201603231
 * @fileoverview 用户分析
 */
var api = require("../../base/api"),
    userAnalysis = require("../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/newUsersOne",
        modelName : ["NewAccount"],
        excel_export : false,
        platform : true,
        filter(data, filter_key) {
            return userAnalysis.newUsers(data);
        }
    });

    return Router;
};