/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    filter = require("../../../filters/channelAnalysis/marketOperating");

module.exports = (Router) => {

    Router = new main(Router,{
        router : "/channelAnalysis/marketOperatingOne",
        modelName : ["ChaChalistChannel", "Channel"],
        platform : false,
        secondParams(query) {
            return {
                channel_id : query.channel_no
            };
        },
        selectFilter(req, cb) {
            let groups = [];
            let _obj = {};
            req.models.db1.driver.execQuery(`SELECT * FROM channel`, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        if(_obj[item.channel_type_code]) {
                            _obj[item.channel_type_code].options.push({
                                text : item.channel_name,
                                value : item.channel_id
                            });
                        } else {
                            _obj[item.channel_type_code] = {
                                text : item.channel_type,
                                value : item.channel_type_code,
                                options : [{
                                    text : item.channel_name,
                                    value : item.channel_id
                                }]
                            };
                        }
                    }
                    for(let key in _obj) {
                        groups.push(_obj[key]);
                    }
                    this.flexible_btn = [{
                        content: '<a href="javascript:void(0)">对比渠道</a>',
                        preMethods: ['show_filter'],
                        customMethods: '',
                        max: 5,
                        key: 'channel_no',
                        groups: groups
                    }];
                    cb(null, [{
                        title: '指标',
                        filter_key : 'filter_key',
                        groups: [{
                            key: 'active_pv',
                            value: '活动页面PV'
                        }, {
                            key: 'register',
                            value: '活动新增注册'
                        }, {
                            key: 'order_num',
                            value: '订单总量'
                        }, {
                            key: 'pay_num',
                            value: '支付总量'
                        }, {
                            key: 'order_num_money',
                            value: '订单总金额'
                        }, {
                            key: 'pay_num_money',
                            value: '实际支付总金额'
                        }]
                    }]);
                }
            });
        },
        filter(data, query, dates, type) {
            return filter.marketOperatingOne(data, query.filter_key, dates);
        }
    });

    return Router;
};