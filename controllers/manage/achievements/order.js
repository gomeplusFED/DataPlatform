/**
 * @fileoverview 订单分析
 * @time 20161109
 * @author Mr.He
 */

let api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_order"),
    orm = require("orm");

function globalPlatform(type) {
    let all = true;
    let global_platform = {
        show: true,
        key : "type",
        name : "平台选择",
        list : []
    };
    if(type[2] == "1") {
        global_platform.list.push({
            key: "app",
            name: "APP"
        });
    } else {
        all = false;
    }
    if(type[3] == "1") {
        global_platform.list.push({
            key: "pc",
            name: "PC"
        });
    } else {
        all = false;
    }
    if(type[4] == "1") {
        global_platform.list.push({
            key: "wap",
            name: "H5"
        });
    } else {
        all = false;
    }
    if(all) {
        global_platform.list = [{
            key: "ALL",
            name: "全部平台"
        }].concat(global_platform.list);
    }
    return global_platform;
}

module.exports = (Router) => {
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["39"]);
        },
        params(query , params , sendData){
            if(!query.type){
                params.type = this.global_platform.list[0].key;
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["39"]);
        },
        params(query , params , sendData){
            if(!query.type){
                params.type = this.global_platform.list[0].key;
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
        global_platform_filter(req) {
            this.global_platform = globalPlatform(req.session.userInfo.type["39"]);
        },
        params(query , params , sendData){
            if(!query.type){
                params.type = this.global_platform.list[0].key;
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.orderThree(data , query , dates);
        }
    });

    return Router;
};