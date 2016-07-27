/**
 * @author yanglei
 * @date 20160725
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
        //filter过滤数据时对应表数据存储名字
        dataName : ["first", "second", "third", "fourth"],
        //是否固定参数
        paramsName : ["params", "secondParams", "thirdParams", "fourthParams"],
        //需查库设置参数 req query cb
        fixedName : null,
        //查库流程
        procedure : [],
        //对应表是否分页
        paging : [],
        //需要求和字段
        sum: null,
        //排序字段
        order : null,
        //辅助表数据整理 req cb
        selectFilter : null,
        //行
        rows: [],
        //列
        cols: [],
        //是否显示平台
        platform: true,
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
        //联动菜单url
        level_select_url: null,
        //查询字段名称
        level_select_name: null,
        //单选
        filter_select: [],
        //过滤数据
        filter: null,
        //参数名对应字段名
        defaultRender: [{
            render: "platform",
            param: "type",
            db : "platform"
        }, {
            render: "version",
            param: "ver",
            db : "version"
        }, {
            render: "channel",
            param: "channel",
            db : "channel"
        }, {
            render: "coupon",
            param: "coupon_type",
            db : "quan"
        }],
        search : {show: false}
    }, options);

    utils.mixin(this, defaultOption);
    this.setRouter(Router);

    return Router;
}

api.prototype = {
    constructor: api,
    _sendData(type, req, res, next) {
        var query = req.query,
            params = {},
            dates = [];
        if(Object.keys(query).length === 0) {
            this._rend(res, [], type);
        } else {
            if(this._checkDate(query, next)) {
                if(query.startTime && query.endTime) {
                    params.date = orm.between(
                        new Date(query.startTime + " 00:00:00"),
                        new Date(query.endTime + " 23:59:59")
                    );
                }
                if(typeof this.fixedName === "function") {
                    this.fixedParams(req, query, (err, data) => {
                        if(err) {
                            next(err);
                        } else {
                            query = data;
                            dates = utils.times(query.startTime, query.endTime, query.day_type);
                            this._getCache(type, res, req, next, query, params, dates);
                        }
                    });
                } else {
                    dates = utils.times(query.startTime, query.endTime, query.day_type);
                    this._getCache(type, res, req, next, query, params, dates);
                }
            }
        }
    },
    _checkDate(query, next) {
        if(query.startTime === undefined && query.endTime === undefined) {
            return true;
        } else {
            if (!validator.isDate(query.startTime)) {
                next(new Error("startTime参数出错"));
                return false;
            } else if(!validator.isDate(query.endTime)) {
                next(new Error("endTime参数出错"));
            }
            return true;
        }
    },
    _rend(res, sendData, type) {
        res[type]({
            code: 200,
            modelData: sendData,
            components: {
                flexible_btn: this.flexible_btn,
                date_picker: {
                    show: this.date_picker,
                    defaultData: this.date_picker_data,
                    showDayUnit : this.showDayUnit
                },
                drop_down: {
                    platform: this.platform,
                    channel: this.channel,
                    version: this.version,
                    coupon: this.coupon
                },
                level_select: {
                    show : this.level_select,
                    url : this.level_select_url,
                    name : this.level_select_name
                },
                filter_select: this.filter_select,
                search: this.search
            }
        });
    },
    _checkParams(next, query, params, cacheData) {
        var errObj = {},
            err = [];
        for(var key of this.defaultRender) {
            if(this[key.render]) {
                if(!query[key.param]) {
                    query[key.param] = params[key.param];
                }
                errObj[key.param] = false;
                for(var k of cacheData[key.render]) {
                    if(query[key.param] === k) {
                        params[key.param] = query[key.param];
                        errObj[key.param] = true;
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
            if(value !== "startTime" && value !== "endTime" && value.indexOf("filter") < 0) {
                if(params[value] !== query[value]) {
                    params[value] = query[value];
                }
            }
        });
        return true;
    },
    _selectFilter(type, res, req, next, query, params, dates) {
        if(typeof this.selectFilter === "function") {
            this.selectFilter(req, (err, data) => {
                if(!err) {
                    this.filter_select = data;
                    this._findData(type, res, req, next, query, params, dates);
                } else {
                    next(err);
                }
            });
        } else {
            this._findData(type, res, req, next, query, params, dates);
        }
    },
    _findData(type, res, req, next, query, params, dates) {
        async(() => {
            var isErr = false,
                error = "",
                find = {
                    find : ""
                },
                pageFind = {
                    find : "params",
                    offset : "offset",
                    limit : "limit",
                    run : {
                        end : true
                    }
                },
                sum = {
                    aggregate : "params",
                    sum : this.sum,
                    get : {
                        end : true
                    }
                },
                count = {
                    count : ""
                },
                sendData = {
                    rows: this.rows,
                    cols: this.cols
                };
            try {
                for(var i = 0; i < this.modelName.length; i++) {
                    if(this.sql[i]) {
                        if(this.paging[i]) {
                            sendData[this.dataName[i]].data =
                                await(this._findDatabaseSql(req, this.sql[i][0]));
                            sendData[this.dataName[i]].count =
                                await(this._findDatabaseSql(req, this.sql[i][1]));
                        } else {
                            sendData[this.dataName[i]].data =
                                await(this._findDatabaseSql(req, this.sql[i]));
                        }
                    } else {
                        if(this[this.paramsName[i]]) {
                            if(typeof this[this.paramsName[i]] === "function") {
                                query = this[this.paramsName[i]](query, params, sendData);
                            } else {
                                query = this[this.paramsName[i]];
                            }
                        }

                        if(this.procedure[i]) {
                            if(this.paging[i]) {
                                sendData[this.dataName[i]].data =
                                    await (this._findDatabase(req, params, this.modelName[i], this.procedure[i][0]));
                                sendData[this.dataName[i]].sum =
                                    await (this._findDatabase(req, params, this.modelName[i], this.procedure[i][1]));
                                sendData[this.dataName[i]].count =
                                    await (this._findDatabase(req, params, this.modelName[i], this.procedure[i][2]));
                            } else {
                                sendData[this.dataName[i]].data =
                                    await (this._findDatabase(req, params, this.modelName[i], this.procedure[i]));
                            }
                        } else {
                            if(this.paging[i]) {
                                sendData[this.dataName[i]].data =
                                    await (this._findDatabase(req, params, this.modelName[i], pageFind));
                                sendData[this.dataName[i]].sum =
                                    await (this._findDatabase(req, params, this.modelName[i], sum));
                                sendData[this.dataName[i]].count =
                                    await (this._findDatabase(req, params, this.modelName[i], count));
                            } else {
                                sendData[this.dataName[i]].data =
                                    await (this._findDatabase(req, params, this.modelName[i], find));
                            }
                        }
                    }

                }
            }catch(err) {
                isErr = true;
                error = err;
            }
            if(isErr) {
                next(error);
                return;
            }
            if (this.filter) {
                sendData = this.filter(
                    sendData,
                    query,
                    dates,
                    type
                );
            }
            if (type !== "excel") {
                this._render(res, sendData, type);
            } else {
                var conf = excelExport.analysisExcel(sendData),
                    result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(result, 'binary');
            }
        })();
    },
    _getCache(type, res, req, next, query, params, dates) {
        cache.cacheGet(cacheName, (err, cacheData) => {
            if (!err) {
                if (cacheData) {
                    if (this._checkParams(next, query, params, cacheData)) {
                        if(this._selectFilter) {
                            this._selectFilter(type, res, req, next, query, params, dates)
                        } else {
                            this._findData(type, res, req, next, query, params, dates);
                        }
                    }
                } else {
                    cacheData = {};
                    async(() => {
                        try {
                            var data = await (this._findDatabase(req, params, cacheName, {find : ""}));
                            for (var key of this.defaultRender) {
                                cacheData[key.render] = [];
                                for (var k of data) {
                                    if (k.type === key.db) {
                                        cacheData[key.render].push(k.name);
                                    }
                                }
                            }
                            if (this._checkParams(next, query, params, cacheData)) {
                                this._setCache(type, req, res, next, query, params, dates, cacheData);
                            }
                        }catch(err) {
                            next(err);
                        }
                    })();
                }
            } else {
                next(err);
            }
        });
    },
    _setCache(type, req, res, next, query, params, dates, cacheData) {
        cache.cacheSet(cacheName, cacheData, cacheTime, (err, success) => {
            if (!err && success) {
                if(this._selectFilter) {
                    this._selectFilter(type, res, req, next, query, params, dates);
                } else {
                    this._findData(type, res, req, next, query, params, dates);
                }
            } else {
                next(err);
            }
        });
    },
    _findDatabase : async((req, params, modelName, procedure) => {
        var limit = +params.limit || 10,
            page = params.page || 1,
            offset = limit * (page - 1),
            keys = Object.keys(procedure),
            length = keys.length,
            _obj = {
                limit : limit,
                offset : offset,
                params : {}
            };

        if(params.from) {
            _obj.offset = params.from - 1;
        }

        if(params.to) {
            _obj.limit = +params.to;
        }

        for(var key in params) {
            if("page limit from to".indexOf(key) < 0) {
                _obj.params[key] = params[key];
            }
        }
        return new Promise((resolve, reject) => {
            var sql = req.models[modelName];
            if(length > 1) {
                for(var key in procedure) {
                    if(typeof procedure[key] === "object") {
                        if(procedure[key].end) {
                            sql[key](() => {
                                var args = arguments;
                                if (args["0"]) {
                                    reject(args["0"]);
                                } else {
                                    resolve(args);
                                }
                            });
                        } else {
                            sql[key](_obj.params, procedure[key].value);
                        }
                    } else if(procedure[key] instanceof Array) {
                        for(var k of procedure[key]) {
                            sql[key](k);
                        }
                    } else {
                        sql[key](_obj[procedure[key]]);
                    }
                }
            } else {
                sql[keys[0]](_obj.params, (err, data) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }),
    _findDatabaseSql : async((req, sql) => {
        return new Promise((resolve, reject) => {
            req.models.db1.driver.execQuery(sql, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
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