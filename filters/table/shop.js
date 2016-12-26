/**
 * @author yanglei
 * @date 2016-12-08
 * @fileoverview
 */
const rows = [
    ["date", "shop_register", "shop_success", "shop_run", "shop_visit", "shop_order",
        "shop_pay", "shop_return", "shop_share"]
];
const cols = [
    [
        {
            caption : "日期",
            type : "string"
        },{
            caption : "新增注册店铺数",
            type : "number",
            help : "统计日期内，新提交审核的店铺数"
        },{
            caption : "成功入驻店铺数",
            type : "number",
            help : "统计日期内，待审核店铺被审核通过的数量"
        },{
            caption : "当前运营店铺数",
            type : "number",
            help : "当前平台入驻并处于营运状态的店铺数"
        },{
            caption : "被访问店铺数",
            type : "number",
            help : "统计日期内，店铺的店铺详情页、商品详情页被访问的店铺数（去重）"
        },{
            caption : "下单店铺数",
            type : "number",
            help : "统计日期内，创建订单的店铺数"
        },{
            caption : "支付店铺数",
            type : "number",
            help : "统计日期内，支付订单的店铺数"
        },{
            caption : "退货店铺数",
            type : "number",
            help : "统计日期内，拒收入库和退货订单入库的所涉及的店铺数"
        },{
            caption : "被分享店铺数",
            type : "number",
            help : "统计时间内，店铺详情页被分享的店铺数"
        }
    ]
];
const util = require("../../utils");
const moment = require("moment");

module.exports = {
    dayOne(data, query, now) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        let zObj = {};
        let qObj = {};
        let zb = false;
        let qb = false;
        const newData = [];
        const obj = {};
        if(new Date(query.startTime) <= new Date(z) && new Date(z) <= new Date(query.endTime)) {
            zb = true;
        }
        if(new Date(query.startTime) <= new Date(q) && new Date(q) <= new Date(query.endTime)) {
            qb = true;
        }
        for(let key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
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