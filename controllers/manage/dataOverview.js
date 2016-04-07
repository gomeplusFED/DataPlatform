/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../base/api"),
    moment = require("moment"),
    businessRebate = require("../../filters/businessRebate");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/overviewAllOne",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        excel_export: false,
        date_picker: false,
        filter(data, filter_key) {
            // return businessRebate.businessAllOne(data);
        },
        rows: [
            ["today", "yesterday", "predictToday"],
        ],
        cols: [
            [{
                caption: "",
                type: "string"
            }, {
                caption: "访客数",
                type: "string"
            }, {
                caption: "浏览量",
                type: "string"
            }, {
                caption: "IP数",
                type: "string"
            }, {
                caption: "跳出率",
                type: "string"
            }, {
                caption: "新用户",
                type: "string"
            }, {
                caption: "新用户占比",
                type: "string"
            }, {
                caption: "新增用户",
                type: "string"
            }, {
                caption: "注册转化率",
                type: "string"
            }, {
                caption: "平均访问时长",
                type: "string"
            }]
        ]
    })

    return Router;
};
