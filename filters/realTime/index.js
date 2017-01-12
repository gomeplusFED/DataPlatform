/**
 * @author yanglei
 * @date 20160630
 * @fileoverview 实时分析
 */
var moment = require("moment"),
    area = require("../../utils/config.json").area,
    util = require("../../utils");

module.exports = {
    one(data, rows, cols, type) {
        var newData = [],
            pcCols = [ "pv", "vv", "uv", "newuser", "visit" ],
            iosCols = [ "uv", "startcount", "newuser", "visit" ],
            objCols = [],
            date = moment(new Date()).format("HH"),
            one = {
                user : 0
            },
            two = {
                user : 0
            },
            three = {
                user : 0
            };

        if(type === "PC" || type === "H5") {
            objCols = pcCols;
        } else {
            objCols = iosCols;
        }

        for(var k of objCols) {
            one[k] = 0;
            two[k] = 0;
            three[k] = 0;
        }

        for(var key in data["0"]) {
            for(var k of data["0"][key]) {
                if(k) {
                    one[key] += +k;
                }
            }
        }

        for(var key in data["1"]) {
            for(var k of data["1"][key]) {
                if(k) {
                    two[key] += +k;
                }
            }
        }

        for(var key in data["1"]) {
            for(var i = 0; i < +date + 1; i++) {
                if(data["1"][key][i]) {
                    three[key] += +data["1"][key][i];
                }
            }
        }

        if(type === "PC" || type === "H5") {
            newData.push({
                name : "今日",
                one : one.uv,
                two : one.pv,
                three : one.vv,
                four : one.newuser,
                five : util.toFixed(one.newuser, one.uv),
                six : one.user,
                seven : util.division(one.pv, one.vv),
                eight : util.division(one.visit, one.vv)
            });
            newData.push({
                name : "昨日",
                one : two.uv,
                two : two.pv,
                three : two.vv,
                four : two.newuser,
                five : util.toFixed(two.newuser, two.uv),
                six : two.user,
                seven : util.division(two.pv, two.vv),
                eight : util.division(two.visit, two.vv)
            });
            newData.push({
                name : "今日预估",
                one : (util.contrast(one.uv, three.uv) * two.uv).toFixed(0),
                two : (util.contrast(one.pv, three.pv) * two.pv).toFixed(0),
                three : (util.contrast(one.vv, three.vv) * two.vv).toFixed(0),
                four : (util.contrast(one.newuser, three.newuser) * two.newuser).toFixed(0),
                five :
                    util.toFixed(
                        Math.round(util.contrast(one.newuser, three.newuser) * two.newuser),
                        Math.round(util.contrast(one.uv, three.uv) * two.uv)
                    ),
                six : (util.contrast(one.user, three.user) * two.user).toFixed(0),
                seven : (util.contrast(
                    +util.division(one.pv, one.vv),
                    +util.division(three.pv, three.vv)
                ) * util.division(two.pv, two.vv)).toFixed(2),
                eight : (util.contrast(
                    +util.division(one.visit, one.vv),
                    +util.division(three.visit, three.vv)
                ) * util.division(two.visit, two.vv)).toFixed(2)
            });
        } else {
            newData.push({
                name : "今日",
                one : one.uv,
                two : one.startcount,
                three : util.round(one.startcount, one.uv),
                four : one.newuser,
                five : util.toFixed(one.newuser, one.uv),
                six : one.user,
                seven : util.division(one.visit, one.startcount),
                eight : util.division(one.visit, one.uv)
            });
            newData.push({
                name : "昨日",
                one : two.uv,
                two : two.startcount,
                three : util.round(two.startcount, two.uv),
                four : two.newuser,
                five : util.toFixed(two.newuser, two.uv),
                six : two.user,
                seven : util.division(two.visit, two.startcount),
                eight : util.division(two.visit, two.uv)
            });
            newData.push({
                name : "今日预估",
                one : (util.contrast(one.uv, three.uv) * two.uv).toFixed(0),
                two : (util.contrast(one.startcount, three.startcount) * two.startcount).toFixed(0),
                three :
                    (util.contrast(
                        util.round(one.startcount, one.uv),
                        util.round(three.startcount, three.uv)
                    ) * util.round(two.startcount, two.uv)).toFixed(0),
                four : (util.contrast(one.newuser, three.newuser) * two.newuser).toFixed(0),
                five :
                    util.toFixed(
                        Math.round((util.contrast(one.newuser, three.newuser) * two.newuser)),
                        Math.round((util.contrast(one.uv, three.uv) * two.uv))
                    ),
                six : (util.contrast(one.user, three.user) * two.user).toFixed(0),
                seven : (util.contrast(
                    +util.division(one.visit, one.startcount),
                    +util.division(three.visit, three.startcount)
                ) * util.division(two.visit, two.startcount)).toFixed(2),
                eight : (util.contrast(
                    +util.division(one.visit, one.uv),
                    +util.division(three.visit, three.uv)
                ) * util.division(two.visit, two.uv)).toFixed(2)
            });
        }
        return util.toTable([newData], rows, cols);
    },
    two(data, hour, option) {
        var newData = {},
            type = "line",
            map = {
                one : "今日",
                two : "对比"
            };

        for(var i = 0; i < 24; i++) {
            newData[i + ":00-" + (i + 1) + ":00"] = {
                one : 0,
                two : 0
            }
        }

        if(option.length > 1) {
            if(option[0] === "newuser" && option[1] === "uv") {
                for(var i = 0; i < 24; i++) {
                    if(data["0"][option[0]][i] &&
                        data["0"][option[1]][i]) {
                        newData[i + ":00-" + (i + 1) + ":00"].one =
                            util.percentage(
                                data["0"][option[0]][i],
                                data["0"][option[1]][i]
                            );
                    }
                    if(data["1"][option[0]][i] &&
                        data["1"][option[1]][i]) {
                        newData[i + ":00-" + (i + 1) + ":00"].two =
                            util.percentage(
                                data["1"][option[0]][i],
                                data["1"][option[1]][i]
                            );
                    }
                }
            } else {
                for(var i = 0; i < 24; i++) {
                    if(data["0"][option[0]][i] &&
                        data["0"][option[1]][i]) {
                        newData[i + ":00-" + (i + 1) + ":00"].one =
                            util.round(
                                data["0"][option[0]][i],
                                data["0"][option[1]][i]
                            );
                    }
                    if(data["1"][option[0]][i] &&
                        data["1"][option[1]][i]) {
                        newData[i + ":00-" + (i + 1) + ":00"].two =
                            util.round(
                                data["1"][option[0]][i],
                                data["1"][option[1]][i]
                            );
                    }
                }
            }
        } else {
            for(var i = 0; i < 24; i++) {
                if(data["0"][option[0]][i]) {
                    newData[i + ":00-" + (i + 1) + ":00"].one =
                        data["0"][option[0]][i];
                }
                if(data["1"][option[0]][i]) {
                    newData[i + ":00-" + (i + 1) + ":00"].two =
                        data["1"][option[0]][i];
                }
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                toolBox : {
                    magicType : {
                        type: ['line', 'bar']
                    },
                    dataView: {readOnly: true}
                }
            }
        }]
    },
    three(data, type, chartType) {
        var maps = {
            "ios" : {
                pv : "启动用户"
                //uv : "启动次数"
            },
            "android" : {
                pv : "启动用户"
                //uv : "启动次数"
            },
            "PC" : {
                pv : "浏览量"
                //uv : "访客数"
            },
            "H5" : {
                pv : "浏览量"
                //uv : "访客数"
            }
        },
            config = {
                "map" : {
                    stack: false,
                    toolBox : {
                        dataView: {readOnly: true}
                    }
                },
                "pie" : {
                    stack: false,
                    toolBox : {
                        dataView: {readOnly: true}
                    }
                }
            },
            newData = {};

        if(data[0][1][1]) {
            config.map.mapMaxValue = +data[0][1][1];
        }

        for(var i = 0; i < data[0][1].length; i++) {
            if(i%2 === 0) {
                newData[area[data[0][1][i]]] = {
                    pv : +data[0][1][i + 1]
                };
            }
        }

        return [{
            map : maps[type],
            type : chartType,
            config : config[chartType],
            data : newData
        }]
    },
    four(data, uvs, names, total_pv, params) {
        var rows = [[
            "date", "url", "name", "uv", "pv", "pv_rate"
        ]],
            cols = [[]],
            pc = {
                "时段" : "string",
                "访问页面" : "string",
                "页面名称/ID" : "string",
                "访客数" : "number",
                "浏览量" : "number",
                "浏览量占比" : "string"
            },
            app = {
                "时段" : "string",
                "访问页面" : "string",
                "页面名称/ID" : "string",
                "访问用户数" : "number",
                "访问次数" : "number",
                "访问次数占比" : "string"
            },
            date = "",
            config = {},
            newData = [],
            total = 0;
        if(params.type === "PC" || params.type === "H5") {
            for(var key in pc) {
                cols[0].push({
                    caption : key,
                    type : pc[key]
                });
            }
        } else {
            for(var key in app) {
                cols[0].push({
                    caption : key,
                    type : app[key]
                });
            }
        }

        for(var key of total_pv) {
            if(key) {
                total += +key;
            }
        }

        if(params.hour === "all") {
            date = "全时段";
        } else {
            date = params.hour + ":00-" + (params.hour + 1) + ":00";
        }

        for(var key of names) {
            config[key.url] = key.name;
        }

        for(var i = 0; i < data[0][1].length; i++) {
            if(i%2 === 1) {
                newData.push({
                    date : date,
                    url : data[0][1][i - 1],
                    pv : +data[0][1][i]
                });
            }
        }

        for(var i = 0; i < newData.length; i++) {
            var key = newData[i];
            key.uv = +uvs[i][0][1];
            key.name = config[key.url];
            key.pv_rate = util.toFixed(key.pv, total);
            newData[i] = key;
        }

        return util.toTable([newData], rows, cols);
    }
};