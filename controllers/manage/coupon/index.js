/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    util = require("../../../utils"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/coupon");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/allOne",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/coupon/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        fixedParams(query, filter_key, req, cb) {
            var endTime = new Date(query.startTime + " 23:59:59"),
                startTime = util.date(query.startTime, query.day_type);

            query.date = orm.between(startTime, endTime);
            cb(null, query);
        },
        filter(data, filter_key, dates, filter_key2, page, params) {
            return filter.allOne(data, dates, params);
        },
        rows: [
            ["name", "create_num", "create_amount", "give_num", "receive_num", "receive_rate",
                "used_num", "used_amount", "used_rate", "invalid_num"]
        ],
        cols: [
            [
                {
                    caption : "",
                    type : "string"
                },{
                    caption : "创建数量",
                    type : "number"
                },{
                    caption : "创建总金额",
                    type : "number"
                },{
                    caption : "发送数量",
                    type : "number"
                },{
                    caption : "领取数量",
                    type : "number"
                },{
                    caption : "领取率",
                    type : "string"
                },{
                    caption : "使用数量",
                    type : "number"
                },{
                    caption : "使用总金额",
                    type : "number"
                },{
                    caption : "使用率",
                    type : "string"
                },{
                    caption : "过期数量",
                    type : "number"
                }
            ]
        ]
    });

    Router = new api(Router, {
        router : "/coupon/allTwo",
        modelName : ["CouponGroupDate"],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.allTwo(data, dates);
        }
    });

    Router = new api(Router, {
        router : "/coupon/allThree",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        filter(data, filter_key, dates) {
            return filter.allThree(data, filter_key);
        },
        filter_select: [{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'create_coupon_num',
                value: '平台商家创建占比'
            }, {
                key: 'receive_num',
                value: '平台商家领取占比'
            }, {
                key: 'used_num',
                value: '平台商家使用占比'
            }]
        }]
    });

    Router = new help(Router, {
        router : "/coupon/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "创建数量",
                help : "时间段内新建优惠券总数量（平台+商家）"
            },
            {
                name : "创建总金额",
                help : "时间段内新建优惠券总金额（平台+商家）"
            },
            {
                name : "发放数量",
                help : "时间段内发放优惠券总数量（平台+商家）"
            },
            {
                name : "领取数量",
                help : "时间段内优惠券被领取总数量（平台+商家）"
            },
            {
                name : "使用数量",
                help : "时间段内优惠券被使用总数量（平台+商家）"
            },
            {
                name : "使用总金额",
                help : "时间段内优惠券被使用总金额（平台+商家）"
            },
            {
                name : "过期数量",
                help : "优惠券被领取后未使用而过期的数量"
            },
            {
                name : "平台商家创建占比",
                help : "平台创建数量/总创建优惠券数量，商家创建数量/总创建优惠券数量"
            },
            {
                name : "平台商家领取占比",
                help : "平台领取数量/总领取优惠券数量，商家领取数量/总领取优惠券数量"
            },
            {
                name : "平台商家使用占比",
                help : "平台使用数量/总使用优惠券数量，商家使用数量/总使用优惠券数量"
            }
        ]
    });

    return Router;
};