/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
var redis = require("ioredis"),
    redisConfig = require("../../../db/redis.json"),
    config = require("../../../db/config.json").redis,
    cluster = new redis.Cluster(redisConfig[config]);

module.exports = (Router) => {

    //Router = Router.get("/marketingAnalysis/overviewZero_json", (req, res, next) => {
    //    req.models.Channel.find({}, (err, data) => {
    //        if(err) {
    //            next(err);
    //        } else {
    //            let channel = {};
    //            let global_components = {
    //                content: '渠道选择',
    //                preMethods: ['show_filter'],
    //                customMethods: '',
    //                max: 10,
    //                key : "channel_id",
    //                groups: []
    //            };
    //            for(let key of data) {
    //                if(channel[key.channel_type_code]) {
    //                    channel[key.channel_type_code].options.push({
    //                        text : key.channel_name,
    //                        value : key.channel_type_code + key.channel_code
    //                    });
    //                } else {
    //                    channel[key.channel_type_code] = {
    //                        name : key.channel_type,
    //                        options : []
    //                    };
    //                }
    //            }
    //            for(let key in channel) {
    //                global_components.groups.push({
    //                    text : channel[key].name,
    //                    value : key,
    //                    options : channel[key].options
    //                });
    //            }
    //            res.json({
    //                code : 200,
    //                modelData : [],
    //                components : {
    //                    flexible_btn : [global_components]
    //                }
    //            });
    //        }
    //    });
    //});

    Router  = Router.get("/marketingAnalysis/overviewOne_json", (req, res, next) => {
        let query = req.query,
            modules = {},
            cols = [
                [
                    {
                        caption : ""
                    },{
                        caption : "活动页UV"
                    },{
                        caption : "活动页PV"
                    },{
                        caption : "新增注册"
                    },{
                        caption : "分享人数"
                    },{
                        caption : "分享次数"
                    }
                ]
            ],
            rows = [
                ["name", "uv", "pv", "new_user", "share_user", "share_num"]
            ];
        if(Object(query).length === 0) {
            _render(res, [], modules);
        } else {

        }
    });

    //Router  = Router.get("/marketingAnalysis/overviewFour_json", (req, res, next) => {
    //    res.json({
    //        code : 200,
    //        modelData : [],
    //        components : {}
    //    })
    //});



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
    return Router;
};