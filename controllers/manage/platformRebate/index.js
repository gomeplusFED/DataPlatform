/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    _ = require("lodash"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/platformRebate");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/platformRebate/platformOrderOne",
        modelName : ["Rebate", "RebateRefund"],
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        fixedParams(query, filter_key, req, cb) {
            if(query.category_id === undefined) {
                query.category_id = "all";
            }
            query.day_type = 1;
            query.user_party = "all";
            cb(null, query);
        },
        platform : false,
        //date_picker_data: 1,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/platformRebate/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.platformOrderOne(data);
        },
        rows: [
            ["name", "order_count", "rebate_order_amount_count", "participate_seller_count",
                "participate_user_count", "productSku_num"],
            ["rebate_order_count",
                //"rebate_order_amount_count", "rebate_order_amount_actual_count",
                "rebate_amount_count"
                //, "rate"
            ],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count",
                //"refund_goods_amount_actual_count"
            ]
        ],
        cols: [
            [{
                caption: "",
                type: "string"
            }, {
                caption: "订单数",
                type: "string"
            }, {
                caption: "订单总金额",
                type: "string"
            }, {
                caption: "商家数",
                type: "string"
            }, {
                caption: "用户数",
                type: "string"
            }, {
                caption: "商品件数",
                type: "string"
            }],
            [{
                caption: "返利到账订单数",
                type: "string"
            //}, {
            //    caption: "返利到账订单总金额",
            //    type: "string"
            //}, {
            //    caption: "返利到账订单实付金额",
            //    type: "string"
            }, {
                caption: "返利到账金额",
                type: "string"
            //}, {
            //    caption: "返利比率",
            //    type: "string"
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
            //}, {
            //    caption: "实际退货金额",
            //    type: "string"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderTwe",
        modelName : [ "RebateOrderTredencyDetails", "TypeFlow" ],
        orderParams : {
            type : 1,
            status : 1
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        fixedParams(query, filter_key, req, cb) {
            if(query.category_id === undefined) {
                query.category_id = "all";
            }
            query.day_type = 1;
            query.correlate_flow = "all";
            cb(null, query);
        },
        platform : false,
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
            return filter.platformOrderTwe(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderThree",
        modelName : [ "RebateTypeLevelDetails", "TypeFlow" ],
        orderParams : {
            type : 1,
            status : 1
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        fixedParams(query, filter_key, req, cb) {
            if(query.category_id === undefined) {
                query.category_id = "all";
            }
            query.day_type = 1;
            req.models.TypeFlow.find({
                type : 1,
                status : 1
            }, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var user_party = _.uniq(_.pluck(data, "type_code"));
                    query.user_party = user_party;
                    cb(null, query);
                }
            });
        },
        platform : false,
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
            return filter.platformOrderThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFour",
        modelName : [ "RebateTypeLevelDetails", "TypeFlow" ],
        orderParams : {
            type : 1,
            status : 1
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        fixedParams(query, filter_key, req, cb) {
            if(query.category_id === undefined) {
                query.category_id = "all";
            }
            query.day_type = 1;
            cb(null, query);
        },
        platform : false,
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
            return filter.platformOrderFour(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/platformOrderFive",
        modelName : [ "RebatetSheduleDetails", "TypeFlow" ],
        excel_export : true,
        platform : false,
        paging : true,
        order : ["-date"],
        showDayUnit : true,
        date_picker_data : 1,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        orderParams : {
            type : 1,
            status : 1,
            limit : 100
        },
        selectFilter(req, cb) {
            req.models.TypeFlow.find({
                type : 1,
                status : 1
            }, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [],
                        obj = {},
                        user_party = _.uniq(_.pluck(data, "type_code"));
                    filter_select.push({
                        title: '使用方',
                        filter_key: 'user_party',
                        groups : [
                            {
                                key: user_party,
                                value: '全部使用方',
                                cell: {
                                    title: '关联流程',
                                    filter_key : 'correlate_flow',
                                    groups : [{
                                        key: '',
                                        value: '全部相关流程'
                                    }]
                                }
                            }
                        ]
                    });
                    for(var key of user_party) {
                        obj[key] = {
                            value: '',
                            cell: {
                                title: '关联流程',
                                filter_key : 'correlate_flow',
                                groups : [{
                                    key: '',
                                    value: '全部相关流程'
                                }]
                            }
                        };
                    }
                    for(key of data) {
                        obj[key.type_code].value = key.type_name;
                        obj[key.type_code].key = key.type_code;
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
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.platformOrderFive(data, page);
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
        router : "/platformRebate/help",
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