/**
 * @author luoye
 * @date 20160407
 * @fileoverview 数据概览
 */
var util = require("../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    dataOverviewAllOne(data, filter_key) {
        return [{
            data: {},
            rows: ["", "uv", "pv", ""],
            cols: [{
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

        }]
    }
};
