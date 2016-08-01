/**
 * @author yanglei
 * @date 20160721
 * @fileoverview 商家优惠券
 */
var api = require("../../../base/api"),
    orm = require("orm"),
    util = require("../../../utils"),
    filter = require("../../../filters/coupon/shop");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/shopCouponOne",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        fixedParams(query, filter_key, req, cb) {
            var endTime = new Date(query.startTime + " 23:59:59"),
                startTime = util.date(query.startTime, query.day_type);
            query.date = orm.between(startTime, endTime);
            query.type = "1";
            cb(null, query);
        },
        filter(data, filter_key, dates, filter_key2, page, params) {
            return filter.shopCouponOne(data, dates, params);
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
        router : "/coupon/shopCouponTwo",
        modelName : ["CouponGroupDate"],
        platform : false,
        params(query) {
            query.type = "1";
            return query;
        },
        filter(data, filter_key, dates, filter_key2, page, parmas, type) {
            return filter.shopCouponTwo(data, dates, type);
        }
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponThree",
        modelName : ["CouponGroupPriceInterrgional"],
        platform : false,
        params(query) {
            query.type = "1";
            return query;
        },
        filter(data, filter_key, dates) {
            return filter.shopCouponThree(data);
        }
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponFour",
        modelName : ["CouponGroupDate"],
        paging : true,
        platform : false,
        order : ["-date"],
        excel_export : true,
        params(query) {
            query.type = "1";
            return query;
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopCouponFour(data);
        },
        rows : [
            ["date", "create_coupon_num", "create_coupon_amount",
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
        router : "/coupon/shopCouponFive",
        modelName : ["CouponGroupShopTop"],
        paging : true,
        date_picker_data : 1,
        showDayUnit : true,
        platform : false,
        order : ["-receive_num"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopCouponFour(data);
        },
        rows : [
            ["shop_name", "create_coupon_num", "create_coupon_amount",
                "receive_num", "receive_amount", "used_num", "used_amount",
                "used_rate", "invalid_num", "expired_num" ]
        ],
        cols : [
            [
                {
                    caption : "店铺名称",
                    type : "string"
                },{
                    caption : "创建数量",
                    type : "number"
                },{
                    caption : "创建总金额",
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

    return Router;
};