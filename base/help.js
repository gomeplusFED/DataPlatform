/**
 * @author yanglei
 * @date 20160421
 * @fileoverview 返回帮助信息
 */
var utils = require("../utils");

function help(Router, options) {
    this.modelData = utils.toTable(
        [options.data],
        options.rows,
        options.cols
    );
    this.router = options.router;
    this.setRouter(Router);
    return Router;
}

help.prototype = {
    constructor: help,
    _sendData(type, req, res, next) {
        res[type]({
            code: 200,
            modelData: this.modelData
        })
    },
    setRouter(Router) {
        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
        return Router;
    }
};

module.exports = help;