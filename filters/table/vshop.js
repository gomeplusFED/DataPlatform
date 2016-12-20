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
            type : "number",
            help : "截止到统计日期平台累计开通的美店数"
        },{
            caption : "新增美店",
            type : "number",
            help : "统计日期内，新开通的美店数"
        },{
            caption : "被访问美店数",
            type : "number",
            help : "统计日期内，被访问的美店数（美店店铺详情页和美店分销的商品详情页）"
        },{
            caption : "下单美店数",
            type : "number",
            help : "统计日期内，创建订单的美店数"
        },{
            caption : "支付美店数",
            type : "number",
            help : "统计日期内，支付订单的美店数"
        },{
            caption : "美店下单人数",
            type : "number",
            help : "统计日期内，在美店创建订单的人数"
        },{
            caption : "美店支付人数",
            type : "number",
            help : "统计日期内，在美店支付订单的人数"
        },{
            caption : "美店下单金额",
            type : "number",
            help : "统计日期内，在美店新创建订单的金额"
        },{
            caption : "美店支付金额",
            type : "number",
            help : "统计日期内，在美店支付订单的金额"
        },{
            caption : "美店下单商品数",
            type : "number",
            help : "统计日期内，在美店创建订单中的商品数"
        },{
            caption : "美店支付商品数",
            type : "number",
            help : "统计日期内，在美店支付订单中的商品数"
        },{
            caption : "美店下单商品件数",
            type : "number",
            help : "统计日期内，在美店下单的商品件数"
        },{
            caption : "美店支付商品件数",
            type : "number",
            help : "统计日期内，在美店支付的商品件数"
        },{
            caption : "美店妥投金额",
            type : "number",
            help : "统计日期内，美店订单中收货成功的商品件数"
        },{
            caption : "美店妥投商品件数",
            type : "number",
            help : "统计日期内，美店订单中收货成功订单的金额"
        },{
            caption : "美店累计分销商品件数",
            type : "number",
            help : "截止到当前日期，美店累计创建订单中的商品件数"
        },{
            caption : "美店累计分销金额",
            type : "number",
            help : "截止到当前日期，美店累计创建订单中的订单金额"
        },{
            caption : "美店累计妥投商品件数",
            type : "number",
            help : "截止到当前日期，美店累计收货成功订单中的商品件数"
        },{
            caption : "美店累计妥投金额",
            type : "number",
            help : "截止到当前日期，美店累计收货成功订单中的金额"
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
        obj.date = "昨日对比";
        newData.push(obj);

        return util.toTable([newData], rows, cols);
    },
    weekOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.date = `${moment(key.date - 6 * 24 * 60 * 60 * 1000).format("MM.DD")}-${moment(key.date).format("MM.DD")}`;
        }

        return util.toTable([source], rows, cols);
    },
    monthOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.date = `${moment(key.date).format("MM")}月`;
        }

        return util.toTable([source], rows, cols);
    }
};