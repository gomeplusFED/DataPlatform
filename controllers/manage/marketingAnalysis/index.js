/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/marketingAnalysis");

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
                        flexible_btn : [global_components]
                    }
                });
            }
        });
    });

    Router  = Router.get("/marketingAnalysis/overviewOne_json", (req, res, next) => {
        let query = req.query;
    });

    Router  = Router.get("/marketingAnalysis/overviewFour_json", (req, res, next) => {
        res.json({
            code : 200,
            modelData : [],
            components : {}
        })
    });
    return Router;
};