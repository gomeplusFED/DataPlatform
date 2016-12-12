/**
 * @author yanglei
 * @date 2016-12-12
 * @fileoverview
 */
const moment = require("moment");
const util = require("../../utils");
const rows = [
    ["date", "unique_plat_order_num", "unique_is_rebate_order_num", "one", "unique_active_users_num",
        "unique_is_rebate_user_num", "two", "is_rebate_fee", ""]
];
const cols = [
    [
        {
            caption : "日期",
            type : "string"
        },{
            caption : "平台新增下单",
            type : "number"
        },{
            caption : "新增返利订单数",
            type : "number"
        },{
            caption : "新增返利订单数占比",
            type : "string"
        },{
            caption : "活跃用户量",
            type : "number"
        },{
            caption : "参与返利人数",
            type : "number"
        },{
            caption : "返利参与人数占比",
            type : "string"
        },{
            caption : "返利订单总金额",
            type : "number"
        },{
            caption : "已取消返利订单总金额",
            type : "number"
        },{
            caption : "预计返利金额",
            type : "number"
        },{
            caption : "已取消返利金额",
            type : "number"
        },{
            caption : "参与返利商品数",
            type : "number"
        },{
            caption : "参与商家数",
            type : "number"
        },{
            caption : "返利到账订单数",
            type : "number"
        },{
            caption : "返利到账金额",
            type : "number"
        },{
            caption : "累计返利订单数",
            type : "number"
        },{
            caption : "累计到账订单数",
            type : "number"
        },{
            caption : "累计返利参与人数（未去重）",
            type : "number"
        },{
            caption : "累计预计返利金额",
            type : "number"
        },{
            caption : "累计取消返利金额",
            type : "number"
        },{
            caption : "累计返利到账金额",
            type : "number"
        },{
            caption : "累计参与商品数（SKU）",
            type : "number"
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
        if(start <= new Date(z) && new Date(z) <= end) {
            zb = true;
        }
        if(start <= new Date(q) && new Date(q) <= end) {
            qb = true;
        }
        for(let key of source) {

        }
    }
};