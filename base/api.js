/**
 * @author yanglei
 * @date 20160324
 * @fileoverview 统一接口
 */
var utils = require("../utils"),
    cache = require("../utils/cache"),
    cacheName = "Configure",
    excelExport = require('../utils/excelExport'),
    nodeExcel = require('excel-export'),
    validator = require('validator'),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    orm = require("orm"),
    cacheTime = 1;

function api(Router, options) {
    var defaultOption = utils.mixin({
        //路由
        router: "",
        //数据库
        modelName: [],
        //固定参数
        fixedParams : {},
        //固定查询数据库参数
        params : {},
        //行
        rows: [],
        //列
        cols: [],
        //初始化数据
        default: {
            type: "H5",
            ver: "1.0.0",
            channel: "百度",
            day_type: 1
        },
        //是否显示平台
        platform: false,
        //是否显示渠道
        channel: false,
        //是否显示版本
        version: false,
        //是否显示优惠券类型
        coupon: false,
        //是否有导出路径
        excel_export : false,
        //按钮设置
        flexible_btn: [],
        //是否显示时间
        date_picker: true,
        //初始时间
        date_picker_data: 7,
        //联动菜单
        level_select: false,
        //单选
        filter_select: [],
        //过滤数据
        filter: null,
        //参数名对应字段名
        defaultRender: [{
            key: "platform",
            value: "type"
        }, {
            key: "version",
            value: "ver"
        }, {
            key: "channel",
            value: "channel"
        }, {
            key: "coupon",
            value: "coupon_type"
        }],
        //下拉框初始化，在页面中的属性名
        defaultCache: [{
            key: "platform",
            value: "platform"
        }, {
            key: "version",
            value: "version"
        }, {
            key: "channel",
            value: "channel"
        }, {
            key: "quan",
            value: "coupon"
        }]
    }, options);

    utils.mixin(this, defaultOption);

    this.setDefaultOptionDate(Router);
    this.setRouter(Router);

    return Router;
}

api.prototype = {
    constructor: api,
    setDefaultOptionDate() {
        var now = new Date();
        var date = new Date(now.getTime() - 7 * 24 * 60 * 1000);
        var startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        var endTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        this.default.date = orm.between(new Date(startTime + ' 00:00:00'), new Date(endTime + ' 23:59:59'));
    },
    _sendData(type, req, res, next) {
        var query = req.query,
            params = {};
        if(!query.startTime && !query.endTime) {
            params = this.default;
        } else {
            if((this._checkDate(query.startTime, "startTime参数出错", next)
                && this._checkDate(query.endTime, "endTime参数出错", next))) {
                params.date = orm.between(new Date(query.startTime + " 00:00:00"), new Date(query.endTime + " 23:59:59"));
            }
        }
        Object.keys(query).forEach((key) => {
            if(key.indexOf("filter") > -1) {
                this[key] = query[key];
                delete query[key];
            }
        });
        Object.keys(this.fixedParams).forEach((key) => {
            query[key] = this.fixedParams[key];
        });
        if(this.params) {
            params = this.params;
        }
        this._getCache(type, res, req, query, next, params);
    },
    _checkDate(option, errorMassage, next) {
        if (!validator.isDate(option)) {
            next(new Error(errorMassage));
            return false;
        }
        return true;
    },
    _getCache(type, res, req, query, next, params) {
        cache.cacheGet(cacheName, (err, cacheData) => {
            if (!err) {
                if (cacheData) {
                    if (this._checkQuery(query, cacheData, next, params)) {
                        this._findData(type, res, req, params, next);
                    }
                } else {
                    cacheData = {};
                    async(() => {
                        var data = await (this._findDatabase(req, cacheName, {}).catch((err) => {
                            next(err);
                        }));
                        for (var key of this.defaultCache) {
                            cacheData[key.value] = [];
                            for (var k of data) {
                                if (k.type === key.key) {
                                    cacheData[key.value].push(k.name);
                                }
                            }
                        }
                        if (this._checkQuery(query, cacheData, next, params)) {
                            this._setCache(type, req, res, params, cacheData, next);
                        }
                    })();
                }
            } else {
                next(err);
            }
        });
    },
    _findData(type, res, req, query, next) {
        async(() => {
            var isErr = false,
                error = "";
            var sendData = {
                rows: this.rows,
                cols: this.cols
            };
            try {
                sendData.data = await (this._findDatabase(req, this.modelName[0], query));
                if (this.modelName[1]) {
                    sendData.orderData = await (this._findDatabase(req, this.modelName[1], query));
                }
            }catch(err) {
                isErr = true;
                error = err;
            }
            if (this.filter) {
                sendData = this.filter(sendData, this.filter_key);
            }
            if(isErr) {
                next(error);
                return;
            }
            if (type !== "excel") {
                res[type]({
                    code: 200,
                    modelData: sendData,
                    components: {
                        flexible_btn: this.flexible_btn,
                        date_picker: {
                            show: this.date_picker,
                            defaultData: this.date_picker_data
                        },
                        drop_down: {
                            platform: this.platform,
                            channel: this.channel,
                            version: this.version,
                            coupon: this.coupon
                        },
                        level_select: this.level_select,
                        filter_select: this.filter_select
                    }
                });
            } else {
                var conf = excelExport.analysisExcel(sendData),
                    result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(result, 'binary');
            }
        })();
    },
    _setCache(type, req, res, params, data, next) {
        cache.cacheSet(cacheName, data, cacheTime, (err, success) => {
            if (!err && success) {
                this._findData(type, res, req, params, next);
            } else {
                next(err);
            }
        });
    },
    _checkQuery(query, data, next, params) {
        var errObj = {},
            err = [];
        for(var key of this.defaultRender) {
            if(this[key.key]) {
                if(!query[key.value]) {
                    query[key.value] = params[key.value];
                }
                errObj[key.value] = false;
                for(var k of data[key.key]) {
                    if(query[key.value] === k) {
                        params[key.value] = query[key.value];
                        errObj[key.value] = true;
                    }
                }
            }
        }
        Object.keys(errObj).forEach((key) => {
            if (!errObj[key]) {
                err.push(key);
            }
        });
        if (err.length > 0) {
            next(new Error(err.join("参数或者") + "参数出错"));
            return false;
        }
        Object.keys(query).forEach((value) => {
            if(value !== "startTime" && value !== "endTime") {
                if(!params.hasOwnProperty(value)) {
                    params[value] = query[value];
                }
            }
        });
        return true;
    },
    _findDatabase: async((req, modelName, params) => {
        return new Promise((resolve, reject) => {
            req.models[modelName].find(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }),
    setRouter(Router) {
        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
        if (this.excel_export) {
            Router.get(this.router + '_excel', this._sendData.bind(this, 'excel'));
        }
        return Router;
    }
};

module.exports = api;
