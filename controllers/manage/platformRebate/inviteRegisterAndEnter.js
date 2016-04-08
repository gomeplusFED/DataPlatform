/**
 * @author luoye
 * @date 20160407
 * @fileoverview 邀请注册、入驻
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/platformRebate");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterOne",
        modelName : ["RebateInvitepartner"],
        date_picker_data: 7,
        filter(data) {
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
        date_picker_data: 7,
        modelName : ["Rebate", "RebateRefund"],
        filter(data, filter_key) {
            return filter.inviteRegisterAndEnterTwo(data);
        },
        rows: ["rebate_plan_count", "participate_user_count", "registered_count", "registered_rate", "rebate_amount_count"],
        cols: [{
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
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterThree",
        date_picker_data: 7,
        modelName : ["Rebate", "RebateRefund"],
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'successpeople',
                value: '邀请成功'
            }, {
                key: 'amountmoney',
                value: '返利到账金额'
            }]
        }],
        filter(data, filter_key) {
            return filter.inviteRegisterAndEnterThree(data);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterFour",
        date_picker_data: 7,
        modelName : ["Rebate", "RebateRefund"],
        flexible_btn: [{
            content: '导出',
            preMethods: ['excel_export'],
            customMethods: ''
        }],
        filter(data, filter_key) {
            return filter.inviteRegisterAndEnterFour(data);
        }
    });

    return Router;
};