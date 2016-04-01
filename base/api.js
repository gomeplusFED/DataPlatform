/**
 * @author yanglei
 * @date 20160324
 * @fileoverview 统一接口
 */
var utils = require("../utils"),
    cache = require("../utils/cache"),
    cacheName = "Configure",
    validator = require('validator'),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    orm = require("orm"),
    cacheTime = 1;

function api(Router, options) {
    var defaultOption = utils.mixin({
        //路由
        router : "",
        //数据库
        modelName : "",
        //行
        rows : [],
        //列
        cols : [],
        //是否显示平台
        platform : false,
        //是否显示渠道
        channel : false,
        //是否显示版本
        version : false,
        //是否显示优惠券类型
        coupon : false,
        //是否显示导出按钮
        excel_export : true,
        //是否显示时间
        date_picker : true,
        //初始时间
        date_picker_data : 7,
        //按钮设置
        btn_groups : {},
        //联动菜单
        level_select : {},
        //单选
        filter_select : {},
        //过滤数据
        filter : null,
        //参数名对应字段名
        defaultRender: [
            {
                key : "platform",
                value : "type"
            },{
                key : "version",
                value : "ver"
            },{
                key : "channel",
                value : "channel"
            },{
                key : "coupon",
                value : "coupon_type"
            }
        ],
        //下拉框初始化，在页面中的属性名
        defaultCache: [
            {
                key : "platform",
                value : "platform"
            },{
                key : "version",
                value : "version"
            },{
                key : "channel",
                value : "channel"
            },{
                key : "quan",
                value : "coupon"
            }
        ]
    }, options);

    utils.mixin(this, defaultOption);

    this.setRouter(Router);

    return Router;
}

api.prototype = {
    constructor: api,
    _sendData: function(type, req, res, next) {
        var query = req.query;
        if(this._checkDate(query.startTime, "startTime参数出错", next)
            && this._checkDate(query.endTime, "endTime参数出错", next)) {
            query.date = orm.between(new Date(query.startTime + " 00:00:00"), new Date(query.endTime + " 23:59:59"));
            this.filter_key = query.filter_key ? query.filter_key : '';
            delete query.startTime;
            delete query.endTime;
            delete query.filter_key;
            this._getCache(type, res, req, query, next);
        }
    },
    _checkDate(option, errorMassage, next) {
        if (!validator.isDate(option)) {
            next(new Error(errorMassage));
            return false;
        }
        return true;
    },
    _getCache(type, res, req, query, next) {
        cache.cacheGet(cacheName, (err, cacheData) => {
            if(!err) {
                if(cacheData) {
                    if(this._checkQuery(query, cacheData, next)) {
                        this._findData(type, res, req, query, next);
                    }
                } else {
                    cacheData = {};
                    async (() => {
                        var data = await (this._findDatabase(req, cacheName, {}).catch((err) => {
                                next(err);
                            }));
                        for(var key of this.defaultCache) {
                            cacheData[key.value] = [];
                            for(var k of data) {
                                if(k.type === key.key) {
                                    cacheData[key.value].push(k.name);
                                }
                            }
                        }
                        if(this._checkQuery(query, cacheData, next)) {
                            this._setCache(type, req, res, query, cacheData, next);
                        }
                    })();
                }
            } else {
                next(err);
            }
        });
    },
    _findData(type, res, req, query, next) {
        async (() => {
            var data = await (this._findDatabase(req, this.modelName, query).catch((err) => {
                next(err);
            }));
            var sendData = {
                code : 200,
                data : data,
                rows : this.rows,
                cols : this.cols
            };
            if(this.filter) {
                sendData = this.filter(sendData, this.filter_key);
            }
            if(type !== "excel") {
                res[type]({
                    modelData : sendData,
                    components : {
                        excel_export : this.excel_export,
                        date_picker : {
                            show : this.date_picker,
                            defaultData : this.date_picker_data
                        },
                        drop_down : {
                            platform: this.platform,
                            channel: this.channel,
                            version: this.version,
                            coupon: this.coupon
                        },
                        btn_groups : this.btn_groups,
                        level_select : this.level_select,
                        filter_select : this.filter_select
                    }
                });
            } else {

            }
        })();
    },
    _setCache(type, req, res, query, data, next) {
        cache.cacheSet(cacheName, data, cacheTime, (err, success) => {
            if(!err && success) {
                this._findData(type, res, req, query, next);
            } else {
                next(err);
            }
        });
    },
    _checkQuery(query, data, next) {
        var errObj = {},
            err = [];
        for(var key of this.defaultRender) {
            if(this[key.key]) {
                errObj[key.key] = false;
                for(var k of data[key.key]) {
                    if(query[key.key] === k) {
                        errObj[key.key] = true;
                    }
                }
            }
        }
        Object.keys(errObj).forEach((key) => {
            if(!errObj[key]) {
                err.push(key);
            }
        });
        if(err.length > 0) {
            next(new Error(err.join("参数或者") + "参数出错"));
            return false;
        }
        return true;
    },
    _findDatabase : async ((req, modelName, params) => {
        return new Promise((resolve, reject) => {
            req.models[modelName].find(params, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }),
    setRouter: function(Router) {
        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
        if(this.excel_export) {
            Router.get(this.router + '_excel', this._sendData.bind(this, 'excel'));
        }
        return Router;
    }
};

module.exports = api;