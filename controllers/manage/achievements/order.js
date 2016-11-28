/**
 * @fileoverview 订单分析
 * @time 20161109
 * @author Mr.He
 */

let api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_order"),
    orm = require("orm");

module.exports = (Router) => {
   
    Router = Router.get("/achievements/orderZero_json" , function(req , res , next){

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

    //订单趋势
    Router = new api(Router, {
        router : "/achievements/orderOne",
        modelName : ["OrderTrend2" , "SalesPerfConversion2"],
        platform : false,
        toggle : {
            show : true
        },
        order : ["-date"],
        filter_select : [{
            title: '指标选择(图表使用)',
            filter_key: 'filter_key',
            groups: [
                {key: 'order_num', value: '下单总量' },
                {key: 'pay_num', value: '支付总量' },
                {key: 'order_user', value: '下单人数' },
                {key: 'pay_user', value: '支付人数' },
                {key: 'ensure_get_commodity', value: '确认收货' },
                {key: 'delay_get_commodity', value: '延迟收货' },
                {key: 'cancel_order', value: '取消订单' },
                {key: 'apply_aftersale', value: '申请售后' },
                {key: 'evaluate_order', value: '评价订单' },
                {key: 'scan_order', value: '浏览-下单' },
                {key: 'scan_pay', value: '浏览-支付' },
                {key: 'order_pay', value: '下单-支付' },
                {key: 'pay_lv', value: '支付成功率' }
            ]
        }],
        /*global_platform: {
            show: true,
            key : "type",
            name : "平台切换（默认全部平台）",
            list : [{
                key: 'ALL',
                name: '全部平台'
            },{
                key: 'APP',
                name: 'APP'
            },{
                key: 'WAP',
                name: 'WAP'
            },{
                key: 'PC',
                name: 'PC'
            }]
        },*/
        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.orderOne(data , query , dates);
        }
    });

    //订单来源类型
    Router = new api(Router,{
        router : "/achievements/orderTwo",
        modelName : ["OrderSource2"],
        platform : false,
        paging: [true],
        rows : [
            ["order_source","order_num","order_num_lv","pay_num","pay_num_lv" , "pay_sum" , "pay_sum_lv"]
        ],
        sum : ["order_num" , "pay_num" , "pay_sum"],
        cols : [
            [{
                caption: "来源",
                type: "string"
            }, {
                caption: "下单总量",
                type: "number"
            }, {
                caption: "下单量占比",
                type: "number"
            }, {
                caption: "支付总量",
                type: "number"
            }, {
                caption: "支付量占比",
                type: "number"
            }, {
                caption: "支付金额",
                type: "number"
            }, {
                caption: "支付金额占比",
                type: "number"
            }]
        ],
        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            params.order_source = orm.not_in(["ALL"]);
            return params;
        },
        filter(data, query, dates) {
            return filter.orderTwo(data, query, dates);
        }
    });

    //订单评级分布
    Router = new api(Router,{
        router : "/achievements/orderThree",
        modelName : ["OrderComments2"],
        platform : false,
        params(query , params , sendData){
            if(!query.type){
                params.type = "ALL";
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.orderThree(data , query , dates);
        }
    });

    return Router;
};