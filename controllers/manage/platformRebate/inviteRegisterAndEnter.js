/**
 * @author luoye
 * @date 20160407
 * @fileoverview 邀请注册 / 入驻
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/platformRebate/inviteRegisterAndEnter");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterOne",
        modelName : ["RebateInvitepartner"],
        date_picker_data: 1,
        platform : false,
        filter(data, filter_key, dates) {
            return filter.inviteRegisterAndEnterOne(data);
        },
        rows: ["rebate_plan_count", "participate_user_count", "registered_count", "registered_rate", "rebate_amount_count"],
        cols: [{
            "caption": "返利计划数",
            "type": "string"
        }, {
            "caption": "参与用户数",
            "type": "number"
        }, {
            "caption": "注册成功数",
            "type": "number"
        }, {
            "caption": "注册成功占比",
            "type": "number"
        }, {
            "caption": "返利到账金额",
            "type": "number"
        }]
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterTwo",
        date_picker_data: 1,
        platform : false,
        modelName : [ "RebatetInviteseller" ],
        filter(data, filter_key, dates) {
            return filter.inviteRegisterAndEnterTwo(data);
        },
        rows: [
            ["rebate_plan_count", "participate_user_count", "registered_count", "registered_rate",
            "rebate_amount_count"]
        ],
        cols: [
            [{
                "caption": "返利计划数",
                "type": "string"
            }, {
                "caption": "参与用户数",
                "type": "number"
            }, {
                "caption": "入驻成功数",
                "type": "number"
            }, {
                "caption": "入驻成功占比",
                "type": "number"
            }, {
                "caption": "返利到账金额",
                "type": "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterThree",
        platform : false,
        modelName : ["RebatetRegisterTrendency"],
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'registered_count',
                value: '邀请成功'
            }, {
                key: 'rebate_amount_count',
                value: '返利到账金额'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.inviteRegisterAndEnterThree(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterFour",
        platform : false,
        modelName : ["RebatetRegisterSheduleDetails"],
        flexible_btn: [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter_select: [{
            title: '使用方',
            filter_key: 'user_party',
            groups: [{
                key: '单项单级返利',
                value: '单项单级返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '固定返利',
                        value: '固定返利'
                    },{
                        key: '比例返利',
                        value: '比例返利'
                    }]
                }
            }, {
                key: '平台基础返利',
                value: '平台基础返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '分享购买',
                        value: '分享购买'
                    },{
                        key: '邀请好友-购买返利',
                        value: '邀请好友-购买返利'
                    },{
                        key: '邀请好友-固定返利',
                        value: '邀请好友-固定返利'
                    }]
                }
            }, {
                key: '平台促销返利',
                value: '平台促销返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '分享购买',
                        value: '分享购买'
                    },{
                        key: '邀请好友-购买返利',
                        value: '邀请好友-购买返利'
                    },{
                        key: '邀请好友-固定返利',
                        value: '邀请好友-固定返利'
                    }]
                }
            }, {
                key: '邀请商家入驻返利',
                value: '邀请商家入驻返利',
                cell: {
                    title: '关联流程',
                    filter_key : 'correlate_flow',
                    groups : [{
                        key: '固定返利',
                        value: '固定返利'
                    }, {
                        key: '分享购买',
                        value: '分享购买'
                    }]
                }
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.inviteRegisterAndEnterFour(data);
        },
        rows : [
            ["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "participate_user_count",
                "registered_count", "rebate_amount_count"]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                },{
                    caption : "返利计划名称",
                    type : "string"
                },{
                    caption : "使用方",
                    type : "string"
                },{
                    caption : "有效期",
                    type : "string"
                },{
                    caption : "相关流程",
                    type : "string"
                },{
                    caption : "参与用户数",
                    type : "number"
                },{
                    caption : "用户注册成功数(商户入驻成功数)",
                    type : "number"
                },{
                    caption : "返利到账金额",
                    type : "number"
                }
            ]
        ]
    });

    return Router;
};