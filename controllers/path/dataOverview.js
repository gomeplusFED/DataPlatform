/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/overviewAllOne",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        excel_export: false,
        date_picker_data: 1,
        filter(data, filter_key) {
            return businessRebate.businessAllOne(data);
        },
        rows: [
            ["name", "order_num", "order_amount", "shop_num", "user_num", "product_sku_num"],
            ["rebate_order_num", "rebate_amount_total", "rebate_amount_actual", "rebate_amount", "rate", "platform_amount"],
            ["name", "spu_num", "sku_num", "user_num", "amount", "amount_actual"]
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
    });

    return Router;
};
