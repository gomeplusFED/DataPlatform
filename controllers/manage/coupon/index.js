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

    return Router;
};