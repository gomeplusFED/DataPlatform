/**
 * @author yanglei
 * @date 20160104
 * @fileoverview 销售业绩
 */
var cache = require('./cache'),
    orm = require('orm'),
    excelExport = require('./excelExport'),
    cacheName = "Configure",
    nodeExcel = require('excel-export');

function achievements(Router, options) {
    this.modelName = options.modelName;
    this.view = options.view;
    this.path = this.router = options.router;
    this.links = options.links;
    this.pageTitle = options.pageTitle;
    this.tableTitle = options.tableTitle;
    this.default = ['platform', 'version', 'channel', 'quan'];
    this.filter = options.filter;
    this.rows = options.rows;
    this.required = options.required;
    this.cols = options.cols;
    this.defaultRender = [ 'type', 'ver', 'c', 'quan'];
    this.defaultOption = options.defaultOption;
    this.category_type = options.category_type;
    this.toTotal = options.toTotal;
    this.isSetEndTimeEleDisabled = options.isSetEndTimeEleDisabled;
    this.date_display = options.date_display ? false : true;
    this.export_display =  options.export_display ? false : true;
    this.page_display =  options.page_display ? false : true;
    this.functions =  options.functions ? options.functions : [];
    this.sku_type = options.defaultOption.sku_type;
    this.setDefaultOptionDate();
    this.setRouter(Router);

    return Router;
}

achievements.prototype = {
    constructor: achievements,
    setDefaultOptionDate() {
        var self = this;
        if(!self.toTotal) {
            var now = new Date();
            var endTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
            if(self.isSetEndTimeEleDisabled) {
                self.defaultOption.date = orm.between(new Date(endTime + ' 00:00:00'), new Date(endTime + '23:59:59'));
            } else {
                var date = new Date(now.getTime() - 7 * 24 * 60 * 1000);
                var startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                self.defaultOption.date = orm.between(new Date(startTime + ' 00:00:00'), new Date(endTime + '23:59:59'));
            }
        }
    },
    _sendData(type, req, res, next) {
        var self = this,
            params = self.defaultOption,
            query = req.query;
        if( type !== 'render') {
            params.date = orm.between(new Date(query.startTime + ' 00:00:00'), new Date(query.endTime + ' 23:59:59'));
            if(self.category_type) {
                params.category_type = self.category_type;
            }
        }
        if(self.sku_type) {
            params.sku_type = self.sku_type;
        }
        if(self.required) {
            self._getCache(params, type, req, res, next);
        } else {
            self._render(params, {}, type, req, res, next);
        }
    },
    _getCache(params, type, req, res, next){
        var self = this;
        cache.cacheGet(cacheName, (err, types) => {
            if (!err) {
                if (types === undefined) {
                    types = {};
                    self._setCache(params,types, type, req, res, next);
                } else {
                    if(self._checkParamsConfig(params, types, next)) {
                        self._render(params, types, type, req, res, next);
                    }
                }
            } else {
                return next(err);
            }
        });
    },
    _setCache(params, types, type, req, res, next) {
        var self = this;
        req.models[cacheName].find({}, (err, data) => {
            if(!err) {
                for(var i = 0; i < self.defaultRender.length; i++) {
                    types[self.defaultRender[i]] = [];
                    for(var k of data) {
                        if(self.default[i] === k.type) {
                            types[self.defaultRender[i]].push(k.name);
                        }
                    }
                }
                if(self._checkParamsConfig(params, types, next)) {
                    self._render(params, types, type, req, res, next);
                }
            } else {
                next(err);
            }
        })
    },
    _checkParamsConfig(params, data, next) {
        var time = 0,
            self = this,
            length = 0;
        Object.keys(self.required).forEach((key) => {
            if(self.required[key]) {
                time++;
                for(var i = 0; i < self.defaultRender.length; i++) {
                    if(self.defaultRender[i] === key) {
                        for(var k of data[self.defaultRender[i]]) {
                            if(k === params[key]) {
                                length++;
                            }
                        }
                    }
                }
            }
        });
        if (time !== length) {
            var error = [];
            for (var key of self.defaultRender) {
                error.push(key);
            }
            error = error.join("或者");
            error += "参数出错";
            next(new Error(error));
            return false;
        }
        return true;
    },
    _render(params, types, type, req, res, next){
        var self = this;
        req.models[self.modelName[0]].find(params, function(err, data) {
            if (!err) {
                if (self.filter) {
                    data = self.filter(data);
                }
                var sendData = {
                    code: 200,
                    data : data
                };
                sendData.links = self.links;
                sendData.lines = [];
                sendData.pageTitle = self.pageTitle;
                sendData.tableTitle = self.tableTitle;
                sendData.rows = self.rows;
                sendData.cols = self.cols;
                sendData.isSetEndTimeEleDisabled = self.isSetEndTimeEleDisabled;
                sendData.page_display = self.page_display;
                sendData.date_display = self.date_display;
                sendData.export_display = self.export_display;
                sendData.functions = self.functions;
                var getType = {};
                if(self.required) {
                    Object.keys(self.required).forEach((key) => {
                        if(self.required[key]) {
                            getType[key] = types[key];
                        }
                    });
                }
                if (type === 'render') {
                    var currentPageUrl = req.originalUrl;
                    sendData.currentPageUrl = currentPageUrl;
                    res[type](self.view, {
                        pageInitData: sendData,
                        getType: getType,
                        cols:sendData.cols.map(function(col){
                            return col.caption;
                        }),
                        rows:sendData.rows,
                        api:self.router
                    });
                } else if(type === 'excel'){
                    var conf = excelExport.analysisExcel(sendData.cols, sendData.rows, sendData.data);
                    var result = nodeExcel.execute(conf);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                    res.end(result, 'binary');
                } else {
                    res[type](sendData);
                }
            } else {
                return next(err);
            }
        });
    },
    setRouter: function(Router) {
        Router.get(this.path, this._sendData.bind(this, 'render'));
        Router.get(this.path + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.path + '_jsonp', this._sendData.bind(this, 'jsonp'));
        Router.get(this.path + '_excel', this._sendData.bind(this, 'excel'));
        return Router;
    }
};

module.exports = achievements;