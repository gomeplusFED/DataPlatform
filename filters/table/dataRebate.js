/**
 * @author yanglei
 * @date 2016-12-12
 * @fileoverview
 */
const moment = require("moment");
const util = require("../../utils");
const rows = [
    ["date", "unique_plat_order_num", "unique_is_rebate_order_num", "one", "unique_active_users_num",
        "unique_is_rebate_user_num", "two", "is_rebate_fee", "cancel_is_rebate_fee", "expect_rebate_amount",
        "cancel_rebate_amount", "unique_is_rebate_merchandise_num", "unique_is_rebate_shop_num",
        "unique_is_over_rebate_order_num", "is_over_rebate_order_amount", "history_is_rebate_order_num",
        "history_is_over_rebate_order_num", "history_expect_rebate_user_num", "history_expect_rebate_amount",
        "history_cancel_rebate_amount", "history_is_over_rebate_order_amount"]
];
const cols = [
    [
        {
            caption : "日期",
            type : "string"
        },{
            caption : "平台新增下单",
            type : "number",
            help : "统计日期内，新创建的订单数"
        },{
            caption : "新增返利订单数",
            type : "number",
            help : "统计日期内，新增返利订单的数（订单状态为下单）"
        },{
            caption : "新增返利订单数占比",
            type : "string",
            help : "统计日期内，新增返利订单量/平台新增订单数x100%"
        },{
            caption : "活跃用户量",
            type : "number",
            help : "统计日期内，pc端访问人数+APP活跃用户量+H5站访问人数"
        },{
            caption : "参与返利人数",
            type : "number",
            help : "统计日期内获得预计返利的人数"
        },{
            caption : "返利参与人数占比",
            type : "string",
            help : "参与返利人数/活跃用户量x100%"
        },{
            caption : "返利订单总金额",
            type : "number",
            help : "统计日期内，创建返利订单的总金额(订单状态为下单)"
        },{
            caption : "已取消返利订单总金额",
            type : "number",
            help : "统计日期内，创建返利订单中被取消的订单的金额"
        },{
            caption : "预计返利金额",
            type : "number",
            help : "统计日期内，创建返利订单中返利的金额"
        },{
            caption : "已取消返利金额",
            type : "number",
            help : "统计日期内，创建返利订单中被取消的订单涉及的返利金额"
        },{
            caption : "参与返利商品数",
            type : "number",
            help : "统计日期内，创建的返利订单中涉及的商品数（sku）"
        },{
            caption : "参与商家数",
            type : "number",
            help : "统计日期内，创建的返利订单中涉及的商家数"
        },{
            caption : "返利到账订单数",
            type : "number",
            help : "统计日期内，创建的返利订单中妥投+7的订单数"
        },{
            caption : "返利到账金额",
            type : "number",
            help : "统计日期内，创建的返利订单中妥投+7的返利金额"
        },{
            caption : "累计返利订单数",
            type : "number",
            help : "截止到目前，平台创建的累计返利订单数（订单状态下单）"
        },{
            caption : "累计到账订单数",
            type : "number",
            help : "截止到目前，平台创建的累计返利订单中妥投+7的订单数"
        },{
            caption : "累计返利参与人数",
            type : "number",
            help : "截止到目前，累积获得预计返利的人数（去重）"
        },{
            caption : "累计预计返利金额",
            type : "number",
            help : "截止到目前，平台创建的返利订单数累计的返利金额"
        },{
            caption : "累计取消返利金额",
            type : "number",
            help : "截止到目前，平台创建的返利订单中累计取消的返利金额"
        },{
            caption : "累计返利到账金额",
            type : "number",
            help : "截止到目前，平台创建的返利订单中妥投+7的订单中的返利金额"
        }
    ]
];

module.exports = {
    dayOne(data, now, query) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const start = new Date(query.startTime);
        const end = new Date(query.endTime);
        let zObj = {};
        let qObj = {};
        let zb = false;
        let qb = false;
        let obj = {};
        const newData = [];
        if(start <= new Date(z) && new Date(z) <= end) {
            zb = true;
        }
        if(start <= new Date(q) && new Date(q) <= end) {
            qb = true;
        }
        for(let key of source) {
            key.one = util.toFixed(key.unique_is_rebate_order_num, key.history_is_rebate_order_num);
            key.two = util.toFixed(key.unique_is_rebate_user_num, key.history_expect_rebate_user_dis);
            key.is_rebate_fee = key.is_rebate_fee.toFixed(2);
            key.cancel_is_rebate_fee = key.cancel_is_rebate_fee.toFixed(2);
            key.expect_rebate_amount = key.expect_rebate_amount.toFixed(2);
            key.cancel_rebate_amount = key.cancel_rebate_amount.toFixed(2);
            key.is_over_rebate_order_amount = key.is_over_rebate_order_amount.toFixed(2);
            key.history_expect_rebate_amount = key.history_expect_rebate_amount.toFixed(2);
            key.history_cancel_rebate_amount = key.history_cancel_rebate_amount.toFixed(2);
            key.history_is_over_rebate_order_amount = key.history_is_over_rebate_order_amount.toFixed(2);
            key.date = moment(key.data).format("YYYY-MM-DD");
            if(key.day_type === 1) {
                if(key.date === z) {
                    zObj = key;
                    if(zb) {
                        newData.push(key);
                    }
                } else if(key.date === q) {
                    qObj = key;
                    if(qb) {
                        newData.push(key);
                    }
                } else {
                    newData.push(key);
                }
            } else {
                if(key.date === z) {
                    obj = key;
                }
            }
        }
        obj.date = "近30天平均";
        obj.one = "--";
        obj.two = "--";
        const one = {};
        for(let row of rows[0]) {
            if(row !== "date" && row !== "one" && row !== "two") {
                obj[row] = obj[row] || 0;
                one[row] = util.toFixed(
                    (zObj[row] || 0) - (qObj[row] || 0),
                    qObj[row] || 0
                );
            }
        }
        one.date = "昨日对比";
        one.one = "--";
        one.two = "--";
        newData.push(obj);
        newData.push(one);

        return util.toTable([newData], rows, cols);
    },
    weekOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.one = util.toFixed(key.unique_is_rebate_order_num, key.history_is_rebate_order_num);
            key.two = util.toFixed(key.unique_is_rebate_user_num, key.history_expect_rebate_user_dis);
            key.is_rebate_fee = key.is_rebate_fee.toFixed(2);
            key.cancel_is_rebate_fee = key.cancel_is_rebate_fee.toFixed(2);
            key.expect_rebate_amount = key.expect_rebate_amount.toFixed(2);
            key.cancel_rebate_amount = key.cancel_rebate_amount.toFixed(2);
            key.is_over_rebate_order_amount = key.is_over_rebate_order_amount.toFixed(2);
            key.history_expect_rebate_amount = key.history_expect_rebate_amount.toFixed(2);
            key.history_cancel_rebate_amount = key.history_cancel_rebate_amount.toFixed(2);
            key.history_is_over_rebate_order_amount = key.history_is_over_rebate_order_amount.toFixed(2);
            key.date = `${moment(key.date - 6 * 24 * 60 * 60 * 1000).format("MM-DD")}-${moment(key.date).format("MM-DD")}`;
        }

        return util.toTable([source], rows, cols);
    },
    monthOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.one = util.toFixed(key.unique_is_rebate_order_num, key.history_is_rebate_order_num);
            key.two = util.toFixed(key.unique_is_rebate_user_num, key.history_expect_rebate_user_dis);
            key.is_rebate_fee = key.is_rebate_fee.toFixed(2);
            key.cancel_is_rebate_fee = key.cancel_is_rebate_fee.toFixed(2);
            key.expect_rebate_amount = key.expect_rebate_amount.toFixed(2);
            key.cancel_rebate_amount = key.cancel_rebate_amount.toFixed(2);
            key.is_over_rebate_order_amount = key.is_over_rebate_order_amount.toFixed(2);
            key.history_expect_rebate_amount = key.history_expect_rebate_amount.toFixed(2);
            key.history_cancel_rebate_amount = key.history_cancel_rebate_amount.toFixed(2);
            key.history_is_over_rebate_order_amount = key.history_is_over_rebate_order_amount.toFixed(2);
            key.date = `${moment(key.date).format("MM")}月`;
        }

        return util.toTable([source], rows, cols);
    }
};