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
        //查库原生sql
        sql : ["firstSql", "secondSql", "thirdSql", "fourthSql"],
        //对应表是否分页
        paging : [],
        //查询分页条数
        page : null,
        //需要求和字段
        sum : [],
        //排序字段
        order : [],
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
        //搜索框
        search : {show: false},
        //表格字段选择框
        control_table_col : false,
        //全局模块
        global_platform: {show: false}
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

        //不带任何参数时，给一个空的数据
        if(Object.keys(query).length === 0) {

            //如果有该参数，说明前端某一部分参数需要sql查询获取
            //注意这里仅仅在接口初始化，没有任何参数时走。
            if(this.selectFilter) {
                this.selectFilter(req, (err, data) => {
                    if(!err) {

                        //将查询的结果写入该参数，返回给前端

                        // console.log(data);
                        this.filter_select = data;

                        //拼接固定的数据结构，并返回请求结果
                        this._render(res, [], type);
                    } else {
                        next(err);
                    }
                });
            } else {
            //前端不需要额外的参数直接走
                this._render(res, [], type);
            }
        } else {
        //包含参数时针对传递的参数做处理

            //检查时间字段是否符合标准。如果不符合，_checkDate方法直接返回错误
            if(this._checkDate(query, next)) {
                if(query.startTime && query.endTime) {
                    //设置查询时间区间
                    params.date = orm.between(
                        new Date(query.startTime + " 00:00:00"),
                        new Date(query.endTime + " 23:59:59")
                    );
                }


                if(typeof this.fixedParams === "function") {
                    //fixedParams方法，将结果挂载到了query上
                    this.fixedParams(req, query, (err, data) => {
                        if(err) {
                            next(err);
                        } else {

                            query = data;
                            dates = utils.times(query.startTime, query.endTime, query.day_type);
                            this._getCache(type, req, res, next, query, params, dates);
                        }
                    });
                } else {
                    //得到时间区间内包含每一天的时间数组
                    dates = utils.times(query.startTime, query.endTime, query.day_type);
                    this._getCache(type, req, res, next, query, params, dates);
                }
            }
        }
    },
    _checkDate(query, next) {
        if(query.startTime === undefined && query.endTime === undefined) {
            return true;
        } else {
            if (!validator.isDate(query.startTime) && !validator.isDate(query.endTime)) {
                next(new Error("startTime参数出错或者endTime参数出错"));
                return false;
            }
            return true;
        }
    },
    _render(res, sendData, type) {
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
                search: this.search,
                control_table_col : {
                    show : this.control_table_col
                },
                global_plataform : this.global_platform
            }
        });
    },
    _checkParams(next, query, params, cacheData) {
        var errObj = {},
            err = [];
        for(var key of this.defaultRender) {
            if(this[key.render]) {
                errObj[key.param] = false;
                for(var k of cacheData[key.render]) {
                    if(query[key.param] === k) {
                        errObj[key.param] = true;
                    }
                }
            }
        }
        for(var key in errObj) {
            !errObj[key] && err.push(key);
        }

        if (err.length > 0) {
            next(new Error(err.join("参数或者") + "参数出错"));
            return false;
        }
        for(var value in query) {
            if(value !== "startTime" && value !== "endTime" && value.indexOf("filter") < 0) {
                params[value] = query[value];
            }
        }
        return true;
    },
    _findData(type, req, res, next, query, params, dates) {
        async(() => {
            var isErr = false,
                error = "",
                find = {
                    find : "params",
                    order : this.order,
                    run : ""
                },
                pageFind = {
                    find : "params",
                    offset : "offset",
                    limit : "limit",
                    order : this.order,
                    run : ""
                },
                sum = {
                    aggregate : "params",
                    sum : this.sum,
                    get : ""
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
                    if(this[this.paramsName[i]]) {
                        if (typeof this[this.paramsName[i]] === "function") {
                            params = this[this.paramsName[i]](query, params, sendData);
                        } else {
                            for (var key in this[this.paramsName[i]]) {
                                params[key] = this[this.paramsName[i]][key];
                            }
                        }
                    }
                    sendData[this.dataName[i]] = {};
                    if(this[this.sql[i]]) {
                        if (this.paging[i]) {
                            sendData[this.dataName[i]].data =
                                await(this._findDatabaseSql(req, this[this.sql[i]](query, params, false)));
                            sendData[this.dataName[i]].count =
                                await(this._findDatabaseSql(req, this[this.sql[i]](query, params, true)));
                        } else {
                            sendData[this.dataName[i]].data =
                                await(this._findDatabaseSql(req, this[this.sql[i]](query, params)));
                        }
                    } else {
                        if (this.procedure[i]) {
                            if (this.paging[i]) {
                                sendData = this._returnFind(
                                    req, params, this.modelName[i],
                                    this.procedure[i], sendData, this.dataName[i]
                                );
                            } else {
                                sendData[this.dataName[i]].data =
                                    await(this._findDatabase(req, params, this.modelName[i], this.procedure[i]));
                            }
                        } else if (this.paging[i]) {
                            if(this.sum.length > 0) {
                                sendData = this._returnFind(
                                    req, params, this.modelName[i],
                                    [pageFind, sum, count], sendData, this.dataName[i]
                                );
                            } else {
                                sendData = this._returnFind(
                                    req, params, this.modelName[i],
                                    [pageFind, count], sendData, this.dataName[i]
                                );
                            }
                        } else {
                            sendData[this.dataName[i]].data =
                                await(this._findDatabase(req, params, this.modelName[i], find));
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
                sendData = this.filter(sendData, query, dates, type);
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
    _returnFind(req, params, modelName, procedure, sendData, dataName){
        if(procedure.length === 2) {
            sendData[dataName].data = await (this._findDatabase(req, params, modelName, procedure[0]));
            sendData[dataName].count = await (this._findDatabase(req, params, modelName, procedure[1]));
        } else {
            sendData[dataName].data = await (this._findDatabase(req, params, modelName, procedure[0]));
            sendData[dataName].sum = await (this._findDatabase(req, params, modelName, procedure[1]));
            sendData[dataName].count = await (this._findDatabase(req, params, modelName, procedure[2]));
        }
        return sendData;
    },
    _getCache(type, req, res, next, query, params, dates) {
        cache.cacheGet(cacheName, (err, cacheData) => {
            if (!err) {
                if (cacheData) {
                    if (this._checkParams(next, query, params, cacheData)) {
                        this._findData(type, req, res, next, query, params, dates);
                    }
                } else {
                    cacheData = {};
                    var cacheObject = {};
                    async(() => {
                        try {
                            var data = await(this._findDatabase(req, {}, cacheName, {find: ""}));
                            for (var key of this.defaultRender) {
                                cacheData[key.render] = [];
                                cacheObject[key.db] = key.render;
                            }
                            for (var key of data) {
                                cacheData[cacheObject[key.type]].push(key.name);
                            }
                            this._checkParams(next, query, params, cacheData) &&
                            this._setCache(type, req, res, next, query, params, dates, cacheData);
                        } catch (err) {
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
            return !err && success ?
                this._findData(type, req, res, next, query, params, dates) : next(err);
        });
    },
    _findDatabase : async((req, params, modelName, procedure) => {
        var limit = this.page || +params.limit || 20,
            page = params.page || 1,
            offset = limit * (page - 1),
            keys = Object.keys(procedure),
            endFn = "get run",
            arrayFn = "sum groupBy order",
            objectFn = "aggregate",
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

        /*console.log("===============sql params=============");
        console.log(req.url , modelName);
        console.log(params);
        console.log(keys);
        console.log("================== END =====================");*/
        return new Promise((resolve, reject) => {
            var sql = req.models[modelName];
            if (length > 1){
                for (var key in procedure) {
                    if (endFn.indexOf(key) >= 0) {
                        sql[key](function () {
                            var args = Array.prototype.slice.call(arguments),
                                err = args.shift();
                                /*console.log("==== result ===");
                                console.log(key);
                                console.log(args);
                                console.log("======= END ======")*/
                            err ? reject(err) : resolve(args);
                        });
                    } else if (arrayFn.indexOf(key) >= 0) {
                        for (var k of procedure[key]) {
                            sql[key](k);
                        }
                    } else if (objectFn.indexOf(key) >= 0) {
                        sql = sql[key](procedure[key].value || [], _obj.params);
                    } else {
                        sql = sql[key](_obj[procedure[key]]);
                    }
                }
            } else {
                // console.log(req.url);
                sql[keys[0]](_obj.params, (err, data) => {
                    /*console.log("==== result ===");
                    console.log(keys);
                    console.log(data);
                    console.log("======= END222 ======")*/
                    err ? reject(err) : resolve(data);
                });
            }
        });
    }),
    _findDatabaseSql : async((req, sqlObject) => {
        return new Promise((resolve, reject) => {
            req.models.db1.driver.execQuery(sqlObject.sql, sqlObject.params, (err, data) => {
                err ? reject(err) : resolve(data);
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