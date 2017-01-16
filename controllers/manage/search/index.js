/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索关键指标模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/search/findex");

module.exports = (Router)=>{

    const filter_select = [
        {
            title : "平台选择",
            filter_key : "type",
            groups : [
                {
                    key : "ios",
                    value:"IOS"
                },{
                    key : "android",
                    value:"Android"
                },{
                    key : "pc",
                    value:"PC"
                },{
                    key : "h5",
                    value:"H5"
                }
            ]
        }
    ];
    //商品搜索大盘指标
    Router = new api(Router , {
        router : "/search/indexOne",
        modelName : ["SearchAnalyse"],
        platform : false,
        date_picker_data : 1,
        // showDayUnit: true,
        order : ["-date"],
        params : function(query , params , sendData){
            const date = [];
            const start = query.startTime;
            date.push(util.moment(start));
            date.push(util.moment(start - 24 * 60 * 60 * 1000));
            params.date = date;
            params.search_keyword = "ALL";
            return params;
        },
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["68"], filter_select));
        },
        rows : [
            ["date", "search_result_pv", "search_result_uv", "search_prodet_ipv", "search_prodet_ipv_uv",
                "search_avg_turnpage", "one_one", "one_two"],
            ["date", "search_order_sum", "search_order_uv", "search_order_spu", "search_order_com",
                "search_order_total", "tow_one", "two_two"],
            ["date", "search_order_sum_pay", "search_order_uv_pay", "search_order_spu_pay", "search_order_com_pay",
                "search_order_total_pay", "three_one", "three_two"],
            ["date", "four_one", "four_two", "four_three", "four_four", "four_five"]
        ],
        cols : [
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "PV",
                    type : "string",
                    help : "搜索结果页浏览量"
                },{
                    caption : "UV",
                    type : "string",
                    help : "搜索的用户数"
                },{
                    caption : "IPV",
                    type : "string",
                    help : "搜索引导的商品详情页的浏览次数"
                },{
                    caption : "IPV_UV",
                    type : "string",
                    help : "搜索引导的商品详情页的访问用户数"
                },{
                    caption : "平均翻页数",
                    type : "string",
                    help : "PV维度，去掉搜索无结果和异常情况"
                },{
                    caption : "点击次数转化率",
                    type : "string",
                    help : "点击搜索结果的次数占搜索结果页浏览量的比例"
                },{
                    caption : "点击人数转化率",
                    type : "string",
                    help : "搜索的UV，点击了搜索结果的用户占比"
                }
            ],
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "GMV",
                    type : "string",
                    help : "搜索引导的下单商品售价（来源包括搜索引导的立刻购买、加购、收藏）"
                },{
                    caption : "下单UV",
                    type : "string",
                    help : "搜索引导下单的用户数（user_id）"
                },{
                    caption : "下单订单数",
                    type : "string",
                    help : "搜索引导下单的子订单总数（order_id）"
                },{
                    caption : "下单商品数",
                    type : "string",
                    help : "搜索引导下单的商品总数（item）"
                },{
                    caption : "下单件数",
                    type : "string",
                    help : "搜索引导的商品被买家拍下的累计件数（sku）"
                },{
                    caption : "下单转化率",
                    type : "string",
                    help : "搜索引导的UV，转化为下单用户的比例"
                },{
                    caption : "IPV-下单转化率",
                    type : "string",
                    help : "点击搜索结果的UV，转化为下单用户的比例"
                }
            ],
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "支付金额",
                    type : "string",
                    help : "搜索引导的支付商品售价（来源包括搜索引导的立刻购买、加购、收藏）"
                },{
                    caption : "支付UV",
                    type : "string",
                    help : "搜索引导支付的用户数（user_id）"
                },{
                    caption : "支付订单数",
                    type : "string",
                    help : "搜索引导的支付订单总数（order_id）"
                },{
                    caption : "支付商品数",
                    type : "string",
                    help : "搜索引导的支付商品总数（item）"
                },{
                    caption : "支付件数",
                    type : "string",
                    help : "搜索引导买家完成支付的商品数量（sku）"
                },{
                    caption : "支付转化率",
                    type : "string",
                    help : "搜索引导的UV，转化为支付用户的比例"
                },{
                    caption : "IPV-支付转化率",
                    type : "string",
                    help : "点击搜索结果的UV，转化为支付用户的比例"
                }
            ],
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "下单-支付转化率",
                    type : "string",
                    help : "支付用户占下单用户的比例"
                },{
                    caption : "下单商品-支付转化率",
                    type : "string",
                    help : "支付商品数占下单商品数的比例"
                },{
                    caption : "CTR",
                    type : "string",
                    help : "搜索产生的IPV占搜索展示的商品总数的比例"
                },{
                    caption : "客单价",
                    type : "string",
                    help : "平均每个支付买家的支付金额"
                },{
                    caption : "笔单价",
                    type : "string",
                    help : "平均每笔订单的支付金额"
                }
            ]
        ],
        filter (data , query , dates){
            return filter.indexOne(data , query);
        }
    });

    //商品搜索大盘指标趋势图
    Router = new api(Router , {
        router : "/search/indexTwo",
        modelName : ["SearchAnalyse"],
        platform : false,
        order : ["-date"],
        params : function(query , params , sendData){
            params.search_keyword = "ALL";
            return params;
        },
        selectFilter(req, cb) {
            cb(null, utils.globalPlatform(req.session.userInfo.type["68"], filter_select));
        },
        filter (data , query , dates){
            return filter.indexTwo(data , query , dates);
        }
    });

    return Router;
};