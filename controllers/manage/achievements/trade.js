/**
 * @author Hao Sun
 * @date 20160518
 * @fileoverview 交易分析
 *
 * 二次开发
 * @time 20161109
 * @author Mr.He
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_trade");

module.exports = (Router) => {

    Router = Router.get("/achievements/tradeZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                filter_select: [{
                    title: "平台选择",
                    filter_key: "type",
                    groups: [{
                        key: "ALL",
                        value: "全部平台"
                    }, {
                        key: "app",
                        value: "APP"
                    }, {
                        key: "wap",
                        value: "WAP"
                    }, {
                        key: "pc",
                        value: "PC"
                    }]
                }]
            }
        });
    });



    //交易总览
    Router = new api(Router, {
        router: "/achievements/tradeOne",
        modelName: ["SalesOverview2"],
        platform: false,
        /*global_platform: {
            show: true,
            key: "type",
            name: "平台切换（默认全部平台）",
            list: [{
                key: 'ALL',
                name: '全部平台'
            }, {
                key: 'APP',
                name: 'APP'
            }, {
                key: 'WAP',
                name: 'WAP'
            }, {
                key: 'PC',
                name: 'PC'
            }]
        },*/
        params(query, params, sendData) {
            if (!query.type) {
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.tradeOne(data, query, dates);
        },
        rows: [
            [
                "access_product",
                "order_product",
                "order_product_num",
                "pay_product",
                "pay_product_num",
                "refund_product",
                "refund_product_num"
            ],
            [
                "order_user",
                "order_sum",
                "order_num",
                "pay_num",
                "pay_user",
                "pay_sum",
                "Man_price",
                "consume_guomeibi",
                "plat_couple_use_sum",
                "deal_sum"
            ]
        ],
        cols: [
            [{
                caption: "浏览商品数",
                type: "number"
            }, {
                caption: "下单商品数",
                type: "number"
            }, {
                caption: "下单商品件数",
                type: "number"
            }, {
                caption: "支付商品数",
                type: "number"
            }, {
                caption: "支付商品件数",
                type: "number"
            }, {
                caption: "退货商品数",
                type: "number"
            }, {
                caption: "退货商品件数",
                type: "number"
            }],
            [{
                caption: "下单人数",
                type: "number"
            }, {
                caption: "下单金额",
                type: "number"
            }, {
                caption: "下单总量",
                type: "number"
            }, {
                caption: "支付总量",
                type: "number"
            }, {
                caption: "支付人数",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }, {
                caption: "客单价",
                type: "number"
            }, {
                caption: "国美币使用额",
                type: "number"
            }, {
                caption: "平台优惠券使用金额",
                type: "number"
            }, {
                caption: "成交金额",
                type: "number"
            }]
        ]
    });

    //交易趋势
    Router = new api(Router, {
        router: "/achievements/tradeTwo",
        modelName: ["SalesOverview2"],
        platform: false,
        toggle: true,
        paging: [true],
        filter_select: [{
            title: '指标选择(图表使用)',
            filter_key: 'filter_key',
            groups: [{ key: 'access_shop', value: '被访问店铺数' },
                { key: 'pay_shop', value: '支付店铺数' },
                { key: 'order_product', value: '下单商品数' },
                { key: 'order_product_num', value: '下单商品件数' },
                { key: 'pay_product', value: '支付商品数' },
                { key: 'pay_product_num', value: '支付商品件数' },
                { key: 'order_num', value: '下单金额' },
                { key: 'pay_num', value: '支付订单量' },
                { key: 'pay_sum', value: '支付金额' },
                { key: 'order_user', value: '下单人数' },
                { key: 'pay_user', value: '支付人数' },
                { key: 'Man_price', value: '客单价' },
                { key: 'consume_guomeibi', value: '国美币使用额' },
                { key: 'plat_couple_use_sum', value: '平台优惠券使额' }
            ]
        }],
        params(query, params, sendData) {
            if (!query.type) {
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.tradeTwo(data, query, dates);
        }
    });

    //交易用户分布
    Router = new api(Router, {
        router: "/achievements/tradeThree",
        modelName: ["SalesUserDistribute2"],
        platform: false,
        showDayUnit: true,
        date_picker_data: 1,
        paging: [true],
        order: ["-date"],
        toggle: true,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'pay_num',
                value: '支付总量'
            }, {
                key: 'pay_sum',
                value: '支付总金额'
            }, {
                key: 'pay_product',
                value: '支付商品数'
            }, {
                key: 'pay_product_num',
                value: '支付商品件数'
            }, {
                key: 'pay_user',
                value: '支付人数'
            }, {
                key: 'Every_price',
                value: '笔单价'
            }, {
                key: 'Man_price',
                value: '客单价'
            }]
        }],
        params(query, params, sendData) {
            if (!query.type) {
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.tradeThree(data, query, dates);
        },
        rows: [
            [
                'sales_province',
                'pay_num',
                'pay_sum',
                'pay_product',

                'pay_product_num',
                'pay_user',
                'Every_price',
                'Man_price'
            ]
        ],
        cols: [
            [{
                    caption: "省市",
                    type: "date"
                }, {
                    type: 'number',
                    caption: '支付总量'
                }, {
                    type: 'number',
                    caption: '支付总金额'
                }, {
                    type: 'number',
                    caption: '支付商品数'
                },

                {
                    type: 'number',
                    caption: '支付商品件数'
                }, {
                    type: 'number',
                    caption: '支付人数'
                }, {
                    type: 'number',
                    caption: '笔单价'
                }, {
                    type: 'number',
                    caption: '客单价'
                }
            ]
        ]
    });

    //交易类目构成
    Router = new api(Router, {
        router: "/achievements/tradeFour",
        modelName: ["SalesCategoryConstitute2"],
        showDayUnit: true,
        date_picker_data: 1,
        platform: false,
        paging: [true],
        /*excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],*/
        params(query, params, sendData) {
            if (!query.type) {
                params.type = "ALL";
            }
            return params;
        },
        fixedParams(req, query, cb) {

            if (query.category_id && query.category_id != "all") {
                req.models.ConfCategories.find({
                    id: query.category_id
                }, (err, data) => {
                    if (err) {
                        cb(err);
                    } else {
                        let theLevel = data[0].level + 1;
                        switch (theLevel) {
                            case 1:
                                query.category_id_1 = query.category_id;
                                query.filter_key = 1;
                                break;
                            case 2:
                                query.category_id_2 = query.category_id;
                                query.filter_key = 2;
                                break;
                            case 3:
                                query.category_id_3 = query.category_id;
                                query.filter_key = 3;
                                break;
                            case 4:
                                query.category_id_4 = query.category_id;
                                query.filter_key = 4;
                        }
                        delete query.category_id;
                        cb(null, query);
                    }
                });
            } else {
                query.category_id_1 = "ALL";
                query.category_id_2 = "ALL";
                query.category_id_3 = "ALL";
                query.category_id_4 = "ALL";
                delete query.category_id;
                cb(null, query);
            }
        },
        level_select: true,
        level_select_name: "category_id",
        level_select_url: "/api/categories",
        filter(data, query, dates) {
            return filter.tradeFour(data, query, dates);
        },
        rows: [
            ['category_name', 'product_access', 'access_user', 'pay_product_num',
                'pay_sum', 'pay_sum_lv'
            ]
        ],
        cols: [
            [{
                caption: '类目名称',
                type: 'string'
            }, {
                caption: '浏览量',
                type: 'number'
            }, {
                caption: '访客数',
                type: 'number'
            }, {
                caption: '支付商品件数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '支付金额占比',
                type: 'string'
            }]
        ]
    });


    return Router;
};
