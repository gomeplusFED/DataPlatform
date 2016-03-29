/**
 * @author yanglei
 * @date 20151222
 * @fileoverview 自动生成路由
 */

var api = require('../libs/api');

module.exports = function(Router, options) {
    Router = new api(Router, options);
    return Router;
};
