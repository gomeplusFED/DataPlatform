/**
 * @author yanglei
 * @date 2016-12-02
 * @fileoverview
 */
const rows = [
    ["date", "order_num", "pay_num", "order_sum", "pay_sum", "one", "two",
        "access_product", "order_product", "pay_product", "order_product_num",
        "pay_product_num", "access_user", "access_uv_pv", "order_user", "three",
        "pay_user", "four", "five", "refund_pro_quantity", "refund_sum",
        "tuotou_pro_quantity", "tuotou_sum"]
];
const cols = [
    [{
        caption : "日期",
        type : "string"
    },{
        caption : "下单订单量",
        type : "number"
    },{
        caption : "支付订单量",
        type : "number"
    },{
        caption : "下单金额",
        type : "number"
    },{
        caption : "支付金额",
        type : "number"
    },{
        caption : "客单价",
        type : "number"
    },{
        caption : "笔单价",
        type : "number"
    },{
        caption : "访问商品数",
        type : "number"
    },{
        caption : "下单商品数",
        type : "number"
    },{
        caption : "支付商品数",
        type : "number"
    },{
        caption : "下单件数",
        type : "number"
    },{
        caption : "支付件数",
        type : "number"
    },{
        caption : "启动/访问用户数",
        type : "number"
    },{
        caption : "IPV_UV",
        type : "number"
    },{
        caption : "下单人数",
        type : "number"
    },{
        caption : "下单转化率",
        type : "string"
    },{
        caption : "支付人数",
        type : "number"
    },{
        caption : "支付转化率",
        type : "string"
    },{
        caption : "复购率",
        type : "string"
    },{
        caption : "退货商品件数",
        type : "number"
    },{
        caption : "退货金额",
        type : "number"
    },{
        caption : "妥投商品件数",
        type : "number"
    },{
        caption : "妥投金额",
        type : "number"
    }]
];
const util  = require("../../utils");
const moment = require("moment");

module.exports = {
    ordOne(data, now, query) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const newData = [];
        let zb = false;
        let qb = false;
        let last_30 = {};
        let zData = {};
        let qData = {};
        let obj = {};
        if(new Date(query.startTime) <= new Date(z) && new Date(z) <= new Date(query.endTime)) {
            zb = true;
        }
        if(new Date(query.startTime) <= new Date(q) && new Date(z) <= new Date(query.endTime)) {
            qb = true;
        }
        for(let key of source) {
            key.one = util.percentage(key.pay_sum, key.pay_user);
            key.two = util.percentage(key.pay_sum, key.pay_num);
            key.three = util.toFixed(key.order_user, key.access_uv_pv);
            key.four = util.toFixed(key.pay_user, key.access_uv_pv);
            key.five = util.toFixed(key.day30gt2_user, key.day30_user);
            key.order_sum = key.order_sum.toFixed(2);
            key.pay_sum = key.pay_sum.toFixed(2);
            key.refund_sum = key.refund_sum.toFixed(2);
            key.tuotou_sum = key.tuotou_sum.toFixed(2);
            key.date = moment(key.date).format("YYYY-MM-DD");
            if(key.date === z && key.last_30_days_avg === 1) {
                last_30 = key;
            } else if(key.date === z) {
                zData = key;
            } else if(key.date === q && key.last_30_days_avg === 0) {
                qData = key;
            }
            if(key.last_30_days_avg === 0) {
                if(key.date === z && zb) {
                    newData.push(key);
                } else if(key.date === q && qb) {
                    newData.push(key);
                } else if(key.date !== z && key.date !== q) {
                    newData.push(key);
                }
            }
        }
        last_30.date = "近30天平均";
        newData.push(last_30);
        for(let row of rows[0]) {
            if(row !== "date" && row !== "three" && row !== "four" && row !== "five") {
                if(!zData[row] && !qData[row]) {
                    obj[row] = "0.00%";
                } else {
                    obj[row] = util.toFixed(zData[row] - qData[row], qData[row]);
                }
            }
        }
        obj.date = "昨日对比";
        obj.three = "--";
        obj.four = "--";
        obj.five = "--";
        newData.push(obj);

        return util.toTable([newData], rows, cols);
    },
    orwOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.one = util.percentage(key.pay_sum, key.pay_user);
            key.two = util.percentage(key.pay_sum, key.pay_num);
            key.three = util.toFixed(key.order_user, key.access_uv_pv);
            key.four = util.toFixed(key.pay_user, key.access_uv_pv);
            key.five = util.toFixed(key.day30gt2_user, key.day30_user);
            key.order_sum = key.order_sum.toFixed(2);
            key.pay_sum = key.pay_sum.toFixed(2);
            key.refund_sum = key.refund_sum.toFixed(2);
            key.tuotou_sum = key.tuotou_sum.toFixed(2);
            const date = moment(new Date(key.date) - 7 * 24 * 60 * 60 * 1000).format("MM-DD");
            key.date = date + "-" + moment(key.date).format("MM-DD");
        }

        return util.toTable([source], rows, cols);
    },
    ormOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.one = util.percentage(key.pay_sum, key.pay_user);
            key.two = util.percentage(key.pay_sum, key.pay_num);
            key.three = util.toFixed(key.order_user, key.access_uv_pv);
            key.four = util.toFixed(key.pay_user, key.access_uv_pv);
            key.five = util.toFixed(key.day30gt2_user, key.day30_user);
            key.order_sum = key.order_sum.toFixed(2);
            key.pay_sum = key.pay_sum.toFixed(2);
            key.refund_sum = key.refund_sum.toFixed(2);
            key.tuotou_sum = key.tuotou_sum.toFixed(2);
            key.date = moment(key.date).format("MM") + "月";
        }

        return util.toTable([source], rows, cols);
    }
};