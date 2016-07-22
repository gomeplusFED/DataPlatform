/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 平台优惠券
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/coupon/platform");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/platformCouponThree",
        modelName : ["CouponGroupPriceInterrgional"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
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
        modelName : ["CouponInfo"],
        paging : true,
        platform : false,
        showDayUnit : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        params(query) {
            query.type = "2";
            return query;
        },
        search : {
            show : true,
            title : "请输入优惠券编号：",
            key : "coupon_id"
        },
        filter(data, filter_key, dates) {
            return filter.platformCouponFour(data);
        },
        rows : [
            ["coupon_id", "coupon_name", "discount", "", "create_quantity_num",
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