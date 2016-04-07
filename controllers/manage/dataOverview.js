/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../base/api"),
    moment = require("moment"),
    dataOverview = require("../../filters/dataOverview.js");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllOne",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        excel_export: false,
        date_picker: false,
        filter_select: [{
            title: '',
            filter_key: 'filter_key',
            groups: [{
                key: 'app',
                value: '数据概览'
            }, {
                key: 'wap',
                value: '数据概览-wap'
            }]
        }],
        filter(data, filter_key) {
            return dataOverview.dataOverviewAllOne(data, filter_key);
        }
    })

    return Router;
};
