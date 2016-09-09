/**
 * @author Hao Sun
 * @date 20160518
 * @fileoverview 交易分析
 */

let api = require("../../../base/main"),
    util = require("../../../utils"),
    orm = require("orm"),
    filter = require("../../../filters/achievements/trade");

module.exports = (Router) => {

    /**
     * 美店交易
     */
        // 美店交易总览
    Router = new api(Router, {
        router: "/achievements/vtradeOne",
        modelName: ['VtradeDetail'],
        date_picker : false,
        platform : false,
        params(query) {
            // 取出近7天记录
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));

            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            };
        },
        filter(data) {
            let now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
                dates = util.times(qdate, ydate, '1');
            return filter.vtradeOne(data, dates);
        },
        rows : [
            ['name', 'ordered_num', 'paid_num',
                'ordered_user_num', 'paid_user_num',
                'ordered_amount', 'trading_amount',
                'paid_amount', 'custmer_price', 'order_price']
        ],
        cols : [[
            {
                "caption": " ",
                "type": "string"
            },
            {
                "caption": "下单总量",
                "type": "number"
            },
            {
                "caption": "支付订单量",
                "type": "number"
            },
            {
                "caption": "下单人数",
                "type": "number"
            },
            {
                "caption": "支付人数",
                "type": "number"
            },
            {
                "caption": "下单金额",
                "type": "string"
            },
            {
                "caption": "成交金额",
                "type": "number"
            },
            {
                "caption": "支付金额",
                "type": "number"
            },
            {
                "caption": "客单价",
                "type": "number"
            },
            {
                "caption": "笔单价",
                "type": "number"
            }
        ]]
    });

    // 交易趋势

    Router = new api(Router, {
        router: "/achievements/vtradeTwo",
        modelName: ["VtradeDetail"],
        platform : false,
        filter(data, query, dates) {
            return filter.vtradeTwo(data, query, dates);
        }
    });

    var filter_select_platform = [
        {
            title: '',
            filter_key: 'type',
            groups: [
                {
                    key: 'all',
                    value: '全部'
                },
                {
                    key: 'pc',
                    value: 'PC'
                },
                {
                    key: 'ios',
                    value: 'iOS'
                },
                {
                    key: 'android',
                    value: 'Android'
                },
                {
                    key: 'h5',
                    value: 'WAP'
                }
            ]
        }
    ];

    // 交易明细
    Router = new api(Router, {
        router: "/achievements/vtradeThree",
        modelName: ['VtradeDetail'],
        platform : false,
        excel_export : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter_select: filter_select_platform,
        params(query) {
            var obj = {
                day_type : 1
            };
            if(query.type && query.type !== 'all') {
                obj.type = query.type;
            }
            return obj;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeThree(data, dates);
        }
    });

    // 妥投与退货
    Router = new api(Router, {
        router: "/achievements/vtradeFour",
        modelName: ['VtradeDelivery'],
        platform : false,
        excel_export : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter_select: filter_select_platform,
        params(query) {
            var obj = {
                day_type : 1
            }
            if(query.type && query.type !== 'all') {
                obj.type = query.type;
            }
            return obj;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeFour(data, dates);
        }
    });

    // Top 100
    Router = new api(Router, {
        router: "/achievements/vtradeFive",
        modelName: ['VtradeTop'],
        procedure : [{
            aggregate : {
                value : ["vshop_name"]
            },
            sum : ["paid_order_num", "paid_item_num", "paid_user_num",
                "paid_item_quantity", "paid_amount", "brokerage"],
            groupBy : ["vshop_name"],
            get : ""
        }],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups: [
                    {
                        key: 'paid_order_num',
                        value: '支付订单数'
                    },
                    {
                        key: 'paid_amount',
                        value: '支付金额'
                    }
                ]
            }
        ],
        params : function(query , params , sendData){
            delete params.type;
            return params;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vtradeFive(data, query);
        }
    });

    return Router;
};