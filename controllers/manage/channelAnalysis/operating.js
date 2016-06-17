/**
 * @author yanglei
 * @date 20160612
 * @fileoverview 渠道分析
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    util = require("../../../utils"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/channelAnalysis/operating");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/channelAnalysis/operatingOne",
        modelName : ["ChannelUserActive", "ChannelUserKeep"],
        platform : false,
        date_picker : false,
        fixedParams(query, filter_key, req, cb) {
            var _query = {},
                date = new Date().getTime(),
                qDate = util.getDate(new Date(date - 24 * 60 * 60 * 1000));
            _query.date = orm.between(new Date(qDate + " 00:00:00"), new Date(qDate + " 23:59:59"));
            _query.channel_id = query.channel_id;
            _query.day_type = 1;
            cb(null, _query);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/channelAnalysis/channelOperating_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.channelOne(data);
        },
        rows: [
            [ '0', '1', '2'],
            [ '0', '1', '2']
        ],
        cols: [
            [
                {
                    caption : '昨日活跃',
                    type : 'number'
                }, {
                    caption : '过去7日活跃',
                    type : 'number'
                }, {
                    caption: '过去30日活跃',
                    type: 'number'
                }
            ],
            [
                {
                    caption : '次日留存率',
                    type : 'string'
                }, {
                    caption : '3日留存率',
                    type : 'string'
                }, {
                    caption: '7日留存率',
                    type: 'string'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/channelAnalysis/operatingTwo",
        modelName : ["ChannelAnalysis", "ChannelUserKeep", "ChannelIdNameChart"],
        platform : false,
        thirdParams : {},
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/channelAnalysis/channel_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates, filter_key2, page, query) {
            return filter.channelTwo(data, filter_key, dates, query.channel_id);
        },
        selectFilter(req, cb) {
            var filter_select = [{
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
            }, {
                title: '对比渠道',
                filter_key: 'channel_id',
                "multi": true,
                "max": 2,
                groups: []
            }],
                groups = [];
            req.models.ChannelIdNameChart.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(var key of data) {
                        groups.push({
                            key : key.channel_id,
                            value : key.channel_name
                        })
                    }
                    filter_select[1].groups = groups;
                    cb(null, filter_select);
                }
            });
        }
    });

    Router = new api(Router,{
        router : "/channelAnalysis/operatingThree",
        modelName : ["ChannelAnalysis"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.channelThree(data);
        },
        rows: [
            [ 'date', 'new_users_num', 'new_account_num', "active_users_num", "start_count",
                "unit_use_time", "rate"]
        ],
        cols: [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '新增用户',
                    type : 'number'
                }, {
                    caption : '新增账户',
                    type : 'number'
                }, {
                    caption: '活跃用户',
                    type: 'number'
                }, {
                    caption: '启动次数',
                    type: 'number'
                }, {
                    caption: '单次使用时长',
                    type: 'number'
                }, {
                    caption: '付费率',
                    type: 'string'
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/channelAnalysis/channelOperating",
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
            },
            {
                name : "三日留存率",
                help : "激活第三天仍有启动行为，仅为注册后第三天有启动行为的"
            },
            {
                name : "七日留存",
                help : "激活第七天仍有启动行为，仅为注册后第七天有启动行为的"
            },
            {
                name : "昨日活跃",
                help : "统计该渠道当前日期前1天的使用产品用户数，去重"
            },
            {
                name : "过去7天活跃",
                help : "统计该渠道前7天的使用产品用户数，去重"
            },
            {
                name : "过去30天活跃",
                help : "统计该渠道前30天的使用产品用户数，去重"
            },
            {
                name : "单次使用时长",
                help : "用户一次启动使用时长"
            }
        ]
    });

    return Router;
};