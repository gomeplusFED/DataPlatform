/**
 * @author yanglei
 * @date 2016-12-09
 * @fileoverview
 */
const util = require("../../utils");
const moment = require("moment");
const rows = [
    ["date", "total_vshop_num", "new_vshop_num", "visited_vshop_num", "ordered_vshop_num",
        "paid_vshop_num", "ordered_user_num", "paid_user_num", "ordered_order_num", "paid_order_num",
        "ordered_item_num", "paid_item_num", "ordered_quantity", "paid_quantity", "delivery_amount",
        "delivery_item_quantity", "ordered_item_num_total", "ordered_quantity_toatl",
        "delivery_item_quantity_total", "delivery_amount_total"]
];
const cols = [
    [
        {
            caption : "日期",
            type : "string"
        },{
            caption : "累计美店数",
            type : "number"
        },{
            caption : "新增美店",
            type : "number"
        },{
            caption : "被访问美店数",
            type : "number"
        },{
            caption : "下单美店数",
            type : "number"
        },{
            caption : "支付美店数",
            type : "number"
        },{
            caption : "美店下单人数",
            type : "number"
        },{
            caption : "美店支付人数",
            type : "number"
        },{
            caption : "美店下单金额",
            type : "number"
        },{
            caption : "美店支付金额",
            type : "number"
        },{
            caption : "美店下单商品数",
            type : "number"
        },{
            caption : "美店支付商品数",
            type : "number"
        },{
            caption : "美店下单商品件数",
            type : "number"
        },{
            caption : "美店支付商品件数",
            type : "number"
        },{
            caption : "美店妥投金额",
            type : "number"
        },{
            caption : "美店妥投商品件数",
            type : "number"
        },{
            caption : "美店累计分销商品",
            type : "number"
        },{
            caption : "美店累计分销金额",
            type : "number"
        },{
            caption : "美店累计妥投商品件数",
            type : "number"
        },{
            caption : "美店累计妥投金额",
            type : "number"
        }
    ]
];

module.exports = {
    dayOne(data, now, query) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        let zObj = {};
        let qObj = {};
        let zb = false;
        let qb = false;
        const newData = [];
        const start = new Date(query.startTime);
        const end = new Date(query.endTime);
        if(start <= new Date(z) && new Date(z) <= end) {
            zb = true;
        }
        if(start <= new Date(q) && new Date(q) <= end) {
            qb = true;
        }
        for(let key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.ordered_amount = key.ordered_amount.toFixed(2);
            key.paid_amount = key.paid_amount.toFixed(2);
            key.delivery_amount = key.delivery_amount.toFixed(2);
            key.delivery_item_quantity = key.delivery_item_quantity.toFixed(2);
            key.ordered_quantity_toatl = key.ordered_quantity_toatl.toFixed(2);
            key.delivery_amount_total = key.delivery_amount_total.toFixed(2);
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
        }
        const obj = {};
        for(let row of rows[0]) {
            if(row !== "date") {
                obj[row] = util.toFixed(
                    (zObj[row] || 0) - (qObj[row] || 0),
                    qObj[row] || 0
                );
            }
        }
    }
};