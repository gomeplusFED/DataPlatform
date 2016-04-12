/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../../base/api"),
    moment = require("moment"),
    dataOverview = require("../../../filters/dataOverview");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllOne",
        modelName: ['OverviewPlatf', 'KpiValue'],
        date_picker: false,
        filter(data, filter_key) {
            return dataOverview.dataOverviewAllOne(data, filter_key);
        },
        rows : [
            ['name', 'open_total', 'open_user_total', 'open_user_avg', 'new_user',
                'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg']
        ],
        cols : [
            [{
                caption: ' ',
                type: 'string'
            }, {
                caption: '启动次数',
                type: 'number'
            },  {
                caption: '启动用户',
                type: 'number'
            },  {
                caption: '人均启动次数',
                type: 'string'
            }, {
                caption: '新用户',
                type: 'number'
            }, {
                caption: '新用户占比',
                type: 'string'
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '注册转化率',
                type: 'string'
            }, {
                caption: '每人使用时长',
                type: 'string'
            }, {
                caption: '每次使用时长',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllTwo",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        date_picker: true,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'app',
                value: '启动用户'
            }, {
                key: 'app',
                value: '启动次数'
            }, {
                key: 'app',
                value: '新用户'
            }, {
                key: 'app',
                value: '新增账户'
            }, {
                key: 'app',
                value: '注册转化率'
            }, {
                key: 'app',
                value: '每次使用时长'
            }]
        }],
        filter(data, filter_key) {
            return dataOverview.dataOverviewAllTwo(data, filter_key);
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllThree",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        date_picker: true,
        date_picker_data: 1,
        flexible_btn: [{
            content: '<a href="www.baidu.com" target="_blank">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data) {
            return dataOverview.dataOverviewAllThree(data);
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllFour",
        modelName: ["RebateShopOverview", "RebateShopRefund"],
        date_picker: true,
        date_picker_data: 1,
        flexible_btn: [{
            content: '<a href="www.baidu.com" target="_blank">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data) {
            return dataOverview.dataOverviewAllFour(data);
        }
    });

    return Router;
};
