/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 平台优惠券
 */
var api = require("../../../base/api"),
    orm = require("orm"),
    util = require("../../../utils"),
    filter = require("../../../filters/coupon/platform");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/platformCouponOne",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
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
            ["name", "create_coupon_num", "create_coupon_amount", "give_num", "receive_num", "receive_rate",
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
            ["date", "create_coupon_num", "create_coupon_amount", "give_num", "give_amount",
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
                    orm.between(new Date(query.startTime + " 00:00:00"), new Date(query.endTime + " 23:59:59"));
            }
            query.date = orm.between(
                new Date(util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + " 00:00:00"),
                new Date(util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + " 23:59:59")
            );
            cb(null, query);
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

    return Router;
};