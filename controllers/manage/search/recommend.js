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
        modelName : ["RecommendAnalyseNew"],
        platform: false,
        date_picker_data: 1,
        order: ["-date"],
        params: function(query, params, sendData) {
            const date = [];
            const start = new Date(query.startTime);
            date.push(utils.moment(start));
            date.push(utils.moment(start - 24 * 60 * 60 * 1000));
            params.date = date;
            return params;
        },
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["70"], [TypeObj , {
                title: "推荐位所在页面",
                filter_key: "recommend_page",
                groups: [{
                    key: "1",
                    value: "逛逛首页"
                }, {
                    key: "2",
                    value: "商品详情页"
                }]
            }]));
        },
        rows: [
            ["date", "recommend_result_pv", "recommend_result_uv", "recommend_prodet_ipv", "recommend_prodet_ipv_uv",
                "one_one", "one_two"],
            ["date", "recommend_order_sum", "recommend_order_uv", "recommend_order_spu", "recommend_order_com",
                "recommend_order_total", "two_one", "two_two"],
            ["date", "recommend_order_sum_pay", "recommend_order_uv_pay", "recommend_order_spu_pay",
                "recommend_order_com_pay", "recommend_order_total_pay", "three_one", "three_two"],
            ["date", "four_one", "four_two", "four_three", "four_four"]
        ],
        cols: [
            [
                {
                    caption : "日期"
                },{
                    caption : "PV",
                    help : "推荐位所在页面浏览量"
                },{
                    caption : "UV",
                    help : "搜索的独立访客数（异常情况：用户未登录）"
                },{
                    caption : "IPV",
                    help : "推荐位引导的商品详情页的浏览次数"
                },{
                    caption : "IPV_UV",
                    help : "推荐位引导的商品详情页的访问用户数"
                },{
                    caption : "点击次数转化率",
                    help : "推荐位所在页面PV中,点击了推荐的次数占比"
                },{
                    caption : "点击人数转化率",
                    help : "推荐位所在页面UV中，点击了推荐位的独立访客占比"
                }
            ],
            [
                {
                    caption : "日期"
                },{
                    caption : "GMV",
                    help : "推荐位引导的下单商品售价(来源包括立即购买、加购、收藏),以商品售价为单位计算"
                },{
                    caption : "下单UV",
                    help : "推荐位引导下单的用户数(user_id）"
                },{
                    caption : "下单订单数",
                    help : "推荐位引导下单的子订单总数(order_id)"
                },{
                    caption : "下单商品数",
                    help : "推荐位引导下单的商品总数(item)"
                },{
                    caption : "下单件数",
                    help : "推荐位引导下单的商品件数(quantity)"
                },{
                    caption : "下单转化率",
                    help : "推荐位所在页面的UV，转化为下单用户的比例"
                },{
                    caption : "IPV-下单转化率",
                    help : "点击推荐位的UV，转化为下单用户的比例"
                }
            ],
            [
                {
                    caption : "日期"
                },{
                    caption : "支付金额",
                    help : "推荐位引导的支付商品售价(来源包括立即购买、加购、收藏),以商品售价为单位计算"
                },{
                    caption : "支付UV",
                    help : "推荐位引导支付的用户数(user_id）"
                },{
                    caption : "支付订单数",
                    help : "推荐位引导的支付子订单总数(order_id)"
                },{
                    caption : "支付商品数",
                    help : "推荐位引导的支付商品总数(item)"
                },{
                    caption : "支付件数",
                    help : "推荐位引导下单的商品件数(quantity)"
                },{
                    caption : "支付转化率",
                    help : "推荐位所在页面的UV，转化为支付用户的比例"
                },{
                    caption : "IPV-支付转化率",
                    help : "点击推荐位的UV，转化为支付用户的比例"
                }
            ],
            [
                {
                    caption : "日期"
                },{
                    caption : "下单-支付转化率",
                    help : "支付用户占下单用户的比例"
                },{
                    caption : "下单商品-支付转化率",
                    help : "支付商品数占下单商品数的比例"
                },{
                    caption : "客单价",
                    help : "平均每个支付买家的支付金额"
                },{
                    caption : "笔单价",
                    help : "平均每笔订单的支付金额"
                }
            ]
        ],
        filter(data, query) {
            return filter.recommendOne(data, query);
        }
    });

    //商品搜索大盘指标趋势图
    Router = new api(Router, {
        router: "/search/recommendTwo",
        modelName : ["RecommendAnalyseNew"],
        platform: false,
        order: ["-date"],
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["70"], [TypeObj]));
        },
        filter(data, query) {
            return filter.recommendTwo(data, utils.timesTwo(query.startTime, query.endTime, "1"));
        }
    });

    return Router;
};
