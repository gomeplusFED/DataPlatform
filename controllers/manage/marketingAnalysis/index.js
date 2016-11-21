/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
let moment = require("moment"),
    filter = require("../../../filters/marketingAnalysis"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    cluster = global.cluster;

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
                            options : [{
                                text : key.channel_name,
                                value : key.channel_type_code + key.channel_code
                            }]
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
                        type : "number",
                        help : "活动页的访问人数"
                    },{
                        caption : "活动页PV",
                        type : "number",
                        help : "活动页的访问次数"
                    },{
                        caption : "新增注册",
                        type: "number",
                        help : "通过活动带来的注册数"
                    },{
                        caption : "分享人数",
                        type : "number"
                    },{
                        caption : "分享次数",
                        type : "number"
                    },{
                        caption : "下单总量",
                        type : "number"
                    },{
                        caption : "下单总金额",
                        type : "number"
                    },{
                        caption : "支付总量",
                        type : "number"
                    },{
                        caption : "实际支付总金额",
                        type : "number"
                    }
                ]
            ],
            rows = [
                ["name", "uv", "pv", "new_user", "share_user", "share_num", "create_count", "create_amount",
                    "payment_count", "payment_amount"]
            ];

        if(Object(query).length === 0) {
            _render(res, [], {});
        } else {
            for(let key of rows[0]) {
                data.now[key] = [];
                data.old[key] = [];
            }
            async(() => {
                try {
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
                                    data.now.create_count.push(
                                        await (_find(`all:order:create:activity:${key}:${date + i}:counts`))
                                    );
                                    data.now.create_amount.push(
                                        await (_find(`all:order:create:activity:${key}:${date + i}:amount`))
                                    );
                                    data.now.payment_count.push(
                                        await (_find(`all:order:payment:activity:${key}:${date + i}:counts`))
                                    );
                                    data.now.payment_amount.push(
                                        await (_find(`all:order:payment:activity:${key}:${date + i}:amount`))
                                    );
                                } else {
                                    data.now.pv.push(
                                        await (_find(`all:market:activity:${date}0${i}:${key}:pv`))
                                    );
                                    data.now.share_user.push(
                                        await (_find(`all:market:activity:share:${date}0${i}:${key}:pv`))
                                    );
                                    data.now.create_count.push(
                                        await (_find(`all:order:create:activity:${key}:${date}0${i}:counts`))
                                    );
                                    data.now.create_amount.push(
                                        await (_find(`all:order:create:activity:${key}:${date}0${i}:amount`))
                                    );
                                    data.now.payment_count.push(
                                        await (_find(`all:order:payment:activity:${key}:${date}0${i}:counts`))
                                    );
                                    data.now.payment_amount.push(
                                        await (_find(`all:order:payment:activity:${key}:${date}0${i}:amount`))
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
                                    data.old.create_count.push(
                                        await (_find(`all:order:create:activity:${key}:${oldDate + i}:counts`))
                                    );
                                    data.old.create_amount.push(
                                        await (_find(`all:order:create:activity:${key}:${oldDate + i}:amount`))
                                    );
                                    data.old.payment_count.push(
                                        await (_find(`all:order:payment:activity:${key}:${oldDate + i}:counts`))
                                    );
                                    data.old.payment_amount.push(
                                        await (_find(`all:order:payment:activity:${key}:${oldDate + i}:amount`))
                                    );
                                } else {
                                    data.old.pv.push(
                                        await (_find(`all:market:activity:${oldDate}0${i}:${key}:pv`))
                                    );
                                    data.old.share_user.push(
                                        await (_find(`all:market:activity:share:${oldDate}0${i}:${key}:pv`))
                                    );
                                    data.old.create_count.push(
                                        await (_find(`all:order:create:activity:${key}:${oldDate}0${i}:counts`))
                                    );
                                    data.old.create_amount.push(
                                        await (_find(`all:order:create:activity:${key}:${oldDate}0${i}:amount`))
                                    );
                                    data.old.payment_count.push(
                                        await (_find(`all:order:payment:activity:${key}:${oldDate}0${i}:counts`))
                                    );
                                    data.old.payment_amount.push(
                                        await (_find(`all:order:payment:activity:${key}:${oldDate}0${i}:amount`))
                                    );
                                }
                            }

                            data.now.uv.push(
                                await (_find(`all:market:activity:${date}:${key}:uv`))
                            );
                            data.now.new_user.push(
                                await (_find(`all:market:activity:register:${date}:${key}:uv`))
                            );
                            data.now.share_num.push(
                                await (_find(`all:market:activity:share:${date}:${key}:uv`))
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
                    } else {
                        for(let i = 0; i < +hour + 1; i++) {
                            if(i >= 10) {
                                data.now.pv.push(
                                    await (_find(`all:market:activity:${date + i}:pv`))
                                );
                                data.now.share_user.push(
                                    await (_find(`all:market:activity:share:${date + i}:pv`))
                                );
                                data.now.create_count.push(
                                    await (_find(`all:order:create:activity:${date + i}:counts`))
                                );
                                data.now.create_amount.push(
                                    await (_find(`all:order:create:activity:${date + i}:amount`))
                                );
                                data.now.payment_count.push(
                                    await (_find(`all:order:payment:activity:${date + i}:counts`))
                                );
                                data.now.payment_amount.push(
                                    await (_find(`all:order:payment:activity:${date + i}:amount`))
                                );
                            } else {
                                data.now.pv.push(
                                    await (_find(`all:market:activity:${date}0${i}:pv`))
                                );
                                data.now.share_user.push(
                                    await (_find(`all:market:activity:share:${date}0${i}:pv`))
                                );
                                data.now.create_count.push(
                                    await (_find(`all:order:create:activity:${date}0${i}:counts`))
                                );
                                data.now.create_amount.push(
                                    await (_find(`all:order:create:activity:${date}0${i}:amount`))
                                );
                                data.now.payment_count.push(
                                    await (_find(`all:order:payment:activity:${date}0${i}:counts`))
                                );
                                data.now.payment_amount.push(
                                    await (_find(`all:order:payment:activity:${date}0${i}:amount`))
                                );
                            }
                        }
                        for(let i = 0; i < 24; i++) {
                            if(i >= 10) {
                                data.old.pv.push(
                                    await (_find(`all:market:activity:${oldDate + i}:pv`))
                                );
                                data.old.share_user.push(
                                    await (_find(`all:market:activity:share:${oldDate + i}:pv`))
                                );
                                data.old.create_count.push(
                                    await (_find(`all:order:create:activity:${oldDate + i}:counts`))
                                );
                                data.old.create_amount.push(
                                    await (_find(`all:order:create:activity:${oldDate + i}:amount`))
                                );
                                data.old.payment_count.push(
                                    await (_find(`all:order:payment:activity:${oldDate + i}:counts`))
                                );
                                data.old.payment_amount.push(
                                    await (_find(`all:order:payment:activity:${oldDate + i}:amount`))
                                );
                            } else {
                                data.old.pv.push(
                                    await (_find(`all:market:activity:${oldDate}0${i}:pv`))
                                );
                                data.old.share_user.push(
                                    await (_find(`all:market:activity:share:${oldDate}0${i}:pv`))
                                );
                                data.old.create_count.push(
                                    await (_find(`all:order:create:activity:${oldDate}0${i}:counts`))
                                );
                                data.old.create_amount.push(
                                    await (_find(`all:order:create:activity:${oldDate}0${i}:amount`))
                                );
                                data.old.payment_count.push(
                                    await (_find(`all:order:payment:activity:${oldDate}0${i}:counts`))
                                );
                                data.old.payment_amount.push(
                                    await (_find(`all:order:payment:activity:${oldDate}0${i}:amount`))
                                );
                            }
                        }

                        data.now.uv.push(
                            await (_find(`all:market:activity:${date}:uv`))
                        );
                        data.now.new_user.push(
                            await (_find(`all:market:activity:register:${date}:uv`))
                        );
                        data.now.share_num.push(
                            await (_find(`all:market:activity:share:${date}:uv`))
                        );
                        data.old.uv.push(
                            await (_find(`all:market:activity:${oldDate}:uv`))
                        );
                        data.old.new_user.push(
                            await (_find(`all:market:activity:register:${oldDate}:uv`))
                        );
                        data.old.share_num.push(
                            await (_find(`all:market:activity:share:${oldDate}:uv`))
                        );
                    }
                    _render(res, filter.overviewOne(data, rows, cols), {});
                } catch(err) {
                    next(err);
                }
            })();
        }
    });

    Router = Router.get("/marketingAnalysis/overviewTwo_json", (req, res, next) => {
        let query = req.query,
            date = new Date(),
            now = moment(date).format("MMDD"),
            old = moment(new Date(date - query.day * 24 * 60 * 60 * 1000)).format("MMDD"),
            hour = moment(date).format("HH"),
            modules = {
                filter_select : [{
                    title: '数据指标',
                    filter_key: 'filter_key',
                    groups: [{
                        key: 'uv',
                        value: '活动页UV'
                    }, {
                        key: 'pv',
                        value: '活动页PV'
                    }, {
                        key: 'new_user',
                        value: '新增注册'
                    }, {
                        key: 'share_user',
                        value: '分享人数'
                    }, {
                        key: 'share_num',
                        value: '分享次数'
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

        if(Object.keys(query).length === 0) {
            _render(res, [], modules);
        } else {
            async(() => {
                try {
                    if(query.channel_id) {
                        _render(res, filter.overviewTwo(
                            _findRedis(query.filter_key, {
                                now : now,
                                old : old
                            }, hour, query.channel_id), query.day
                        ), modules);
                    } else {
                        _render(res, filter.overviewTwo(
                            _findRedis(query.filter_key, {
                                now : now,
                                old : old
                            }, hour, []), query.day
                        ), modules);
                    }
                } catch(err) {
                    next(err);
                }
            })();

        }
    });

    Router = Router.get("/marketingAnalysis/overviewThree_json", (req, res, next) => {
        let query = req.query,
            date = new Date(),
            now = moment(date).format("MMDD"),
            old = moment(new Date(date - query.day * 24 * 60 * 60 * 1000)).format("MMDD"),
            hour = moment(date).format("HH"),
            modules = {
                filter_select : [{
                    title: '数据指标',
                    filter_key: 'filter_key',
                    groups: [{
                        key: 'create_count',
                        value: '下单总量'
                    }, {
                        key: 'create_amount',
                        value: '下单总金额'
                    }, {
                        key: 'payment_count',
                        value: '支付总量'
                    }, {
                        key: 'payment_amount',
                        value: '实际支付总金额'
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

        if(Object.keys(query).length === 0) {
            _render(res, [], modules);
        } else {
            async(() => {
                try {
                    if(query.channel_id) {
                        _render(res, filter.overviewTwo(
                            _findRedis(query.filter_key, {
                                now : now,
                                old : old
                            }, hour, query.channel_id), query.day
                        ), modules);
                    } else {
                        _render(res, filter.overviewTwo(
                            _findRedis(query.filter_key, {
                                now : now,
                                old : old
                            }, hour, []), query.day
                        ), modules);
                    }
                } catch(err) {
                    next(err);
                }
            })();

        }
    });

    function _render(res, sendData, modules) {
        res.json({
            code: 200,
            modelData: sendData,
            components: {
                flexible_btn: modules.flexible_btn || [],
                date_picker: {
                    show: false
                },
                drop_down: {
                    platform: false
                },
                filter_select: modules.filter_select || []
            }
        })
    }

    function _findRedis(filter_key, date, hour, channels) {
        let data = {},
            key,
            end;

        if(filter_key === "uv") {
            key = "all:market:activity:";
            end = "uv";
        } else if(filter_key === "pv") {
            key = "all:market:activity:";
            end = "pv";
        } else if(filter_key === "new_user") {
            key = "all:market:activity:register:";
            end = "uv";
        } else if(filter_key === "share_user") {
            key = "all:market:activity:share:";
            end = "pv";
        } else {
            key = "all:market:activity:share:";
            end = "uv";
        }

        if(filter_key === "create_count") {
            key = "all:order:create:activity:";
            end = "counts";
        } else if(filter_key === "create_amount") {
            key = "all:order:create:activity:";
            end = "amount";
        } else if(filter_key === "payment_count") {
            key = "all:order:payment:activity:";
            end = "counts";
        } else if(filter_key === "payment_amount") {
            key = "all:order:payment:activity:";
            end = "amount";
        }

        if(channels.length === 0) {
            for(let i = 0; i < +hour + 1; i++) {
                    if(i >= 10) {
                        data[`${i}:00-${i+1}:00`] = {
                            now : await (_find(`${key + date.now + i}:${end}`)) || 0,
                            old : await (_find(`${key + date.old + i}:${end}`)) || 0
                        };
                    } else {
                        data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`] = {
                            now : await (_find(`${key + date.now}0${i}:${end}`)) || 0,
                            old : await (_find(`${key + date.old}0${i}:${end}`)) || 0
                        };
                    }
                }
        } else {
            if(end === "counts" || end === "amount") {
                for(let channel of channels) {
                    for(let i = 0; i < +hour + 1; i++) {
                        if(i >= 10) {
                            if(data[`${i}:00-${i+1}:00`]) {
                                data[`${i}:00-${i+1}:00`].now +=
                                    await (_find(`${key}${channel + ":" + date.now + i + ":" + end}`)) || 0;
                                data[`${i}:00-${i+1}:00`].old +=
                                    await (_find(`${key}${channel + ":" + date.old + i + ":" + end}`)) || 0;
                            } else {
                                data[`${i}:00-${i+1}:00`] = {
                                    now : await (_find(`${key}${channel + ":" + date.now + i + ":" + end}`)) || 0,
                                    old : await (_find(`${key}${channel + ":" + date.old + i + ":" + end}`)) || 0
                                };
                            }
                        } else {
                            if(data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`]) {
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`].now +=
                                    await (_find(`${key}${channel}:${date.now}0${i + ":" + end}`)) || 0;
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`].now +=
                                    await (_find(`${key}${channel}:${date.old}0${i + ":" + end}`)) || 0;
                            } else {
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`] = {
                                    now : await (_find(`${key}${channel}:${date.now}0${i + ":" + end}`)) || 0,
                                    old : await (_find(`${key}${channel}:${date.old}0${i + ":" + end}`)) || 0
                                };
                            }
                        }
                    }
                }
            } else {
                for(let channel of channels) {
                    for(let i = 0; i < +hour + 1; i++) {
                        if(i >= 10) {
                            if(data[`${i}:00-${i+1}:00`]) {
                                data[`${i}:00-${i+1}:00`].now +=
                                    await (_find(`${key}${date.now + i + ":" + channel + ":" + end}`)) || 0;
                                data[`${i}:00-${i+1}:00`].old +=
                                    await (_find(`${key}${date.old  + i + ":" + channel + ":" + end}`)) || 0;
                            } else {
                                data[`${i}:00-${i+1}:00`] = {
                                    now : await (_find(`${key}${date.now + i + ":" + channel + ":" + end}`)) || 0,
                                    old : await (_find(`${key}${date.old  + i + ":" + channel + ":" + end}`)) || 0
                                };
                            }
                        } else {
                            if(data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`]) {
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`].now +=
                                    await (_find(`${key}${date.now}0${i + ":" + channel + ":" + end}`)) || 0;
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`].now +=
                                    await (_find(`${key}${date.old}0${i + ":" + channel + ":" + end}`)) || 0;
                            } else {
                                data[`0${i}:00-${i + 1 === 10 ? 10 : "0" + (i + 1)}:00`] = {
                                    now : await (_find(`${key}${date.now}0${i + ":" + channel + ":" + end}`)) || 0,
                                    old : await (_find(`${key}${date.old}0${i + ":" + channel + ":" + end}`)) || 0
                                };
                            }
                        }
                    }
                }
            }
        }

        return data;
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