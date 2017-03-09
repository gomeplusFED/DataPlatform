/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索关键指标模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const orm = require("orm");
const filter = require("../../../filters/search/fword");

const TypeObj = [{
    show: true,
    key: 'type',
    name: "平台选择",
    list: [{
        key: "all",
        name: "全部"
    },{
        key: "ios",
        name: "IOS"
    }, {
        key: "android",
        name: "Android"
    }, {
        key: "pc",
        name: "PC"
    }, {
        key: "h5",
        name: "H5"
    }]
}];


module.exports = (Router) => {

    //商品搜索关键词分析－入口位置占比
    Router = new api(Router, {
        router: "/search/WordOne",
        modelName : ["SearchSoulocaAnalyseNew", "SearchSoulocaAnalyseNew"],
        platform: false,
        global_platform: TypeObj,
        // selectFilter(req, cb) {
        //     cb(null, utils.globalPlatform(req.session.userInfo.type["69"], TypeObj));
        // },
        params(query, params){
            // if (params.type && params.type.toLowerCase() === 'all') {
            //    delete params.type
            // }
            if (!params.type) {
                params.type = 'ALL'
            }
            return params;
        },
        filter(data, query, dates) {
            return filter.wordOne(data, query, dates);
        }
    });

    //top 100
    Router = new api(Router, {
        router: "/search/WordTwo",
        modelName : ["SearchAnalyseNew"],
        platform: false,
        order: ["-search_result_pv"],
        excel_export : true,
        paging : [true],
        date_picker_data : 1,
        showDayUnit : true,
        params(query, params) {
            params.search_keyword = orm.not_in(["ALL"]);

            // if (params.type && params.type.toLowerCase() === 'all') {
            //    delete params.type
            // }
            if (!params.type) {
                params.type = 'ALL'
            }

            return params;
        },
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        // selectFilter(req, cb) {
        //     cb(null, utils.globalPlatform(req.session.userInfo.type["69"], TypeObj));
        // },
        rows: [
            [
                "search_keyword",
                "date",
                "rank",
                "search_recall_product",
                "search_result_pv",
                "search_result_uv",
                "search_prodet_ipv",
                "search_prodet_ipv_uv",
                "search_avg_turnpage",
                "ipv_pv_ratio",
                "ipv_uv_uv_ratio",
                "search_order_sum",
                "search_order_uv",
                "search_order_spu",
                "search_order_com",
                "search_order_total",
                "order_uv_uv_ratio",
                "order_uv_ipv_ui_ratio",
                "search_order_sum_pay",
                "search_order_uv_pay",
                "search_order_spu_pay",
                "search_order_com_pay",
                "search_order_total_pay",
                "order_uv_pay_uv_ratio",
                "order_uv_pay_ipv_uv_ratio",
                "order_uv_pay_order_uv_ratio",
                "order_com_pay_order_com_ratio",
                "ipv_exposure_product_num_ratio",
                "order_sum_pay_order_uv_pay_ratio",
                "order_sum_pay_order_spu_pay_ratio"
            ]
        ],
        cols: [
            [{
                caption: '关键词',
                type: 'string',
                row: 'search_keyword'
            }, {
                caption: '日期',
                type: 'string',
                row: 'date'
            }, {
                caption: '搜索排名',
                type: 'number',
                row: 'rank'
            }, {
                caption: '召回商品数',
                type: 'number',
                row: 'search_recall_product'
            }, {
                caption: 'PV',
                type: 'number',
                help: '搜索结果页浏览量',
                row: 'search_result_pv'
            }, {
                caption: 'UV',
                type: 'number',
                help: '搜索的独立访客数(搜索结果页)',
                row: 'search_result_uv'
            }, {
                caption: 'IPV',
                type: 'number',
                help: '搜索引导的商品详情页的浏览次数',
                row: 'search_prodet_ipv'
            }, {
                caption: 'IPV_UV',
                type: 'number',
                help: '搜索引导的商品详情页的访问用户数',
                row: 'search_prodet_ipv_uv'
            },{
                caption: '平均翻页数',
                type: 'number',
                help: '平均翻页数',
                row: 'search_avg_turnpage'
            },{
                caption: '点击次数转化率',
                type: 'string',
                help: '点击次数转化率=IPV/PV',
                row: 'ipv_pv_ratio'
            },{
                caption: '点击人数转化率',
                type: 'string',
                help: '点击人数转化率=IPV_UV/UV',
                row: 'ipv_uv_uv_ratio'
            }, {
                caption: 'GMV',
                type: 'number',
                help: '下单就算(产生了订单号)',
                row: 'search_order_sum'
            }, {
                caption: '下单UV',
                type: 'number',
                help: '下单就算(产生了订单号)',
                row: 'search_order_uv'
            }, {
                caption: '下单订单数',
                type: 'number',
                help: '下单就算(产生了订单号)',
                row: 'search_order_spu'
            }, {
                caption: '下单商品数',
                type: 'number',
                help: '下单就算(产生了订单号)',
                row: 'search_order_com'
            }, {
                caption: '下单件数',
                type: 'number',
                row: 'search_order_total'
            }, {
                caption: '下单转换率',
                type: 'string',
                help: '下单转化率=下单UV/UV',
                row: 'order_uv_uv_ratio'
            }, {
                caption: 'IPV-下单转换率',
                type: 'string',
                help: 'IPV-下单转化率=下单UV/IPV_UV',
                row: 'order_uv_ipv_ui_ratio'
            }, {
                caption: '支付金额',
                type: 'number',
                help: '已支付',
                row: 'search_order_sum_pay'
            }, {
                caption: '支付UV',
                type: 'number',
                help: '已支付',
                row: 'search_order_uv_pay'
            }, {
                caption: '支付订单数',
                type: 'number',
                help: '已支付',
                row: 'search_order_spu_pay'
            }, {
                caption: '支付商品数',
                type: 'number',
                help: '已支付',
                row: 'search_order_com_pay'
            }, {
                caption: '支付件数',
                type: 'number',
                help: '已支付',
                row: 'search_order_total_pay'
            }, {
                caption: '支付转化率',
                type: 'string',
                help: '支付转化率=支付UV/UV',
                row: 'order_uv_pay_uv_ratio'
            }, {
                caption: 'IPV-支付转化率',
                type: 'string',
                help: 'IPV-支付转化率 = 支付UV/IPV_UV',
                row: 'order_uv_pay_ipv_uv_ratio'
            }, {
                caption: '下单-支付转化率',
                type: 'string',
                help: '下单-支付转化率=支付UV/下单UV',
                row: 'order_uv_pay_order_uv_ratio'
            }, {
                caption: '下单商品-支付转化率',
                type: 'string',
                help: '下单商品-支付转化率=支付商品数/下单商品数',
                row: 'order_com_pay_order_com_ratio'
            }, {
                caption: 'CTR',
                type: 'string',
                help: 'CTR=IPV/曝光商品数',
                row: 'ipv_exposure_product_num_ratio'
            }, {
                caption: '客单价',
                type: 'string',
                help: '客单价=支付金额/支付UV',
                row: 'order_sum_pay_order_uv_pay_ratio'
            }, {
                caption: '笔单价',
                type: 'string',
                help: '笔单价=支付金额/支付订单数',
                row: 'order_sum_pay_order_spu_pay_ratio'
            }]
        ],
        filter(data, query, dates) {
            return filter.wordTwo(data, query, dates);
        }
    });

    return Router;
}
