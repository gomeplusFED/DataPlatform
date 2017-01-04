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
    title: "平台选择",
    filter_key: "type",
    groups: [{
        key: "ios",
        value: "IOS"
    }, {
        key: "android",
        value: "Android"
    }, {
        key: "pc",
        value: "PC"
    }, {
        key: "h5",
        value: "H5"
    }]
}];


module.exports = (Router) => {

    //商品搜索关键词分析－入口位置占比
    Router = new api(Router, {
        router: "/search/WordOne",
        modelName : ["SearchSource"],
        platform: false,
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["69"], TypeObj));
        },
        params(query, params){
            params.search_source = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.wordOne(data, query, dates);
        }
    });

    //商品搜索关键词分析－来源占比
    Router = new api(Router, {
        router: "/search/WordTwo",
        modelName : ["SearchSource"],
        platform: false,
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["69"], TypeObj));
        },
        params(query, params){
            params.search_position = "ALL";
            return params;
        },
        filter(data, query, dates) {
            return filter.wordTwo(data, query, dates);
        }
    });


    //top 100
    Router = new api(Router, {
        router: "/search/WordThree",
        modelName : ["SearchAnalyse"],
        platform: false,
        order: ["-search_result_pv"],
        excel_export : true,
        paging : [true],
        params(query, params) {
            params.search_keyword = orm.not_in(["ALL"]);

            return params;
        },
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["69"], TypeObj));
        },
        rows: [
            [
                "search_keyword",
                "date",
                "search_recall_product",
                "search_result_pv",
                "search_result_uv",
                "search_prodet_ipv",
                "search_prodet_ipv_uv",
                "search_order_sum",
                "search_order_uv",
                "search_order_spu",
                "uv_lv",
                "ipv_lv",
                "ctr_lv"
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
            }, {
                caption: 'GMV',
                type: 'number',
                help: '搜索引导的直接成交额(立即购买、加购、收藏)',
                row: 'search_order_sum'
            }, {
                caption: '成交UV',
                type: 'number',
                help: '有搜索引导成交记录的用户数',
                row: 'search_order_uv'
            }, {
                caption: '成交笔数',
                type: 'number',
                help: '搜索引导成交的子订单总数',
                row: 'search_order_spu'
            }, {
                caption: 'UV成交转化率',
                type: 'string',
                help: '来国美+搜索的UV，最终通过搜索结果成交的用户占比 ---UV成交转化率 = 成交UV/UV',
                row: 'uv_lv'
            }, {
                caption: 'IPV-成交转化率',
                type: 'string',
                help: '来国美+搜索的UV，通过点击搜索结果的IPV成交的用户占比 ---IPV-成交转化率 = 成交UV/IPV_UV',
                row: 'ipv_lv'
            }, {
                caption: 'CTR',
                type: 'string',
                help: '搜索产生的IPV占搜索展示的商品总数的比例 ---CTR=IPV/曝光商品数',
                row: 'ctr_lv'
            }]
        ],
        filter(data, query, dates) {
            return filter.wordThree(data, query, dates);
        }
    });

    return Router;
}
