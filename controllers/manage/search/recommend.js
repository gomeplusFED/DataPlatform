/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索关键指标模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/search/frecommend");

const TypeObj = {
    title: "平台选择",
    filter_key: "type",
    groups: [{
        key: "ALL",
        value: "全部平台"
    }, {
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
};

module.exports = (Router) => {

    //商品搜索大盘指标
    Router = new api(Router, {
        router: "/search/recommendOne",
        modelName: ["SearchRecommend"],
        platform: false,
        date_picker_data: 1,
        order: ["-date"],
        params: function(query, params, sendData) {
            let date = utils.beforeDate(params.date.from, 2, params.day_type);
            params.date = date;
            query.date = date;
            return params;
        },
        filter_select: [TypeObj],
        rows: [
            ["date",
                "recommend_result_pv",
                "recommend_result_uv",
                "recommend_prodet_ipv",
                "recommend_prodet_ipv_uv",
                "recommend_exposure_product_num",
                "recommend_order_sum"
            ],

            ["date",
                "recommend_order_uv",
                "recommend_order_spu",
                "ipv_uv_lv",
                "uv_lv",
                "ipv_lv",
                "ctr_lv"
            ]
        ],
        cols: [
            [{
                caption: "日期",
                type: "string"
            }, {
                caption: "PV",
                type: "number",
                help: "推荐位所在页面的浏览量"
            }, {
                caption: "UV",
                type: "number",
                help: "推荐位所在页面的浏览用户数"
            }, {
                caption: "IPV",
                type: "number",
                help: "推荐位引导的商品详情页的浏览次数"
            }, {
                caption: "IPV_UV",
                type: "number",
                help: "推荐位引导的商品详情页的访问账号数"
            }, {
                caption: "曝光商品数",
                type: "number",
                help: "推荐位商品曝光数量(按用户浏览计算,不按加载计算)"
            }, {
                caption: "GMV",
                type: "number",
                help: "推荐引导的直接成交额"
            }],


            [{
                caption: "日期",
                type: "string",
            }, {
                caption: "成交UV",
                type: "number",
                help: "推荐引导成交记录的账号数"
            }, {
                caption: "成交笔数",
                type: "number",
                help: "推荐引导成交的子订单总数"
            }, {
                caption: "IPV_UV转化率",
                type: "number",
                help: "页面UV中，点击了推荐的账号占比",
                comment: "ipv_uv_lv"
            }, {
                caption: "UV成交转化率",
                type: "number",
                help: "成交的账号数占推荐位页面UV的比例",
                comment: "uv_lv"
            }, {
                caption: "IPV-成交转化率",
                type: "number",
                help: "成交的账户数占IPV_UV的比例",
                comment: "ipv_lv"
            }, {
                caption: "CTR",
                type: "number",
                help: "页面PV中,点击了推荐次数占比",
                comment: "ctr_lv"
            }]
        ],
        filter(data, query, dates) {
            return filter.recommendOne(data, query, dates);
        }
    });

    //商品搜索大盘指标趋势图
    Router = new api(Router, {
        router: "/search/recommendTwo",
        modelName: ["SearchRecommend"],
        platform: false,
        order: ["-date"],
        params: function(query, params, sendData) {
            return params;
        },
        filter_select: [TypeObj],
        filter(data, query, dates) {
            return filter.recommendTwo(data, query, dates);
        }
    });

    return Router;
}
