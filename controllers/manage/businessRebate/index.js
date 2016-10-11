/**
 * @author yanglei
 * @date 201600405
 * @fileoverview 商家返利汇总
 */
var api = require("../../../base/main"),
    util = require("../../../utils"),
    _ = require("lodash"),
    businessRebate = require("../../../filters/businessRebate");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/businessRebate/businessAllOne",
        modelName: ["RebateShopMerchantsetupOverview"],
        platform : false,
        params(query, params, data, dates) {
            let date = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000));

            return {
                day_type : 1,
                date : dates.concat(date),
                type : "ALL"
            };
        },
        filter(data,query, dates) {
            return businessRebate.businessAllOne(data, dates);
        },
        rows: [
            [ "name", "order_num", "order_amount", "shop_num", "buyer_num",
                "product_quantity", "canceled_order_num" ],
            [ "plan_rebate_amount", "plan_rebate_user_num", "canceled_rebate_amount",
                "rebate2account_order_num", "rebate2account_amount", "rebate2platform_amount" ],
            [ "name", "return_items_num", "return_items_quantity", "return_items_user_num",
                "return_items_amount" ]
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
                caption: "购买用户数",
                type: "string"
            }, {
                caption: "商品件数",
                type: "string"
            }, {
                caption: "取消订单数",
                type: "string"
            }],
            [{
                caption: "预计返利金额",
                type: "string"
            }, {
                caption: "预计获利人次",
                type: "string"
            }, {
                caption: "已取消返利金额",
                type: "string"
            }, {
                caption: "返利到账订单数",
                type: "string"
            }, {
                caption: "返利到账金额",
                type: "string"
            }, {
                caption: "平台到账金额",
                type: "string",
                help : "时间段内商家设置返利中平台到账总金额，统计时间为订单返利到账时间"
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
            }]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllTwo",
        modelName : [ "RebateShopOrderTredency", "TypeFlow" ],
        params(query, params) {
            params.category_id = query.category_id || "all";
            params.day_type = 1;
            params.type = "all";

            return params;
        },
        secondParams() {
            return {
                type : 2,
                type_code : 3,
                status : 1
            };
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'order_num',
                value: '订单数'
            }, {
                key: 'order_amount',
                value: '订单总金额'
            }, {
                key: 'item_quantity',
                value: '商品件数'
            }, {
                key: 'canceled_order_num',
                value: '取消订单数'
            }]
        }],
        filter(data, query, dates) {
            return businessRebate.businessAllTwe(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllThree",
        modelName : [ "RebateShopRebatelevelDistribution", "TypeFlow" ],
        params(query, params) {
            params.day_type = 1;
            params.category_id = params.category_id || "all";
            params.type = "all";

            return params;
        },
        secondParams() {
            return {
                type : 2,
                type_code : 3,
                status : 1
            };
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        platform : false,
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'product_sku_num',
                    value: '商品件数'
                }, {
                    key: 'item_amount',
                    value: '商品总金额'
                }, {
                    key: 'rebate_amount',
                    value: '返利到账金额'
                }, {
                    key: 'order_num',
                    value: '订单数'
                }]
            }
        ],
        filter(data, query) {
            return businessRebate.businessAllThree(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllFour",
        modelName : [ "RebateShopRebatetypeDistribution", "TypeFlow" ],
        params(query, params) {
            if(query.category_id === undefined) {
                params.category_id = "all";
            }
            params.day_type = 1;

            return params;
        },
        secondParams() {
            return {
                type : 2,
                type_code : 3,
                status : 1
            };
        },
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        platform : false,
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'product_sku_num',
                    value: '商品件数'
                }, {
                    key: 'item_amount',
                    value: '商品总金额'
                }, {
                    key: 'rebate_amount',
                    value: '返利到账金额'
                }, {
                    key: 'order_num',
                    value: '订单数'
                }]
            }
        ],
        filter(data, query, dates) {
            return businessRebate.businessAllFour(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllFive",
        modelName : [ "RebateShopTop" ],
        showDayUnit : true,
        date_picker_data : 1,
        platform : false,
        paging : [true],
        order : ["-order_num"],
        filter(data, query) {
            return businessRebate.businessAllFive(data, query.page);
        },
        rows : [
            [ "id", "shop_name", "plan_num", "participated_item_num", "buyer_num",
                "pay_rate", "pay_price_rate",
                "plan_rebate_amount", "rebate2account_amount", "rebate2platform_amount" ]
        ],
        cols : [
            [
                {
                    caption : "排名",
                    type : "number"
                },{
                    caption : "商家名称",
                    type : "string"
                },{
                    caption : "计划数",
                    type : "number"
                },{
                    caption : "参与商品数",
                    type : "number"
                },{
                    caption : "参与用户数",
                    type : "number"
                },{
                    caption : "新增订单数/订单总数",
                    type : "string"
                },{
                    caption : "新增订单金额/订单总金额",
                    type : "string"
                },{
                    caption : "预计返利金额",
                    type : "number"
                },{
                    caption : "返利到账金额",
                    type : "number"
                },{
                    caption : "平台到账金额",
                    type : "number",
                    help : "时间段内商家设置返利中平台到账总金额，统计时间为订单返利到账时间"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllSix",
        modelName : [ "RebateShopPlanTop", "TypeFlow" ],
        secondParams() {
            return {
                type : 2,
                type_code : 3,
                status : 1,
                limit : 100
            };
        },
        platform : false,
        control_table_col : true,
        paging : [true, false],
        procedure : [
            [{
                find : "params",
                offset : "offset",
                limit : "limit",
                order : ["-order_num"],
                run : ""
            },{
                count : ""
            }], false
        ],
        showDayUnit : true,
        date_picker_data : 1,
        flexible_btn : [
            {
                content: '<a href="#!/businessRebate/plan">更多</a>',
                preMethods: [],
                customMethods: ''
            }
        ],
        filter(data, query) {
            return businessRebate.businessAllSix(data, query.page);
        },
        rows : [
            [ "id", "plan_name", "shop_name", "related_flow", "level", "participated_user_num", "order_num",
                "plan_rebate_amount", "rebate2account_amount", "refund_rate" ]
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
                    caption : "商家名称",
                    type : "string"
                },{
                    caption : "相关流程",
                    type : "string"
                },{
                    caption : "层级",
                    type : "string"
                },{
                    caption : "参与商品数",
                    type : "number"
                },{
                    caption : "新增订单数",
                    type : "number"
                },{
                    caption : "预计返利金额",
                    type : "number"
                },{
                    caption : "返利到账金额",
                    type : "number"
                },{
                    caption : "退货率",
                    type : "string",
                    help : "统计周期内，退货商品件数/销售商品总件数，统计时间为订单生成时间"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/businessAllSeven",
        modelName : [ "RebateShopOverview" ],
        params() {
            let date = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000));

            return {
                day_type : 1,
                date : date,
                type : "ALL"
            };
        },
        platform : false,
        date_picker : false,
        filter(data) {
            return businessRebate.businessAllSeven(data);
        },
        rows : [
            [ "order_num", "buyer_num", "plan_rebate_amount", "canceled_order_num",
                "canceled_rebate_amount", "rebate_amount" ]
        ],
        cols : [
            [
                {
                    caption : "累计订单数",
                    type : "number"
                },{
                    caption : "累计返利参与人数（未去重）",
                    type : "number"
                },{
                    caption : "累计预计返利金额",
                    type : "number"
                },{
                    caption : "累计取消订单数",
                    type : "number"
                },{
                    caption : "累计取消返利金额",
                    type : "number"
                },{
                    caption : "累计到账金额",
                    type : "number"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/businessRebate/planOne",
        modelName : [ "RebateShopPlanTop", "TypeFlow" ],
        secondParams() {
            return {
                type : 2,
                type_code : 3,
                status : 1,
                limit : 100
            };
        },
        excel_export : true,
        platform : false,
        control_table_col : true,
        paging : [true, false],
        procedure : [
            [{
                find : "params",
                offset : "offset",
                limit : "limit",
                order : ["-date"],
                run : ""
            },{
                count : ""
            }], false
        ],
        showDayUnit : true,
        date_picker_data : 1,
        selectFilter(req, cb) {
            req.models.TypeFlow.find({
                type : 2,
                type_code : 3,
                status : 1
            }, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var filter_select = [],
                        related_flow = _.uniq(_.pluck(data, "flow_code"));
                    filter_select.push({
                        title: '关联流程',
                        filter_key: 'related_flow',
                        groups: [{
                            key: related_flow,
                            value: '全部返利'
                        }]
                    });
                    for(var key of data) {
                        filter_select[0].groups.push({
                            key : key.flow_code,
                            value : key.flow_name
                        })
                    }
                    cb(null, filter_select);
                }
            });
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query) {
            return businessRebate.planOne(data, query.page);
        },
        rows : [
            [ "id", "plan_name", "shop_name", "related_flow", "level", "participated_user_num", "order_num",
                "plan_rebate_amount", "rebate2account_amount", "refund_rate" ]
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
                caption : "商家名称",
                type : "string"
            },{
                caption : "相关流程",
                type : "string"
            },{
                caption : "层级",
                type : "string"
            },{
                caption : "参与商品数",
                type : "number"
            },{
                caption : "新增订单数",
                type : "number"
            },{
                caption : "预计返利金额",
                type : "number"
            },{
                caption : "返利到账金额",
                type : "number"
            },{
                caption : "退货率",
                type : "string"
            }
            ]
        ]
    });

    return Router;
};
