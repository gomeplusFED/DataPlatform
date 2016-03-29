/**
 * @author yanglei
 * @date 20160325
 * @fileoverview 统一跳转页面
 */
var renderApi = require("../libs/api/renderApi");

module.exports = function(Router, options) {
    Router = new renderApi(Router, options);
    return Router;
};