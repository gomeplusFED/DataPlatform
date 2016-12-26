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
        params(query, params) {
            params.channel_no = params.channel_no.split(",");

            return params;
        },
        secondParams(query) {
            let channel_id = query.channel_no.split(",");
            return {
                channel_id
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

    Router = new main(Router,{
        router : "/channelAnalysis/marketOperatingTwo",
        modelName : ["ChaChalistChannel"],
        platform : false,
        paging : [true],
        excel_export : true,
        order : ["-date"],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates, type) {
            return filter.marketOperatingTwo(data);
        },
        rows : [
            ["date", "active_uv", "active_pv", "register", "rate", "order_num", "order_num_money",
                "pay_num", "pay_user", "pay_num_money"]
        ],
        cols : [
            [
                {
                    caption : "日期",
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
                    type : "number",
                    help : "通过活动带来的注册数"
                },{
                    caption : "进入商品页转化率",
                    type : "string",
                    help : "通过活动页跳转商品页的浏览人数 / 活动页浏览人数"
                },{
                    caption : "下单总量",
                    type : "number",
                    help : "活动页带来的订单总量"
                },{
                    caption : "下单总金额",
                    type : "number",
                    help : "活动订单下单总金额：商品总金额 - 所有优惠 + 运费"
                },{
                    caption : "支付总量",
                    type : "number",
                    help : "活动订单支付成功的总量"
                },{
                    caption : "支付用户数",
                    type : "number",
                    help : "支付成功订单的用户数量"
                },{
                    caption : "实际支付金额",
                    type : "number",
                    help : "活动订单的实际支付总金额：商品总金额 - 所有优惠 + 运费"
                }
            ]
        ]
    });

    return Router;
};