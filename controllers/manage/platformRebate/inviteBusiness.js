/**
 * @author yanglei
 * @date 20160408
 * @fileoverview 邀请商户入驻
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/platformRebate/inviteBusiness");

module.exports = (Router) => {
    Router = new api(Router, {
        router : "/platformRebate/inviteBusinessOne",
        modelName : ["Rebate", "RebateRefund"],
        fixedParams : {
            user_party : "邀请商户入驻"
        },
        platform : false,
        date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.inviteBusinessOne(data);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/inviteBusiness/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        rows: [
            ["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count",
                "participate_user_count" ],
            ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count", "rate"],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count",
                "refund_goods_amount_actual_count"]
        ],
        cols: [
            [{
                caption: "返利计划书",
                type: "string"
            }, {
                caption: "参与商户数",
                type: "number"
            }, {
                caption: "参与商品数",
                type: "number"
            }, {
                caption: "订单数",
                type: "number"
            }, {
                caption: "用户数",
                type: "number"
            }],
            [{
                caption: "返利到账订单数",
                type: "string"
            }, {
                caption: "返利订单总金额",
                type: "string"
            }, {
                caption: "返利订单实付金额",
                type: "string"
            }, {
                caption: "返利到账金额",
                type: "string"
            }, {
                caption: "返利比率",
                type: "string"
            }],
            [{
                caption: "",
                type: "string"
            }, {
                caption: "退货商品数",
                type: "string"
            }, {
                caption: "退货商品件数",
                type: "string"
            }, {
                caption: "退货用户数",
                type: "string"
            }, {
                caption: "退货商品总金额",
                type: "string"
            }, {
                caption: "实际退货金额",
                type: "string"
            }]
        ]
    });

    Router = new api(Router, {
        router : "/platformRebate/inviteBusinessTwo",
        modelName : [ "RebatetRedencyDetails" ],
        level_select : true,
        platform : false,
        fixedParams : {
            user_party : "邀请商户入驻"
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'order_count',
                value: '订单数'
            }, {
                key: 'order_amount_count',
                value: '订单总金额'
            }, {
                key: 'goods_sku_count',
                value: '商品件数'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.inviteBusinessTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteBusinessThree",
        modelName : [ "RebatetRedencyDetails" ],
        level_select : true,
        platform : false,
        fixedParams : {
            user_party : "邀请商户入驻"
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'goods_sku_count',
                value: '商品件数'
            }, {
                key: 'goods_amount_count',
                value: '商品总金额'
            }, {
                key: 'rebate_amount_count',
                value: '返利到账金额'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.inviteBusinessThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/inviteBusinessFour",
        modelName : [ "RebatetSheduleDetails" ],
        platform : false,
        fixedParams : {
            user_party : "邀请商户入驻"
        },
        excel_export : true,
        //flexible_btn : [{
        //    content: '<a href="javascript:void(0)">导出</a>',
        //    preMethods: ['excel_export']
        //}],
        filter(data, filter_key, dates) {
            return filter.inviteBusinessFour(data);
        },
        rows : [
            [ "id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count",
                "participate_goods_count", "participate_user_count", "order_rate", "price_rate",
                "rebate_amount" ]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                }, {
                caption : "返利计划名称",
                type : "string"
            }, {
                caption : "使用方",
                type : "string"
            }, {
                caption : "有效期",
                type : "string"
            }, {
                caption : "相关流程",
                type : "string"
            }, {
                caption : "层级",
                type : "string"
            }, {
                caption : "参与商家数",
                type : "number"
            }, {
                caption : "参与商品数",
                type : "number"
            }, {
                caption : "参与用户数",
                type : "number"
            }, {
                caption : "新增订单数/订单总数",
                type : "string"
            }, {
                caption : "新增订单金额/订单总金额",
                type : "string"
            }, {
                caption : "返利到账金额",
                type : "number"
            }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/inviteBusiness/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "商品件数",
                help : "所有订单中，带返利的商品总件数，统计时间为订单生成时间"
            },
            {
                name : "返利到账订单数",
                help : "返利订单中已经返利到账的订单数，统计时间为订单返利到账时间"
            },
            {
                name : "返利到账订单总金额",
                help : "统计时间内所有已返利订单的成交金额，统计时间为订单返利到账时间"
            },
            {
                name : "返利到账订单实付金额",
                help : "统计时间内所有已返利订单的实际支付金额，统计时间为订单返利到账时间"
            },
            {
                name : "返利到账金额",
                help : "返利订单中已返利总金额，统计时间为订单返利到账时间"
            },
            {
                name : "返利比率",
                help : "返利到账金额/返利到账订单实付金额"
            },
            {
                name : "返利退货订单占比",
                help : "（例）退货商品数/（所有退货商品数，包括无返利商品），统计时间为订单生成时间"
            },
            {
                name : "返利层级分布",
                help : "返利商品件数，返利商品总金额，统计时间为订单生成时间；返利到账金额，统计时间为订单返利到账时间"
            }
        ]
    });

    return Router;
};