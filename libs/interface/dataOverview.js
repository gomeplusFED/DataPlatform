/**
 * @author yanglei
 * @date 20160314
 * @fileoverview 数据概览
 */

var orm = require("orm");

function inter(Router, options) {
    this.router = options.router;
    this.modelName = options.modelName;
    this.filter = options.filter;
    this.rows = options.rows;
    this.cols = options.cols;
    this.setRouter(Router);

    return Router;
}


inter.prototype = {
    constructor: inter,
    _sendData(type, req, res, next){
        var self = this,
            params = req.query;
        params.date = orm.between(new Date(params.startTime + " 00:00:00"), new Date(params.endTime + " 23:59:59"));
        delete params.startTime;
        delete params.endTime;
        req.models[self.modelName].find(params, (err, data) => {
            if(!err) {
                if(self.filter) {
                    data = self.filter(data);
                }
                var sendData = {
                    code : 200,
                    data : data
                };
                sendData.rows = self.rows;
                sendData.cols = self.cols;
                res[type]({
                    pageInitData : sendData,
                    api : self.router
                });
            }else {
                next(err);
            }
        });
    },
    setRouter: function(Router) {
        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
        return Router;
    }
};

module.exports = inter;