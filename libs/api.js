/**
 * @author yanglei
 * @date 20151221
 * @fileoverview 自动生成路由
 */
var orm = require('orm');
var check = require('./validator');
var excelExport = require('./excelExport');
var nodeExcel = require('excel-export');
var cache = require('./cache');
var utils = require('./utils');
var cacheTime = 0;

function api(Router, options) {

  var defaultOption = utils.mixin({
    //路径
    router: '',
    //视图
    view: 'analysis/index',
    //数据库表名
    modelName: [],
    //查表结果过滤
    filter: null,
    //excel下载表头
    cols: [],
    //excel下载内容字段
    rows: [],
    //页面标题
    pageTitle : '',
    //页面图名
    mapTitle : '',
    //页面表名
    tableTitle : '',
    //页面图线名
    lines : [],
    //查询参数默认值
    defaultParams: {
      type: 'H5',
      ver: '',
      channel: '',
      day_type: '1'
    },
    //下拉框初始化，在数据库中的属性名
    default: ['platform', 'version', 'channel', 'quan'],
    //下拉框初始化，在页面中的属性名
    defaultRender: [ 'type', 'ver', 'c', 'quan'],
    //必填参数
    required: {
      type: false,
      ver: false,
      channel: false,
      coupon_type : false,
      day_type: '1 2 3'
    },
    //多表多图下拉菜单
    links : [],
    //是否显示天周月
    day_type : true,
    //页面区分
    use : '',
    //页面弹层显示
    functions : [],
    //柱状图X轴是否自定义
    diff : false
  }, options);

  utils.mixin(this, defaultOption);

  this.setDefaultOptionDate();

  this.setRouter(Router);

  return Router;
}

api.prototype = {
  constructor: api,
  setDefaultOptionDate: function() {
    var now = new Date();
    var date = new Date(now.getTime() - 7 * 24 * 60 * 1000);
    var startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var endTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    this.defaultParams.date = orm.between(new Date(startTime + ' 00:00:00'), new Date(endTime + '23:59:59'));
    if(this.use) {
      this.defaultParams.use = this.use;
    }
  },
  _checkDate: function(time, msg, next) {
    if (!check.isDate(time)) {
      next(new Error(msg));
      return false;
    }
    return true;
  },
  _checkParams: function(query, type, next) {
    var self = this;
    var params = {};
    if (type === 'render') {
      Object.keys(self.required).forEach(function(key) {
        if(self.required[key]) {
          params[key] = self.defaultParams[key];
        }
      });
      params.date = self.defaultParams.date;
    } else {
      if (!self._checkDate(query.startTime, 'startTime参数错误', next) && !self._checkDate(query.endTime, 'endTime参数错误', next)) {
        return false;
      }
      params.date = orm.between(new Date(query.startTime + ' 00:00:00'), new Date(query.endTime + ' 23:59:59'));
      Object.keys(self.required).forEach(function(key) {
        if(self.required[key]) {
          params[key] = query[key];
        }
      });
    }
    if(self.defaultParams.sku_type) {
      params.sku_type = self.defaultParams.sku_type;
    }
    var validator = Object.keys(self.required);

    for (var i = 0; i < validator.length; i++) {
      if(self.required[validator[i]]) {
        if (!params[validator[i]]) {
          next(new Error(validator[i] + '参数错误'));
          return false;
        }
      }
      if (typeof self.required[validator[i]] === 'string' && self.required[validator[i]].indexOf(params[validator[i]]) === -1) {
        next(new Error(validator[i] + '参数错误'));
        return false;
      }
    }
    return {
      validator: validator,
      params: params
    };
  },
  _render: function(params, type, types, req, res, next) {
    var self = this;
    req.models[self.modelName[0]].find(params, function(err, data) {
      if (!err) {
        if(self.modelName[2]) {
          req.models[self.modelName[2]].find(params, function(error, mapdata) {
            if(!error){
              self._setdata(data, mapdata, types, type, req, res);
            }else {
              return next(err);
            }
          })
        }else {
          self._setdata(data, [], types, type, req, res);
        }
      } else {
        return next(err);
      }
    });
  },
  _setCacheAndRender: function(type, types, params, validator, req, res, next) {
    var self = this;
    self.defaultRender.forEach(function(key) {
      types[key] = [];
    });
    req.models[self.modelName[1]].find({}, function(err, configure) {
      if (!err) {
        var time = 0;
        var length = validator.length - 1;
        for (var i = 0; i < length; i++) {
          if(!self.required[validator[i]]) {
            time++;
          }
          configure.forEach(function(con) {
            if (self.default[i] === con.type) {
              types[self.defaultRender[i]].push(con.name);
            }
            if(self.required[validator[i]]) {
              if (params[validator[i]] === con.name) {
                time++;
              }
            }
          });
        }
        if (self._checkParamsConfig(time, length, validator, next)) {
          cache.cacheSet(self.modelName[1], types, cacheTime, function(err, success) {
            if (!err && success) {
              self._render(params, type, types, req, res, next);
            } else {
              return next(err);
            }
          });
        }
      } else {
        return next(err);
      }
    });
  },
  _sendData: function(type, req, res, next) {
    var self = this,
      query = req.query;
    var checkObj = self._checkParams(query, type, next);
    var validator = checkObj.validator;
    if (validator) {
      var params = checkObj.params;
      cache.cacheGet(self.modelName[1], function(err, types) {
        if (!err) {
          if (types === undefined) {
            types = {};
            self._setCacheAndRender(type, types, params, validator, req, res, next);
          } else {
            var length = validator.length - 1;
            var time = 0;
            var forEachParams = function(key) {
              if (key === params[validator[i]]) {
                time++;
              }
            };
            for (var i = 0; i < length; i++) {
              if(self.required[validator[i]] && types[self.defaultRender[i]]) {
                types[self.defaultRender[i]].forEach(forEachParams);
              } else {
                time++;
              }
            }
            if (self._checkParamsConfig(time, length, validator, next)) {
              self._render(params, type, types, req, res, next);
            }
          }
        } else {
          return next(err);
        }
      });
    }
  },
  _checkParamsConfig: function(time, length, validator, next) {
    if (time !== length) {
      var error = validator[0];
      for (var i = 1; i < length; i++) {
        error = error + '或者' + validator[i];
      }
      error = error + '参数出错';
      next(new Error(error));
      return false;
    }
    return true;
  },
  _setdata(data, mapdata, types, type, req, res) {
    var self = this;
    var sendData = {
      code: 200,
      data: data
    };
    sendData.pageTitle = self.pageTitle;
    sendData.mapTitle = self.mapTitle;
    sendData.tableTitle = self.tableTitle;
    sendData.lines = self.lines;
    sendData.rows = self.rows;
    sendData.cols = self.cols;
    sendData.links = self.links;
    sendData.diff = self.diff;
    sendData.functions = self.functions;
    sendData.mapdata = mapdata;
    if (self.filter) {
      sendData = self.filter(sendData, types);
    }
    var keys = Object.keys(self.required);
    var getType = {};
    for(var i = 0; i < self.defaultRender.length; i++) {
      if(self.required[keys[i]] && types[self.defaultRender[i]]) {
        getType[self.defaultRender[i]]  = types[self.defaultRender[i]];
      }
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
        api:self.router,
        day_type : self.day_type
      });
    } else if (type === 'excel') {
      var conf = excelExport.analysisExcel(sendData.cols, sendData.rows, sendData.data);
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
      res.end(result, 'binary');
    } else {
      res[type](sendData);
    }
  },
  setRouter: function(Router) {
    Router.get(this.router, this._sendData.bind(this, 'render'));
    Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
    Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
    Router.get(this.router + '_excel', this._sendData.bind(this, 'excel'));
    return Router;
  }
};

module.exports = api;
