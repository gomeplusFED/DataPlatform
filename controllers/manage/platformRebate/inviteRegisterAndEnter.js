/**
 * @author luoye
 * @date 20160407
 * @fileoverview 邀请注册 / 入驻
 */
var api = require("../../../base/main"),
    _ = require("lodash"),
    filter = require("../../../filters/platformRebate/inviteRegisterAndEnter");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterOne",
        modelName : ["RebateInviteOverview"],
        platform : false,
        filter(data) {
            return filter.inviteRegisterAndEnterOne(data);
        },
        rows: ["rebate_plan_count", "participate_user_count", "registered_count",
            "registered_rate", "rebate_amount_count"],
        cols: [{
            "caption": "返利计划数",
            "type": "string",
            help : "统计时间内所有平台邀请返利计划数"
        }, {
            "caption": "参与用户数",
            "type": "number",
            help : "时间段内所有参与邀请返利的用户，并且所邀请的用户注册成功或商家入驻成功"
        }, {
            "caption": "注册成功数",
            "type": "number"
        }, {
            "caption": "注册成功占比",
            "type": "number",
            help : "时间段内（返利注册成功数/总注册成功数）"
        //}, {
        //    "caption": "预计返利金额",
        //    "type": "number"
        }, {
            "caption": "返利到账金额",
            "type": "number"
        }]
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterTwo",
        //date_picker_data: 1,
        platform : false,
        modelName : [ "RebateInviteOverview" ],
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
                "type": "string",
                help : "统计时间内所有平台邀请返利计划数"
            }, {
                "caption": "参与用户数",
                "type": "number",
                help : "时间段内所有参与邀请返利的用户，并且所邀请的用户注册成功或商家入驻成功"
            }, {
                "caption": "入驻成功数",
                "type": "number"
            }, {
                "caption": "入驻成功占比",
                "type": "number",
                help : "时间段内（返利入驻成功数/总入驻成功数）"
            }, {
                "caption": "返利到账金额",
                "type": "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterThree",
        platform : false,
        modelName : ["RebateInviteTrend", "TypeFlow"],
        params(query, params) {
            params.plan_type = ["1", "2", "5"];

            return params;
        },
        secondParams() {
            return {
                type_code : [1, 2, 5],
                type : 1,
                status : 1
            };
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'count',
                value: '邀请成功数'
            }, {
                key: 'rebate',
                value: '返利到账金额'
            }]
        }],
        filter(data, query, dates) {
            return filter.inviteRegisterAndEnterThree(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteRegisterAndEnterFour",
        platform : false,
        modelName : ["RebateInvitePlanInfo", "TypeFlow"],
        secondParams() {
            return {
                type : 1,
                status : 1,
                limit : 100
            };
        },
        excel_export : true,
        paging : [true, false],
        showDayUnit : true,
        date_picker_data : 1,
        flexible_btn: [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        selectFilter(req, cb) {
            req.models.TypeFlow.find({
                type_code : [1, 2, 5],
                type : 1,
                status : 1
            }, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var  filter_select = [],
                        obj = {},
                        user_party = _.uniq(_.pluck(data, "type_code"));
                    filter_select.push({
                        title: '使用方',
                        filter_key: 'plan_type',
                        groups: [ {
                            key: user_party,
                            value: '全部使用方',
                            cell: {
                                title: '关联流程',
                                filter_key : 'rebate_type',
                                groups : [{
                                    key: '',
                                    value: '全部相关流程'
                                }]
                            }
                        }]
                    });
                    for(var key of user_party) {
                        obj[key] = {
                            key: key,
                            cell: {
                                title: '关联流程',
                                filter_key : 'rebate_type',
                                groups : [{
                                    key: '',
                                    value: '全部相关流程'
                                }]
                            }
                        }
                    }
                    for(key of data) {
                        obj[key.type_code].value = key.type_name;
                        obj[key.type_code].cell.groups.push({
                            key : key.flow_code,
                            value : key.flow_name
                        });
                    }
                    for(key in obj) {
                        filter_select[0].groups.push(obj[key]);
                    }
                    cb(null, filter_select);
                }
            });
        },
        filter(data, query) {
            return filter.inviteRegisterAndEnterFour(data, query.page);
        },
        rows : [
            ["id", "plan_name", "plan_type", "validscope_time", "rebate_type", "unique_rebate_benefit_user_num",
                "unique_rebate_invite_success_user_num", "is_over_rebate_invite_amount"]
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