var api = require("../../../base/main");

module.exports = (Router) => {
    Router = new api(Router, {
        router : "/test",
        modelName : ["Count"],
        platform : false
    });


    return Router;
};