/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 渠道分析
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/channelAnalysis");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/channelAnalysis/channelOne",
        modelName : ["NewAccount"],
        filter(data, filter_key, dates) {
            return filter.channelOne(data, filter_key, dates);
        },
        filter_select: [{
            title: '',
            filter_key: 'filter_key',
            groups: [{
                key: 'new_users',
                value: '新增用户'
            }, {
                key: 'active_users',
                value: '活跃用户'
            }, {
                key: 'start_up',
                value: '启动次数'
            }]
        }]
    });

    Router = new api(Router,{
        router : "/channelAnalysis/channelTwo",
        modelName : ["NewAccount"],
        filter(data, filter_key, dates) {
            return filter.channelTwo(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ 'channel', 'new_users', 'active_users', 'start_up', 'new_users_rate']
        ],
        cols: [
            [
                {
                    caption : '渠道',
                    type : 'string'
                }, {
                caption: '新增用户',
                type: 'number'
            }, {
                caption: '活跃用户',
                type: 'number'
            }, {
                caption: '启动次数',
                type: 'number'
            }, {
                caption: '新增用户占比',
                type: 'string'
            }
            ]
        ]
    });

    return Router;
};