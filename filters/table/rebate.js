/**
 * @author yanglei
 * @date 201611230
 * @fileoverview 返利表报
 */
const util = require("../../utils");
const moment = require("moment");
const rows = [
    ["date",
        // "unique_is_rebate_order_num", "unique_is_over_rebate_order_num",
        "expect_rebate_user_num", "expect_rebate_amount", "cancel_rebate_amount",
        "is_over_rebate_order_amount", "unique_is_rebate_merchandise_num"],
    ["name", "plan_type_name", "plan_type", "rebate_type_name", "rebate_type",
        "total_unique_expect_rebate_user_num", "expect_rebate_user_num",
        "expect_rebate_amount", "cancel_rebate_amount", "is_over_rebate_order_amount",
        "total_unique_is_rebate_merchandise_num", "total_unique_is_rebate_shop_num",
        "order_create_time_min"]
];
const cols = [
    [{
        caption : "日期"
    },{
    //     caption : "累计返利订单数"
    // },{
    //     caption : "累计到账订单数"
    // },{
        caption : "累计返利参与人次"
    },{
        caption : "累计预计返利金额"
    },{
        caption : "累计取消返利金额"
    },{
        caption : "累计返利到账金额"
    },{
        caption : "累计参与商品数（未去重）"
    }],
    [{
        caption : "返利功能"
    },{
        caption : "使用方"
    },{
        caption : "使用方序号"
    },{
        caption : "关联流程"
    },{
        caption : "关联流程序号"
    },{
        caption : "累计参与人数（获利用户数）"
    },{
        caption : "累计参与人次"
    },{
        caption : "累计预计返利金额（元）"
    },{
        caption : "累计已取消返利金额(元）"
    },{
        caption : "累计到账返利总金额(元）"
    },{
        caption : "累计商品数(SKU)"
    },{
        caption : "累计参与商家数"
    },{
        caption : "最早创建日期"
    },]
];
const newRows = [
    ["date", "unique_is_rebate_order_num",
        // "unique_is_over_rebate_order_num",
        "unique_expect_rebate_user_num", "expect_rebate_amount", "cancel_rebate_amount",
        "is_over_rebate_order_amount", "unique_is_rebate_merchandise_num",
        "unique_is_rebate_shop_num"],
    ["name", "plan_type_name", "plan_type", "rebate_type_name", "rebate_type",
        "unique_expect_rebate_user_num", "expect_rebate_amount", "cancel_rebate_amount",
        "is_over_rebate_order_amount", "unique_is_rebate_merchandise_num",
        "unique_is_rebate_shop_num"]
];
const newCols = [
    [{
        caption : "日期"
    },{
        caption : "新增返利订单数"
    // },{
    //     caption : "返利到账订单数"
    },{
        caption : "参与返利人数（未去重）"
    },{
        caption : "预计返利金额"
    },{
        caption : "已取消返利金额"
    },{
        caption : "返利到账金额"
    },{
        caption : "参与商品数（未去重）"
    },{
        caption : "参与商家数（未去重）"
    }],
    [{
        caption : "返利功能"
    },{
        caption : "使用方"
    },{
        caption : "使用方序号"
    },{
        caption : "关联流程"
    },{
        caption : "关联流程序号"
    },{
        caption : "参与返利人数"
    },{
        caption : "预计返利金额（元）"
    },{
        caption : "已取消返利金额(元）"
    },{
        caption : "返利到账金额(元）"
    },{
        caption : "参与商品数（SKU）"
    },{
        caption : "参与商家数"
    }]
];

module.exports = {
    rebateOne(data) {
        let source = data.first.data[0],
            second = data.second.data[0],
            third = data.third.data[0],
            plan_type = {},
            rebate_type = {};

        second.sort((a, b) => {
            return a.plan_type - b.plan_type;
        });

        for(let key of third) {
            plan_type[key.type_code] = key.type_name;
            rebate_type[key.flow_code] = key.flow_name;
        }

        for(let key of source) {
            key.expect_rebate_amount = (key.expect_rebate_amount / 100).toFixed(2);
            key.cancel_rebate_amount = (key.cancel_rebate_amount / 100).toFixed(2);
            key.is_over_rebate_order_amount = (key.is_over_rebate_order_amount / 100).toFixed(2);
            key.date = moment(key.date).format("YYYY-MM-DD");
        }

        for(let key of second) {
            key.order_create_time_min = moment(new Date(key.order_create_time_min)).format("YYYY-MM-DD");
            key.plan_type_name = plan_type[key.plan_type] || "";
            key.rebate_type_name = rebate_type[key.rebate_type] || "";
            key.expect_rebate_amount = (key.expect_rebate_amount / 100).toFixed(2);
            key.cancel_rebate_amount = (key.cancel_rebate_amount / 100).toFixed(2);
            key.is_over_rebate_order_amount = (key.is_over_rebate_order_amount / 100).toFixed(2);
            if(rebate_type[key.rebate_type]) {
                if(rebate_type[key.rebate_type].indexOf("-") === -1) {
                    key.name = rebate_type[key.rebate_type];
                } else {
                    key.name = rebate_type[key.rebate_type].substr(0, rebate_type[key.rebate_type].indexOf("-"));
                }
            } else {
                key.name = "";
            }
        }

        return util.toTable([source, second], rows, cols);
    },
    rebateNewOne(data) {
        let source = data.first.data[0],
            second = data.second.data[0],
            third = data.third.data[0],
            plan_type = {},
            rebate_type = {};

        second.sort((a, b) => {
            return a.plan_type - b.plan_type;
        });

        for(let key of third) {
            plan_type[key.type_code] = key.type_name;
            rebate_type[key.flow_code] = key.flow_name;
        }

        for(let key of source) {
            key.expect_rebate_amount = (key.expect_rebate_amount / 100).toFixed(2);
            key.cancel_rebate_amount = (key.cancel_rebate_amount / 100).toFixed(2);
            key.is_over_rebate_order_amount = (key.is_over_rebate_order_amount / 100).toFixed(2);
            key.date = moment(key.date).format("YYYY-MM-DD");
        }

        for(let key of second) {
            key.plan_type_name = plan_type[key.plan_type] || "";
            key.rebate_type_name = rebate_type[key.rebate_type] || "";
            key.expect_rebate_amount = (key.expect_rebate_amount / 100).toFixed(2);
            key.cancel_rebate_amount = (key.cancel_rebate_amount / 100).toFixed(2);
            key.is_over_rebate_order_amount = (key.is_over_rebate_order_amount / 100).toFixed(2);
            if(rebate_type[key.rebate_type]) {
                if(rebate_type[key.rebate_type].indexOf("-") === -1) {
                    key.name = rebate_type[key.rebate_type];
                } else {
                    key.name = rebate_type[key.rebate_type].substr(0, rebate_type[key.rebate_type].indexOf("-"));
                }
            } else {
                key.name = "";
            }
        }

        return util.toTable([source, second], newRows, newCols);
    }
};