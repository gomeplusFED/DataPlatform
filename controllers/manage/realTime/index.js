/**
 * @author yanglei
 * @date 20160630
 * @fileoverview 实时分析
 */
var redis = require("ioredis"),
    cluster = new redis.Cluster([
        {
            port : 7001,
            host : "bj01-ops-rdsc01.test.gomeplus.com"
        },{
            port : 7001,
            host : "bj01-ops-rdsc02.test.gomeplus.com"
        },{
            port : 7001,
            host : "bj01-ops-rdsc03.test.gomeplus.com"
        },{
            port : 7001,
            host : "bj01-ops-rdsc04.test.gomeplus.com"
        },{
            port : 7001,
            host : "bj01-ops-rdsc05.test.gomeplus.com"
        },{
            port : 7001,
            host : "bj01-ops-rdsc06.test.gomeplus.com"
        }
    ]),
    moment = require("moment"),
    EventProxy = require("eventproxy");


module.exports = (Router) => {
    Router = Router.get("/realTime/one", (req, res, next) => {
        var params = req.query || req.body,
            error = false,
            type = "m:",
            date = moment(new Date()).format("MMDD"),
            pc = {
                "访客数" : "number",
                "浏览量" : "number",
                "访问次数" : "number",
                "新增访客数" : "number",
                "新增访客占比" : "string",
                "新增注册（账户）" : "number",
                "平均访问页面数" : "number",
                "平均访问时长" : "number"
            },
            h5 = {
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
                date_picker : false,
                filter_select : []
            },
            rows = [
                ["name", "open_user_total", "open_total", "open_user_avg", "new_user", "new_user_rate",
                    "new_account", "using_time_avg", "stay_time_avg"]
            ],
            cols = [[]];
        if(!params) {
            _render(res, [], modules);
        } else {
            if(params.type === "PC") {
                type = "www:";
                for(var key in pc) {
                    cols[0].push({
                        caption : key,
                        type : pc[key]
                    });
                }
            } else {
                for(var key in h5) {
                    cols[0].push({
                        caption : key,
                        type : h5[key]
                    });
                }
            }
            var typeParams = "js:" + type + date;
            var ep = EventProxy.create("yesterday", () => {

                });
            req.models.OverviewPlatf.find({
                type : params.type,
                date : new Date(new Date() - 24 * 60 * 60 * 1000)
            }, (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("yesterday", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
            cluster.get(typeParams + ":pv", (err, data) => {
                if(err) {
                    error = true;
                } else {
                    ep.emit("pv", data);
                }
            });
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
                show: modules.date_picker
            },
            drop_down: {
                platform: ["ios", "Android", "PC", "H5"]
            },
            toolBox : {
                magicType : {
                    type: ['line', 'bar']
                },
                dataView: {readOnly: true}
            },
            filter_select: modules.filter_select
        }
    })
}