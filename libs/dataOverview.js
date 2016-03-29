/**
 * @author yanglei
 * @date 20151222
 * @fileoverview 数据概览
 */
var orm = require('orm');

function dataOverview(Router, options) {
    this.modelName = options.modelName;
    this.router = options.router;
    this.links = options.links;
    this.filter = options.filter;
    this.rows = options.rows;
    this.cols = options.cols;
    this.setRouter(Router);

    return Router;
}

dataOverview.prototype = {
    constructor: dataOverview,
    _sendData: function(type, req, res, next) {
        var self = this,
            yesterday = self._getDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
            qDay = self._getDate(new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)),
            startTime = new Date(yesterday + ' 00:00:00'),
            endTime = new Date(qDay + ' 23:59:59'),
            params = {
                date : orm.between(startTime, endTime)
            };
        req.models[self.modelName[0]].find(params, (err, data) => {
            if(!err) {
                req.models[self.modelName[1]].find(params, (err, users) => {
                    if(!err) {
                        if(self.filter) {
                            data = self.filter(data, users, self.rows);
                        }
                        var sendDatda = {
                            code : 200,
                            data : data
                        };
                        sendDatda.links = self.links;
                        sendDatda.rows = self.rows;
                        sendDatda.cols = self.cols;
                        sendDatda.currentPageUrl = self.router;
                        res[type]({
                            pageInitData : sendDatda,
                            api : self.router
                        });
                    }else {
                        next(err)
                    }
                })
            }else{
                next(err);
            }
        })
    },
    _getDate(date){
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
    setRouter: function(Router) {
        Router.get(this.router + "_json", this._sendData.bind(this, 'json'));
        Router.get(this.router + "_jsonp", this._sendData.bind(this, 'jsonp'));
        return Router;
    }
};

module.exports = dataOverview;
