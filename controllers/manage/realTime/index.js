/**
 * @author yanglei
 * @date 20160630
 * @fileoverview 实时分析
 */
var redis = require("ioredis"),
    redisConfig = require("../../../db/redis.json"),
    config = require("../../../db/config.json").redis,
    cluster = new redis.Cluster(redisConfig[config]),
    type = {
        "PC" : "www:",
        "H5" : "m:",
        "ios" : "ios:",
        "Android" : "android:"
    },
    filter = require("../../../filters/realTime"),
    orm = require("orm"),
    util = require("../../../utils"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    moment = require("moment");


module.exports = (Router) => {
    Router = Router.get("/realTime/one_json", (req, res, next) => {
        var params = req.query,
            date = moment(new Date()).format("MMDD"),
            zDate = moment(new Date - 24 * 60 * 60 * 1000).format("MMDD"),
            hour =  moment(new Date()).format("HH"),
            pcCols = [ "pv", "vv", "uv", "newuser", "visit" ],
            iosCols = [ "uv", "startcount", "newuser", "visit" ],
            objCols = [],
            data = {
                "0" : {},
                "1" : {}
            },
            pc = {
                " " : "string",
                "访客数" : "number",
                "浏览量" : "number",
                "访问次数" : "number",
                "新增访客数" : "number",
                "新增访客占比" : "string",
                "新增注册（账户）" : "number",
                "平均访问页面数" : "number",
                "平均访问时长" : "number"
            },
            ios = {
                " " : "string",
                "启动用户数" : "number",
                "启动次数" : "number",
                "人均启动次数" : "number",
                "新增用户" : "number",
                "新增用户占比" : "string",
                "新增注册（账户）" : "number",
                "每次使用时长" : "number",
                "每人使用时长" : "number"
            },
            modules = {
                flexible_btn : [{
                    content: '<a href="javascript:void(0)" help_url="/dataOverviewApp/help_json">帮助</a>',
                    preMethods: ["show_help"],
                    customMethods: ''
                }],
                filter_select : [{
                    title: '',
                    filter_key: 'type',
                    groups: [{
                        key: 'ios',
                        value: 'ios'
                    }, {
                        key: 'android',
                        value: 'android'
                    }, {
                        key: 'PC',
                        value: 'PC'
                    }, {
                        key: 'H5',
                        value: 'H5'
                    }]
                }]
            },
            rows = [
                ["name", "one", "two", "three", "four", "five", "six", "seven", "eight"]
            ],
            cols = [[]];
        if(Object.keys(params).length === 0) {
            _render(res, [], modules);
        } else {
            if(params.type === "PC" || params.type === "H5") {
                objCols = pcCols;
                for(var key in pc) {
                    cols[0].push({
                        caption : key,
                        type : pc[key]
                    });
                }
            } else {
                for(var key in ios) {
                    objCols = iosCols;
                    cols[0].push({
                        caption : key,
                        type : ios[key]
                    });
                }
            }
            async(() => {
                try {
                    for(var key of objCols) {
                        data["0"][key] = [];
                        for(var i = 0; i< +hour + 1; i++) {
                            if(i >= 10) {
                                data["0"][key].push(
                                    await (_find("js:" + type[params.type] + date + i + ":" + key))
                                );
                            } else {
                                data["0"][key].push(
                                    await (_find("js:" + type[params.type] + date + "0" + i + ":" + key))
                                );
                            }
                        }
                        data["1"][key] = [];
                        for(var n = 0; n < 24; n++) {
                            if(n >= 10) {
                                data["1"][key].push(
                                    await (_find("js:" + type[params.type] + zDate + n + ":" + key))
                                );
                            } else {
                                data["1"][key].push(
                                    await (_find("js:" + type[params.type] + zDate + "0" + n + ":" + key))
                                );
                            }
                        }
                    }
                    data["0"].user = [];
                    data["1"].user = [];
                    for(var i = 0; i< +hour + 1; i++) {
                        if(i >= 10) {
                            data["0"].user.push(
                                await (_find("js:" + type[params.type] + "reg:" + date + i + ":user"))
                            );
                        } else {
                            data["0"].user.push(
                                await (_find("js:" + type[params.type] + "reg:" + date + "0" + i + ":user"))
                            );
                        }
                    }
                    for(var n = 0; n < 24; n++) {
                        if(n >= 10) {
                            data["1"].user.push(
                                await (_find("js:" + type[params.type] + zDate + n + ":" + key))
                            );
                        } else {
                            data["1"].user.push(
                                await (_find("js:" + type[params.type] + zDate + "0" + n + ":" + key))
                            );
                        }
                    }
                    _render(res, filter.one(data, rows, cols, params.type), modules);
                } catch (err) {
                    next(err);
                }
            })()
        }
    });

    Router = Router.get("/realTime/two_json", (req, res, next) => {
        var params = req.query,
            date = moment(new Date()).format("MMDD"),
            hour =  moment(new Date()).format("HH"),
            pc = {
                "访客数" : ["uv"],
                "浏览量" : ["pv"],
                "访问次数" : ["vv"],
                "新增访客数" : ["newuser"],
                "新增访客占比(%)" : ["newuser", "uv"],
                "新增注册（账户）" : ["user"],
                "平均访问页面数" : ["pv", "vv"],
                "平均访问时长" : ["visit", "vv"]
            },
            ios = {
                "启动用户数" : ["uv"],
                "启动次数" : ["startcount"],
                "人均启动次数" : ["startcount", "uv"],
                "新增用户" : ["newuser"],
                "新增用户占比(%)" : ["newuser", "uv"],
                "新增注册（账户）" : ["user"],
                "每次使用时长" : ["visit", "startcount"],
                "每人使用时长" : ["visit", "uv"]
            },
            data = {
                "0" : {},
                "1" : {}
            },
            modules = {
                flexible_btn : [],
                filter_select : [{
                    title: '',
                    filter_key: 'type',
                    groups: [{
                        key: 'ios',
                        value: 'ios',
                        cell: {
                            title: '数据指标',
                            filter_key : 'option',
                            groups : []
                        }
                    }, {
                        key: 'android',
                        value: 'android',
                        cell: {
                            title: '数据指标',
                            filter_key : 'option',
                            groups : []
                        }
                    }, {
                        key: 'PC',
                        value: 'PC',
                        cell: {
                            title: '数据指标',
                            filter_key : 'option',
                            groups : []
                        }
                    }, {
                        key: 'H5',
                        value: 'H5',
                        cell: {
                            title: '数据指标',
                            filter_key : 'option',
                            groups : []
                        }
                    }]
                }, {
                    title: '对比时段',
                    filter_key: 'day',
                    groups: [{
                        key : 1,
                        value : "前一日"
                    }, {
                        key : 7,
                        value : "上周同期"
                    }]
                }]
            };

        for(var key in pc) {
            modules.filter_select[0].groups[2].cell.groups.push({
                key : pc[key],
                value : key
            });
            modules.filter_select[0].groups[3].cell.groups.push({
                key : pc[key],
                value : key
            });
        }
        for(var key in ios) {
            modules.filter_select[0].groups[0].cell.groups.push({
                key : ios[key],
                value : key
            });
            modules.filter_select[0].groups[1].cell.groups.push({
                key : ios[key],
                value : key
            });
        }
        if(Object.keys(params).length === 0) {
            _render(res, [], modules);
        } else {
            var _date = moment(new Date() - params.day * 24 * 60 * 60 * 1000).format("MMDD");
            async(() => {
                try{
                    for(var key of params.option) {
                        var one = [],
                            two = [];
                        if(key === "user") {
                            for(var i = 0; i < +hour + 1; i++) {
                                if(i >= 10) {
                                    one.push(await (_find(
                                        "js:" + type[params.type] + "reg:" + date + i + ":" + key
                                    )));
                                    two.push(await (_find(
                                        "js:" + type[params.type] + "reg:" + _date + i + ":" + key
                                    )));
                                } else {
                                    one.push(await (_find(
                                        "js:" + type[params.type] + "reg:" + date + "0" + i + ":" + key
                                    )));
                                    two.push(await (_find(
                                        "js:" + type[params.type] + "reg:" + _date + "0" + i + ":" + key
                                    )));
                                }
                            }
                        } else {
                            for(var i = 0; i < +hour + 1; i++) {
                                if(i >= 10) {
                                    one.push(await (_find(
                                        "js:" + type[params.type] + date + i + ":" + key
                                    )));
                                    two.push(await (_find(
                                        "js:" + type[params.type] + _date + i + ":" + key
                                    )));
                                } else {
                                    one.push(await (_find(
                                        "js:" + type[params.type] + date + "0" + i + ":" + key
                                    )));
                                    two.push(await (_find(
                                        "js:" + type[params.type] + _date + "0" + i + ":" + key
                                    )));
                                }
                            }
                        }
                        data["0"][key] = one;
                        data["1"][key] = two;
                    }
                    _render(res, filter.two(data, hour, params.option), modules);
                } catch (err) {
                    next(err);
                }
            })();
        }
    });

    Router = Router.get("/realTime/three_json", (req, res, next) => {
        var params = req.query,
            date = moment(new Date()).format("MMDD"),
            hour = moment(new Date()).format("HH"),
            end = "",
            modules = {
                flexible_btn : [],
                filter_select : [{
                    title: '',
                    filter_key: 'type',
                    groups: [{
                        key: 'ios',
                        value: 'ios'
                    }, {
                        key: 'android',
                        value: 'android'
                    }, {
                        key: 'PC',
                        value: 'PC'
                    }, {
                        key: 'H5',
                        value: 'H5'
                    }]
                }, {
                    title: '时段选择',
                    filter_key: 'hour',
                    groups: [{
                        key : "all",
                        value : "全时段"
                    }]
                }, {
                    title: '',
                    filter_key: 'chartType',
                    groups: [{
                        key : "map",
                        value : "地图"
                    }, {
                        key : "pie",
                        value : "饼状图"
                    }]
                }]
            };

        for(var i = 0; i < +hour + 1; i++) {
            if(i >= 10) {
                modules.filter_select[1].groups.push({
                    key : i,
                    value : i + ":00-" + (i + 1) + ":00"
                });
            } else {
                modules.filter_select[1].groups.push({
                    key : "0" + i,
                    value : i + ":00-" + (i + 1) + ":00"
                });
            }
        }

        if(params.hour !== "all") {
            date += params.hour;
        }

        if(params.type === "PC" || params === "H5") {
            end = "pro_pv"
        } else {
            end = "pro_startcount"
        }

        if(Object.keys(params).length === 0) {
            _render(res, [], modules);
        } else {
            async(() => {
                try{
                    var key = "js:" + type[params.type] + date + ":" + end;
                    var data = await(_customFind([
                        "zrevrange", key, 0, 9, "WITHSCORES"
                    ]));
                    //var array = [];
                    //for(var i = 0; i < data[1].length; i++) {
                    //    if(i%2 === 0) {
                    //        array.push([
                    //            "zscore", "js:" + type[params.type] + date + ":pro_uv"
                    //        ]);
                    //    }
                    //}
                    //var uvs = await(_customFind(array));
                    _render(res, filter.three(data, params.type, params.chartType), modules);
                } catch(err) {
                    next(err);
                }
            })();
        }
    });

    Router = Router.get("/realTime/four_json", (req, res, next) => {
        var params = req.query,
            date = moment(new Date()).format("MMDD"),
            hour = moment(new Date()).format("HH"),
            end = "",
            keyEnd = "",
            modules = {
                flexible_btn : [],
                filter_select : [{
                    title: '',
                    filter_key: 'type',
                    groups: [{
                        key: 'ios',
                        value: 'ios'
                    }, {
                        key: 'android',
                        value: 'android'
                    }, {
                        key: 'PC',
                        value: 'PC'
                    }, {
                        key: 'H5',
                        value: 'H5'
                    }]
                }, {
                    title: '时段选择',
                    filter_key: 'hour',
                    groups: [{
                        key : "all",
                        value : "全时段"
                    }]
                }]
            };

        for(var i = 0; i < +hour; i++) {
            if(i >= 10) {
                modules.filter_select[1].groups.push({
                    key : i,
                    value : i + ":00-" + (i + 1) + ":00"
                });
            } else {
                modules.filter_select[1].groups.push({
                    key : "0" + i,
                    value : i + ":00-" + (i + 1) + ":00"
                });
            }
        }

        if(params.hour !== "all") {
            date += params.hour;
        }

        if(params.type === "PC" || params.type === "H5") {
            end = "url_pv";
            keyEnd = "pv";
        } else {
            end = "url_startcount";
            keyEnd = "startcount";
        }

        if(Object.keys(params).length === 0) {
            _render(res, [], modules);
        } else {
            async(() => {
                try{
                    var key = "js:" + type[params.type] + date + ":" + end;
                    var data = await(_customFind([
                        "zrevrange", key, 0, 9, "WITHSCORES"
                    ]));
                    var urls = [];
                    var uvs = [];
                    for(var i = 0; i < data[0][1].length; i++) {
                        if(i%2 === 0) {
                            urls.push(data[0][1][i]);
                            uvs.push(await(_customFind([
                                "zscore",
                                "js:" + type[params.type] + date + ":url_uv",
                                data[0][1][i]
                            ])));
                        }
                    }
                    var total_pv = await(_find("js:" + type[params.type] + date+ ":" + keyEnd));
                    req.models.UrlToName.find({
                        url : urls
                    }, (err, names) => {
                        if(err) {
                            next(err);
                        } else {
                            _render(res, filter.four(data, uvs, names, total_pv, params), modules);
                        }
                    });
                } catch(err) {
                    next(err);
                }
            })();
        }

    });

    return Router;
};

function _render(res, sendData, modules) {
    res.json({
        code: 200,
        modelData: sendData,
        components: {
            flexible_btn: modules.flexible_btn,
            date_picker: {
                show: false
            },
            drop_down: {
                platform: false
            },
            filter_select: modules.filter_select
        }
    })
}

var _find = async((key) => {
    return new Promise((resolve, reject) => {
        cluster.get(key, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
});

var _customFind = async((key) => {
    return new Promise((resolve, reject) => {
        cluster.pipeline([
            key
        ]).exec((err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
});