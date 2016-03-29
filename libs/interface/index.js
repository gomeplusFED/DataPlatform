/**
 * @author yanglei
 * @date 20160311
 * @fileoverview 出单个接口所用-昨日数据
 */

var orm = require("orm");

function inter(Router, options) {
    this.router = options.router;
    this.modelName = options.modelName;
    this.limitKey = options.limitKey;
    this.limit = options.limit;
    this.filter = options.filter;
    this.rows = options.rows;
    this.cols = options.cols;
    this.jump_url = options.jump_url;
    this.defaultOption = {};
    this.setDefaultOptionDate();
    this.setRouter(Router);

    return Router;
}


inter.prototype = {
    constructor: inter,
    setDefaultOptionDate() {
        var self = this,
            date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        self.defaultOption.date = orm.between(new Date(endTime + ' 00:00:00'), new Date(endTime + '23:59:59'));
    },
    _sendData(type, req, res, next){
        var self = this;
        req.models[self.modelName].find(self.defaultOption,[self.limitKey, "Z"], {limit : self.limit}, (err, data) => {
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
                sendData.jump_url = self.jump_url;
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