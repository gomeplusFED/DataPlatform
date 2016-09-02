/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
let redis = require("ioredis"),
    redisConfig = require("../../../db/redis.json"),
    config = require("../../../db/config.json").redis,
    moment = require("moment"),
    filter = require("../../../filters/marketingAnalysis"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    cluster = new redis.Cluster(redisConfig[config]);

module.exports = (Router) => {

    Router = Router.get("/marketingAnalysis/overviewZero_json", (req, res, next) => {
        req.models.Channel.find({}, (err, data) => {
            if(err) {
                next(err);
            } else {
                let channel = {};
                let global_components = {
                    content: '渠道选择',
                    preMethods: ['show_filter'],
                    customMethods: '',
                    max: 10,
                    key : "channel_id",
                    groups: []
                };
                for(let key of data) {
                    if(channel[key.channel_type_code]) {
                        channel[key.channel_type_code].options.push({
                            text : key.channel_name,
                            value : key.channel_type_code + key.channel_code
                        });
                    } else {
                        channel[key.channel_type_code] = {
                            name : key.channel_type,
                            options : []
                        };
                    }
                }
                for(let key in channel) {
                    global_components.groups.push({
                        text : channel[key].name,
                        value : key,
                        options : channel[key].options
                    });
                }
                res.json({
                    code : 200,
                    modelData : [],
                    components : {
                        flexible_btn : global_components
                    }
                });
            }
        });
    });

    Router  = Router.get("/marketingAnalysis/overviewOne_json", (req, res, next) => {
        let query = req.query,
            data = {
                now : {},
                old : {}
            },
            now = new Date(),
            date = moment(now).format("MMDD"),
            oldDate = moment(new Date(now - 24 * 60 * 60 * 1000)).format("MMDD"),
            hour = moment(now).format("HH"),
            cols = [
                [
                    {
                        caption : "",
                        type : "string"
                    },{
                        caption : "活动页UV",
                        type : "number"
                    },{
                        caption : "活动页PV",
                        type : "number"
                    },{
                        caption : "新增注册",
                        type: "number"
                    },{
                        caption : "分享人数",
                        type : "number"
                    },{
                        caption : "分享次数",
                        type : "number"
                    }
                ]
            ],
            rows = [
                ["name", "uv", "pv", "new_user", "share_user", "share_num"]
            ];

        if(Object(query).length === 0) {
            _render(res, []);
        } else {
            for(let key of rows[0]) {
                data.now[key] = [];
                data.old[key] = [];
            }
            if(query.channel_id) {
                for(let key of query.channel_id) {
                    for(let i = 0; i < +hour + 1; i++) {
                        if(i >= 10) {
                            data.now.pv.push(
                                await (_find(`all:market:activity:${date + i}:${key}:pv`))
                            );
                            data.now.share_user.push(
                                await (_find(`all:market:activity:share:${date + i}:${key}:pv`))
                            );
                        } else {
                            data.now.pv.push(
                                await (_find(`all:market:activity:${date}0${i}:${key}:pv`))
                            );
                            data.now.share_user.push(
                                await (_find(`all:market:activity:share:${date}0${i}:${key}:pv`))
                            );
                        }
                    }
                    for(let i = 0; i < 24; i++) {
                        if(i >= 10) {
                            data.old.pv.push(
                                await (_find(`all:market:activity:${oldDate + i}:${key}:pv`))
                            );
                            data.old.share_user.push(
                                await (_find(`all:market:activity:share:${oldDate + i}:${key}:pv`))
                            );
                        } else {
                            data.old.pv.push(
                                await (_find(`all:market:activity:${oldDate}0${i}:${key}:pv`))
                            );
                            data.old.share_user.push(
                                await (_find(`all:market:activity:share:${oldDate}0${i}:${key}:pv`))
                            );
                        }
                    }
                    data.now.uv.push(
                        await (_find(`all:market:activity:${now}:${key}:uv`))
                    );
                    data.now.new_user.push(
                        await (_find(`all:market:activity:register:${now}:${key}:uv`))
                    );
                    data.now.share_num.push(
                        await (_find(`all:market:activity:share:${now}:${key}:uv`))
                    );
                    data.old.uv.push(
                        await (_find(`all:market:activity:${oldDate}:${key}:uv`))
                    );
                    data.old.new_user.push(
                        await (_find(`all:market:activity:register:${oldDate}:${key}:uv`))
                    );
                    data.old.share_num.push(
                        await (_find(`all:market:activity:share:${oldDate}:${key}:uv`))
                    );
                }
            }

            _render(res, filter.overviewOne(data, rows, cols));
        }
    });



    function _render(res, sendData) {
        res.json({
            code: 200,
            modelData: sendData,
            components: {
                date_picker: {
                    show: false
                },
                drop_down: {
                    platform: false,
                    channel: false,
                    version: false,
                    coupon: false
                }
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

    return Router;
};