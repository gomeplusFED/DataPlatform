/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/coupon");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/allOne",
        modelName : ["SalesPerfTranKv"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        filter(data, filter_key, dates) {
            return filter.allOne(data);
        },
        rows: [
            ["name", ""]
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
        router : "/coupon/allThree",
        modelName : ["CouponGroupPriceInterrgional"],
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
                key: 'create_num',
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

    return Router;
};