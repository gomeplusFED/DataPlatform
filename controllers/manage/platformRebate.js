/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../base/api");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/platformOrderOne",
        modelName : "Rebate",
        excel_export : false
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderTwe",
        modelName : "Rebate"
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderThree",
        modelName : "Rebate"
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFour",
        modelName : "Rebate"
    });

    return Router;
};