/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 渠道分析
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/channelAnalysis");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/channelAnalysis/channelOne",
        modelName : ["ChannelAnalysis", "ChannelUserKeep", "ChannelIdNameChart"],
        platform : false,
        thirdParams : {},
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/channelAnalysis/channel_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.channelOne(data, filter_key, dates);
        },
        filter_select: [{
            title: '',
            filter_key: 'filter_key',
            groups: [{
                key: 'new_users_num',
                value: '新增用户'
            }, {
                key: 'new_account_num',
                value: '新增账户'
            }, {
                key: 'active_users_num',
                value: '活跃用户'
            }, {
                key: 'start_count',
                value: '启动次数'
            }, {
                key: 'keep_rate',
                value: '次日留存率'
            }]
        }]
    });

    Router = new api(Router,{
        router : "/channelAnalysis/channelTwo",
        modelName : ["ChannelAnalysis", "ChannelIdNameChart"],
        platform : false,
        orderParams : {},
        filter(data, filter_key, dates) {
            return filter.channelTwo(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ 'channel_name','channel_id', 'new_users_num', 'new_account_num', 'active_users_num', 'start_count', "rate"]
        ],
        cols: [
            [
                {
                    caption : '渠道名称',
                    type : 'string'
                }, {
                    caption : '渠道ID',
                    type : 'string'
                }, {
                    caption: '新增用户',
                    type: 'number'
                },  {
                    caption: '新增账户',
                    type: 'number'
                }, {
                    caption: '活跃用户',
                    type: 'number'
                }, {
                    caption: '启动次数',
                    type: 'number'
                }, {
                    caption: '付费率',
                    type: 'string'
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/channelAnalysis/channel",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新增用户",
                help : "下载app以后有过启动行为"
            },
            {
                name : "新增账户",
                help : "激活app后的注册账号或者第三方登陆行为"
            },
            {
                name : "活跃用户",
                help : "启动过应用的用户，除去重复打开人数，包括新老用户"
            },
            {
                name : "启动次数",
                help : "打开应用未为启动，完全退出或退至后台视为启动关闭"
            },
            {
                name : "付费率",
                help : "统计时间段，消费用户数/活跃用户数"
            },
            {
                name : "次日留存率",
                help : "激活第二天后仍有启动行为，例：A\B\C\D\E\F\G\H\I\J  十个人于24日注册，25号ABC三人打开了APP。  那26号显示次日留存率是24号的3/10"
            }
        ]
    });

    return Router;
};