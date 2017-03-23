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
    // Router = new api(Router, {
    //     router: "/businessRebate/businessAllOne",
    //     modelName: ["RebateShopMerchantsetupOverview"],
    //     platform : false,
    //     params(query, params, data, dates) {
    //         let date = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000));
    //
    //         return {
    //             day_type : 1,
    //             date : dates.concat(date),
    //             type : "ALL"
    //         };
    //     },
    //     filter(data,query, dates) {
    //         return businessRebate.businessAllOne(data, dates);
    //     },
    //     rows: [
    //         [ "name", "order_num", "order_amount", "shop_num", "buyer_num",
    //             "product_quantity", "canceled_order_num" ],
    //         [ "plan_rebate_amount", "plan_rebate_user_num", "canceled_rebate_amount",
    //             "rebate2account_order_num", "rebate2account_amount", "rebate2platform_amount" ],
    //         [ "name", "return_items_num", "return_items_quantity", "return_items_user_num",
    //             "return_items_amount" ]
    //     ],
    //     cols: [
    //         [{
    //             caption: "",
    //             type: "string"
    //         }, {
    //             caption: "订单数",
    //             type: "string"
    //         }, {
    //             caption: "订单总金额",
    //             type: "string"
    //         }, {
    //             caption: "商家数",
    //             type: "string"
    //         }, {
    //             caption: "购买用户数",
    //             type: "string"
    //         }, {
    //             caption: "商品件数",
    //             type: "string"
    //         }, {
    //             caption: "取消订单数",
    //             type: "string"
    //         }],
    //         [{
    //             caption: "预计返利金额",
    //             type: "string"
    //         }, {
    //             caption: "预计获利人次",
    //             type: "string"
    //         }, {
    //             caption: "已取消返利金额",
    //             type: "string"
    //         }, {
    //             caption: "返利到账订单数",
    //             type: "string"
    //         }, {
    //             caption: "返利到账金额",
    //             type: "string"
    //         }, {
    //             caption: "平台到账金额",
    //             type: "string",
    //             help : "时间段内商家设置返利中平台到账总金额，统计时间为订单返利到账时间"
    //         }],
    //         [{
    //             caption: "",
    //             type: "string"
    //         }, {
    //             caption: "退货商品数",
    //             type: "string"
    //         }, {
    //             caption: "退货商品件数",
    //             type: "string"
    //         }, {
    //             caption: "退货用户数",
    //             type: "string"
    //         }, {
    //             caption: "退货商品总金额",
    //             type: "string"
    //         }]
    //     ]
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllTwo",
    //     modelName : [ "RebateShopOrderTredency", "TypeFlow" ],
    //     params(query, params) {
    //         params.category_id = query.category_id || "all";
    //         params.day_type = 1;
    //         params.type = "all";
    //
    //         return params;
    //     },
    //     secondParams() {
    //         return {
    //             type : 2,
    //             type_code : 3,
    //             status : 1
    //         };
    //     },
    //     level_select : true,
    //     level_select_name : "category_id",
    //     level_select_url : "/api/categories",
    //     platform : false,
    //     filter_select: [{
    //         title: '指标选择',
    //         filter_key: 'filter_key',
    //         groups: [{
    //             key: 'order_num',
    //             value: '订单数'
    //         }, {
    //             key: 'order_amount',
    //             value: '订单总金额'
    //         }, {
    //             key: 'item_quantity',
    //             value: '商品件数'
    //         }, {
    //             key: 'canceled_order_num',
    //             value: '取消订单数'
    //         }]
    //     }],
    //     filter(data, query, dates) {
    //         return businessRebate.businessAllTwe(data, query.filter_key, dates);
    //     }
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllThree",
    //     modelName : [ "RebateShopRebatelevelDistribution", "TypeFlow" ],
    //     params(query, params) {
    //         params.day_type = 1;
    //         params.category_id = params.category_id || "all";
    //         params.type = "all";
    //
    //         return params;
    //     },
    //     secondParams() {
    //         return {
    //             type : 2,
    //             type_code : 3,
    //             status : 1
    //         };
    //     },
    //     level_select : true,
    //     level_select_name : "category_id",
    //     level_select_url : "/api/categories",
    //     platform : false,
    //     filter_select: [
    //         {
    //             title: '指标选择',
    //             filter_key: 'filter_key',
    //             groups: [{
    //                 key: 'item_quantity',
    //                 value: '商品件数'
    //             }, {
    //                 key: 'item_amount',
    //                 value: '商品总金额'
    //             }, {
    //                 key: 'rebate2account_amount',
    //                 value: '返利到账金额'
    //             }, {
    //                 key: 'order_num',
    //                 value: '订单数'
    //             }]
    //         }
    //     ],
    //     filter(data, query) {
    //         return businessRebate.businessAllThree(data, query.filter_key);
    //     }
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllFour",
    //     modelName : [ "RebateShopRebatetypeDistribution", "TypeFlow" ],
    //     params(query, params) {
    //         params.category_id = params.category_id || "all";
    //         params.day_type = 1;
    //         params.type = "all";
    //
    //         return params;
    //     },
    //     secondParams() {
    //         return {
    //             type : 2,
    //             type_code : 3,
    //             status : 1
    //         };
    //     },
    //     level_select : true,
    //     level_select_name : "category_id",
    //     level_select_url : "/api/categories",
    //     platform : false,
    //     filter_select: [
    //         {
    //             title: '指标选择',
    //             filter_key: 'filter_key',
    //             groups: [{
    //                 key: 'item_quantity',
    //                 value: '商品件数'
    //             }, {
    //                 key: 'item_amount',
    //                 value: '商品总金额'
    //             }, {
    //                 key: 'rebate2account_amount',
    //                 value: '返利到账金额'
    //             }, {
    //                 key: 'order_num',
    //                 value: '订单数'
    //             }]
    //         }
    //     ],
    //     filter(data, query, dates) {
    //         return businessRebate.businessAllFour(data, query.filter_key);
    //     }
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllFive",
    //     modelName : [ "RebateShopTop" ],
    //     showDayUnit : true,
    //     date_picker_data : 1,
    //     platform : false,
    //     paging : [true],
    //     order : ["-order_num"],
    //     filter(data, query) {
    //         return businessRebate.businessAllFive(data, query.page);
    //     },
    //     rows : [
    //         [ "id", "shop_name", "plan_num", "participated_item_num", "buyer_num",
    //             "pay_rate", "pay_price_rate",
    //             "plan_rebate_amount", "rebate2account_amount", "rebate2platform_amount" ]
    //     ],
    //     cols : [
    //         [
    //             {
    //                 caption : "排名",
    //                 type : "number"
    //             },{
    //                 caption : "商家名称",
    //                 type : "string"
    //             },{
    //                 caption : "计划数",
    //                 type : "number"
    //             },{
    //                 caption : "参与商品数",
    //                 type : "number"
    //             },{
    //                 caption : "参与用户数",
    //                 type : "number"
    //             },{
    //                 caption : "新增订单数/订单总数",
    //                 type : "string"
    //             },{
    //                 caption : "新增订单金额/订单总金额",
    //                 type : "string"
    //             },{
    //                 caption : "预计返利金额",
    //                 type : "number"
    //             },{
    //                 caption : "返利到账金额",
    //                 type : "number"
    //             },{
    //                 caption : "平台到账金额",
    //                 type : "number",
    //                 help : "时间段内商家设置返利中平台到账总金额，统计时间为订单返利到账时间"
    //             }
    //         ]
    //     ]
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllSix",
    //     modelName : [ "RebateShopPlanTop", "TypeFlow" ],
    //     secondParams() {
    //         return {
    //             type : 2,
    //             type_code : 3,
    //             status : 1,
    //             limit : 100
    //         };
    //     },
    //     platform : false,
    //     control_table_col : true,
    //     paging : [true, false],
    //     procedure : [
    //         [{
    //             find : "params",
    //             offset : "offset",
    //             limit : "limit",
    //             order : ["-order_num"],
    //             run : ""
    //         },{
    //             count : ""
    //         }], false
    //     ],
    //     showDayUnit : true,
    //     date_picker_data : 1,
    //     flexible_btn : [
    //         {
    //             content: '<a href="#!/businessRebate/plan">更多</a>',
    //             preMethods: [],
    //             customMethods: ''
    //         }
    //     ],
    //     filter(data, query) {
    //         return businessRebate.businessAllSix(data, query.page);
    //     },
    //     rows : [
    //         [ "id", "plan_name", "shop_name", "related_flow", "level", "participated_user_num", "order_num",
    //             "plan_rebate_amount", "rebate2account_amount", "refund_rate" ]
    //     ],
    //     cols : [
    //         [
    //             {
    //                 caption : "序号",
    //                 type : "number"
    //             },{
    //                 caption : "返利计划名称",
    //                 type : "string"
    //             },{
    //                 caption : "商家名称",
    //                 type : "string"
    //             },{
    //                 caption : "相关流程",
    //                 type : "string"
    //             },{
    //                 caption : "层级",
    //                 type : "string"
    //             },{
    //                 caption : "参与商品数",
    //                 type : "number"
    //             },{
    //                 caption : "新增订单数",
    //                 type : "number"
    //             },{
    //                 caption : "预计返利金额",
    //                 type : "number"
    //             },{
    //                 caption : "返利到账金额",
    //                 type : "number"
    //             },{
    //                 caption : "退货率",
    //                 type : "string",
    //                 help : "统计周期内，退货商品件数/销售商品总件数，统计时间为订单生成时间"
    //             }
    //         ]
    //     ]
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/businessAllSeven",
    //     modelName : [ "RebateShopOverview" ],
    //     params() {
    //         let date = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000));
    //
    //         return {
    //             day_type : 1,
    //             date : date,
    //             type : "ALL"
    //         };
    //     },
    //     platform : false,
    //     date_picker : false,
    //     filter(data) {
    //         return businessRebate.businessAllSeven(data);
    //     },
    //     rows : [
    //         [ "order_num", "buyer_num", "plan_rebate_amount", "canceled_order_num",
    //             "canceled_rebate_amount", "rebate_amount" ]
    //     ],
    //     cols : [
    //         [
    //             {
    //                 caption : "累计订单数",
    //                 type : "number"
    //             },{
    //                 caption : "累计返利参与人数（未去重）",
    //                 type : "number"
    //             },{
    //                 caption : "累计预计返利金额",
    //                 type : "number"
    //             },{
    //                 caption : "累计取消订单数",
    //                 type : "number"
    //             },{
    //                 caption : "累计取消返利金额",
    //                 type : "number"
    //             },{
    //                 caption : "累计到账金额",
    //                 type : "number"
    //             }
    //         ]
    //     ]
    // });
    //
    // Router = new api(Router,{
    //     router : "/businessRebate/planOne",
    //     modelName : [ "RebateShopPlanTop", "TypeFlow" ],
    //     secondParams() {
    //         return {
    //             type : 2,
    //             type_code : 3,
    //             status : 1,
    //             limit : 100
    //         };
    //     },
    //     excel_export : true,
    //     platform : false,
    //     control_table_col : true,
    //     paging : [true, false],
    //     procedure : [
    //         [{
    //             find : "params",
    //             offset : "offset",
    //             limit : "limit",
    //             order : ["-date"],
    //             run : ""
    //         },{
    //             count : ""
    //         }], false
    //     ],
    //     showDayUnit : true,
    //     date_picker_data : 1,
    //     selectFilter(req, cb) {
    //         req.models.TypeFlow.find({
    //             type : 2,
    //             type_code : 3,
    //             status : 1
    //         }, (err, data) => {
    //             if(err) {
    //                 cb(err);
    //             } else {
    //                 var filter_select = [],
    //                     related_flow = _.uniq(_.pluck(data, "flow_code"));
    //                 filter_select.push({
    //                     title: '关联流程',
    //                     filter_key: 'related_flow',
    //                     groups: [{
    //                         key: related_flow,
    //                         value: '全部返利'
    //                     }]
    //                 });
    //                 for(var key of data) {
    //                     filter_select[0].groups.push({
    //                         key : key.flow_code,
    //                         value : key.flow_name
    //                     })
    //                 }
    //                 cb(null, filter_select);
    //             }
    //         });
    //     },
    //     flexible_btn : [{
    //         content: '<a href="javascript:void(0)">导出</a>',
    //         preMethods: ['excel_export']
    //     }],
    //     filter(data, query) {
    //         return businessRebate.planOne(data, query.page);
    //     },
    //     rows : [
    //         [ "id", "plan_name", "shop_name", "related_flow", "level", "participated_user_num", "order_num",
    //             "plan_rebate_amount", "rebate2account_amount", "refund_rate" ]
    //     ],
    //     cols : [
    //         [
    //             {
    //                 caption : "序号",
    //                 type : "number"
    //             },{
    //             caption : "返利计划名称",
    //             type : "string"
    //         },{
    //             caption : "商家名称",
    //             type : "string"
    //         },{
    //             caption : "相关流程",
    //             type : "string"
    //         },{
    //             caption : "层级",
    //             type : "string"
    //         },{
    //             caption : "参与商品数",
    //             type : "number"
    //         },{
    //             caption : "新增订单数",
    //             type : "number"
    //         },{
    //             caption : "预计返利金额",
    //             type : "number"
    //         },{
    //             caption : "返利到账金额",
    //             type : "number"
    //         },{
    //             caption : "退货率",
    //             type : "string"
    //         }
    //         ]
    //     ]
    // });

    Router = new api(Router, {
        "modelName": [
            "ads2_new_rebate_order_shop_info",
            "TypeFlow"
        ],
        "date_picker": true,
        "platform": false,
        "router": "/rebate/shopPlan_One",
        "names": "商家设置返利",
        "excel_export": true,
        "search": {
            "show": true,
            "title": "请输入商家名称或ID",
            "key": "search_key"
        },
        "flexible_btn": [
            {
                "content": "<a href='javascript:void(0)'>导出</a>",
                "preMethods": [
                    "excel_export"
                ]
            }
        ],
        selectFilter(req , cb){
            let filter_select = {
                "title" : "关联流程",
                "filter_key" : "rebate_type",
                "groups" : [{
                    "key" : [],
                    "value":"全部返利"
                }]
            };

            req.models.TypeFlow.find({
                type_code : 3,
                status : 1
            }, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    var user_party = _.uniq(_.pluck(data, "flow_code"));
                    filter_select.groups[0].key = user_party.join(",");

                    for(let item of data){
                        let obj = {
                            "key" : item.flow_code,
                            "value":item.flow_name
                        };
                        filter_select.groups.push(obj);
                    }
                    cb(null, [filter_select]);
                }
            });
        },
        filter(data, query, dates){
            let source = data.first.data,
                array  = data.first.count,
                second = data.second.data[0],
                count  = array.length;

            // count = count > 50 ? 50 : count;

            if(query.page == 3){
                source.splice(10 , source.length - 1);
            }

            let Translate = {};
            second.map((item , index) => {
                Translate[item.flow_code] = item.flow_name;
            });

            query.page = query.page || 1;
            query.limit = query.limit || 1;
            source.map((item , index) => {
                item.Number = (query.page - 1) * query.limit + index + 1;
                item.Return_lv = util.toFixed( item.is_rebate_back_merchandise_num , item.is_rebate_merchandise_num );
                item["新增订单占比"] = util.toFixed( item.unique_is_rebate_order_num , item.unique_order_num || 0 );
                item["新增订单金额占比"] = util.toFixed( item.is_rebate_fee , item.fee || 0 );
                item.rate = util.toFixed(item.unique_is_rebate_order_num, item.unique_order_num);

                item.rebate_type = Translate[item.rebate_type];
            });

            source = Deal100(source , ["expect_rebate_amount", "is_over_rebate_order_amount", "cancel_rebate_amount",
                "is_rebate_fee", "is_rebate_item_fee"]);

            for(let item of source) {
                item.expect_rebate_amount = item.expect_rebate_amount.toFixed(2);
                item.is_over_rebate_order_amount = item.is_over_rebate_order_amount.toFixed(2);
                item.cancel_rebate_amount = item.cancel_rebate_amount.toFixed(2);
                item.is_rebate_fee = item.is_rebate_fee.toFixed(2);
                item.is_rebate_item_fee = item.is_rebate_item_fee.toFixed(2);
            }

            return util.toTable([source], data.rows, data.cols , [count]);
        },
        // params(query , params , sendData){
        //     if(query.search_key){
        //         if(query.search_key / 1){
        //             params.merchant_id = query.search_key;
        //         }else{
        //             params.shop_name = orm.like("%" + query.search_key + "%");
        //         }
        //
        //         delete params.search_key;
        //         delete query.search_key;
        //     }
        //     params.rebate_type = params.rebate_type.split(",");
        //     return params;
        // },
        firstSql(query, param, isCount) {
            let config = ["date BETWEEN ? AND ?", "day_type=?"],
                params = [query.startTime, query.endTime, 1];

            if(query.search_key){
                if(query.search_key / 1){
                    config.push("merchant_id=?");
                    params.push(query.search_key);
                }else{
                    config.push("shop_name like ?");
                    params.push("%" + query.search_key + "%");
                }
            }

            // const rebate_type = query.rebate_type;
            const rebate_type = query.rebate_type.split(",");
            let string = "rebate_type in (";
            for(let i = 0, len = rebate_type.length; i<len; i++) {
                if(i === len - 1) {
                    string += "?)"
                } else {
                    string += "?,";
                }
                params.push(rebate_type[i]);
            }
            config.push(string);
            if(isCount) {
                let sql = `SELECT COUNT(*) count FROM ads2_new_rebate_order_shop_info WHERE ${config.join(" AND ")} 
                GROUP BY plan_name, rebate_type, rebate_level`;
                return {
                    sql : sql,
                    params : params
                };
            } else {
                let page = query.from || query.page || 1,
                    limit = query.to || query.limit || 20;


                params.push(page - 1);
                params.push(+limit);
                let sql = `SELECT
                    plan_name,
                    merchant_id,
                    rebate_type,
                    rebate_level,
                    validscope_time,
                    SUM(unique_is_rebate_user_num) unique_is_rebate_user_num,
                    SUM(unique_is_rebate_order_num) unique_is_rebate_order_num,
                    SUM(expect_rebate_amount) expect_rebate_amount,
                    SUM(is_over_rebate_order_amount) is_over_rebate_order_amount,
                    SUM(is_rebate_merchandise_num) is_rebate_merchandise_num,
                    SUM(unique_is_rebate_user_num) unique_is_rebate_user_num,
                    SUM(is_rebate_item_fee) is_rebate_item_fee,
                    SUM(expect_rebate_user_num) expect_rebate_user_num,
                    SUM(cancel_is_rebate_order_num) cancel_is_rebate_order_num,
                    SUM(cancel_rebate_amount) cancel_rebate_amount,
                    SUM(is_rebate_fee) is_rebate_fee,
                    SUM(is_rebate_back_merchandise_num) is_rebate_back_merchandise_num,
                    SUM(unique_order_num) unique_order_num
                     FROM ads2_new_rebate_order_shop_info
                    WHERE ${config.join(" AND ")} GROUP BY plan_name, rebate_type, rebate_level LIMIT ?,?`;
                return {
                    sql : sql,
                    params : params
                };
            }
        },
        secondParams(query , params , sendData){
            return {type_code : 3};
        },
        "control_table_col": true,
        "paging": [
            true,
            false
        ],
        "rows": [
            [
                "Number",
                "plan_name",
                "merchant_id",
                "rebate_type",
                "rebate_level",
                "unique_is_rebate_user_num",
                "unique_is_rebate_order_num",
                "expect_rebate_amount",
                "is_over_rebate_order_amount",
                "Return_lv",
                "validscope_time",
                "is_rebate_merchandise_num",
                "unique_is_rebate_user_num",
                "rate",
                "is_rebate_item_fee",
                "expect_rebate_user_num",
                "cancel_is_rebate_order_num",
                "cancel_rebate_amount"
            ]
        ],
        "cols": [
            [
                {
                    "caption": "序号",
                    "type": "number"
                },
                {
                    "caption": "返利计划名称",
                    "type": "string"
                },
                {
                    "caption": "商家ID",
                    "type": "string"
                },
                {
                    "caption": "关联流程",
                    "type": "string"
                },
                {
                    "caption": "层级",
                    "type": "string"
                },
                {
                    "caption": "参与用户数",
                    "type": "number"
                },
                {
                    "caption": "新增订单数",
                    "type": "number"
                },
                {
                    "caption": "预计返利金额",
                    "type": "number"
                },
                {
                    "caption": "返利到账金额",
                    "type": "number"
                },
                {
                    "caption": "退货率",
                    "type": "string",
                    "help": "统计周期内，退货商品件数/销售商品总件数，统计时间为订单生成时间"
                },
                {
                    "caption" : "有效期",
                    "type" : "string"
                },
                {
                    "caption" : "参与商品件数",
                    "type" : "number"
                },
                {
                    "caption" : "购买用户数",
                    "type" : "number"
                },
                {
                    "caption" : "新增订单占比",
                    "type" : "string"
                },
                {
                    "caption" : "新增商品总金额",
                    "type" : "number"
                },
                {
                    "caption" : "预计获利人次",
                    "type" : "number"
                },
                {
                    "caption" : "取消配送单数",
                    "type" : "number"
                },
                {
                    "caption" : "已取消返利金额",
                    "type" : "number"
                }
            ]
        ]
    });

    return Router;
};

let Deal100 = (arr , columns) => {
    if(arr instanceof Array){
        for(let item of arr){
            for(let key of columns){
                if(item[key]){
                    item[key] = item[key] / 100;
                }
            }
        }
    }else{
        for(let key of columns){
            if(arr[key]){
                arr[key] = arr[key] / 100;
            }
        }
    }

    return arr;
};