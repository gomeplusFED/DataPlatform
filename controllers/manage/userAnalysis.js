/**
 * @author yanglei
 * @date 201603231
 * @fileoverview 用户分析
 */
var api = require("../../base/api");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/newUsersOne",
        modelName : "NewAccount"
    });

    return Router;
};