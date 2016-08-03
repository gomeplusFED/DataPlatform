/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 平台优惠券
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    util = require("../../../utils"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/coupon/platform");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/platformCouponOne",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/platformCoupon/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        fixedParams(query, filter_key, req, cb) {
            var endTime = new Date(query.startTime + " 23:59:59"),
                startTime = util.date(query.startTime, query.day_type);
            query.date = orm.between(startTime, endTime);
            query.type = "2";
            cb(null, query);
        },
        filter(data, filter_key, dates, filter_key2, page, params) {
            return filter.platformCouponOne(data, dates, params);
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
        router : "/coupon/platformCouponTwo",
        modelName : ["CouponGroupDate"],
        platform : false,
        params(query) {
            query.type = "2";
            return query;
        },
        filter(data, filter_key, dates) {
            return filter.platformCouponTwo(data, dates);
        }
    });

    Router = new api(Router, {
        router : "/coupon/platformCouponThree",
        modelName : ["CouponGroupPriceInterrgional"],
        platform : false,
        params(query) {
            query.type = "2";
            return query;
        },
        filter(data, filter_key, dates) {
            return filter.platformCouponThree(data);
        }
    });

    Router = new api(Router, {
        router : "/coupon/platformCouponFour",
        modelName : ["CouponGroupDate"],
        paging : true,
        platform : false,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        fixedParams(query, filter_key, req, cb) {
            query.type = "2";
            cb(null, query);
        },
        filter(data, filter_key, dates) {
            return filter.platformCouponFour(data);
        },
        rows : [
            ["date", "create_num", "create_amount", "give_num", "give_amount",
                "receive_num", "receive_amount", "used_num", "used_amount",
                "used_rate", "invalid_num", "expired_num" ]
        ],
        cols : [
            [
                {
                    caption : "日期",
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
                    caption : "发送总金额",
                    type : "number"
                },{
                    caption : "领取数量",
                    type : "number"
                },{
                    caption : "领取总金额",
                    type : "number"
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
                    type : "string"
                },{
                    caption : "作废数量",
                    type : "string"
                }
            ]
        ]
    });

    Router = new api(Router, {
        router : "/coupon/platformCouponFive",
        modelName : ["CouponInfo"],
        paging : true,
        sum : ["receive_num"],
        platform : false,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        fixedParams(query, filter_key, req, cb) {
            query.type = "2";
            if(!query.coupon_id) {
                query.created_at =
                    orm.between(
                        new Date(query.startTime + " 00:00:00").getTime()/1000,
                        new Date(query.endTime + " 23:59:59").getTime()/1000
                    );
            }
            query.date = orm.between(
                new Date(util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + " 00:00:00"),
                new Date(util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + " 23:59:59")
            );
            cb(null, query);
        },
        params(query, filter_key) {
            if(query.coupon_id) {
                delete query.created_at;
            }
            return query;
        },
        search : {
            show : true,
            title : "请输入优惠券编号：",
            key : "coupon_id"
        },
        filter(data, filter_key, dates) {
            return filter.platformCouponFive(data);
        },
        rows : [
            ["coupon_id", "coupon_name", "discount", "end_at", "create_num",
                "give_num", "receive_num", "receive_rate", "used_num",
                "used_rate", "expired_rate", "invalid_rate" ]
        ],
        cols : [
            [
                {
                    caption : "优惠卷编号",
                    type : "number"
                },{
                    caption : "名称",
                    type : "string"
                },{
                    caption : "面值",
                    type : "string"
                },{
                    caption : "有效期",
                    type : "string"
                },{
                    caption : "创建数量",
                    type : "number"
                },{
                    caption : "已发送数量",
                    type : "number"
                },{
                    caption : "已领取数量",
                    type : "number"
                },{
                    caption : "领取率",
                    type : "string"
                },{
                    caption : "已使用数量",
                    type : "number"
                },{
                    caption : "使用率",
                    type : "string"
                },{
                    caption : "过期率",
                    type : "string"
                },{
                    caption : "作废率",
                    type : "string"
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/platformCoupon/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "创建数量",
                help : "时间段内新建平台优惠券总数量"
            },
            {
                name : "创建总金额",
                help : "时间段内新建平台优惠券总金额"
            },
            {
                name : "发送数量",
                help : "时间段内平台发送优惠券总数量"
            },
            {
                name : "发送总金额",
                help : "时间段内平台优惠券发送总金额"
            },
            {
                name : "领取率",
                help : "平台优惠券被领取总数量/平台优惠券创建总数量"
            },
            {
                name : "领取数量",
                help : "平台优惠券被领取总数量"
            },
            {
                name : "领取总金额",
                help : "平台优惠券被领取总金额"
            },
            {
                name : "使用数量",
                help : "时间段内优惠券被使用总数量"
            },
            {
                name : "使用总金额",
                help : "时间段内优惠券被使用总金额"
            },
            {
                name : "使用率",
                help : "时间段内平台优惠券领取后且使用的数量/平台优惠券领取数量（包含发送数量）"
            },
            {
                name : "领取面值占比分布",
                help : "平台优惠券被领取的面值分布占比"
            },
            {
                name : "使用面值占比分布",
                help : "平台优惠券使用的面值分布占比"
            },
            {
                name : "使用率面值分布",
                help : "平台优惠券各面值使用数量/平台优惠各面值领取数量"
            },
            {
                name : "过期数量",
                help : "优惠券被领取后未使用而过期的数量"
            },
            {
                name : "作废数量",
                help : "优惠券创建后未被领取的数量"
            },
            {
                name : "列表-已发送数量",
                help : "优惠券自创建以后发送数量总和"
            },
            {
                name : "列表-已领取数量",
                help : "优惠券自创建以后领取数量总和"
            },
            {
                name : "列表-领取率",
                help : "已领取数量/创建数量"
            },
            {
                name : "列表-已使用数量",
                help : "优惠券自创建以后使用数量总和"
            },
            {
                name : "列表-使用率",
                help : "已使用数量/已领取数量"
            },
            {
                name : "列表-过期率",
                help : "优惠券过期数量/已领取数量"
            },
            {
                name : "列表-作废率",
                help : "优惠券作废数量/创建数量"
            }
        ]
    });

    return Router;
};