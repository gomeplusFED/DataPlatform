/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 商品搜索关键指标模块 api配置
 */

const api = require("../../../base/main");
const utils = require("../../../utils");
const filter = require("../../../filters/search/findex");

module.exports = (Router)=>{

    //商品搜索大盘指标
    Router = new api(Router , {
        router : "/search/indexOne",
        modelName : ["SearchAnalyse"],
        platform : false,
        date_picker_data : 1,
        // showDayUnit: true,
        params : function(query , params , sendData){            
            let date = utils.beforeDate(params.date.from , 2 , params.day_type);
            params.date = date;
            params.search_keyword = "ALL";
            query.date = date;
            return params;
        },
        filter_select : [
            {
                title : "平台选择",
                filter_key : "type",
                groups : [
                    {
                        key : "ALL",
                        value:"全部平台"
                    },
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
        ],
        rows : [
            ["date", "search_result_pv", "search_result_uv", "search_prodet_ipv" , "search_prodet_ipv_uv",
            "search_avg_turnpage",
            "search_avg_respage_staytime",
            "search_avg_prodeta_staytime"
            ],

            ["date" , "search_order_sum" , "search_order_uv", "search_order_spu" , "5_ipv_uv_lv" , "6_uv_lv" , "7_ipv_lv" , "8_ctr"]
        ],
        cols : [
            [{
                caption : "日期",
                type    : "string"
            }, {
                caption : "PV",
                type    : "number",
                help    : "搜索结果页浏览量"
            }, {
                caption : "UV",
                type    : "number",
                help    : "搜索的独立访客数(搜索结果页)"
            }, {
                caption : "IPV",
                type    : "number",
                help    : "搜索引导的商品详情页的浏览次数"
            }, {
                caption : "IPV_UV",
                type    : "number",
                help    : "搜索引导的商品详情页的访问用户数"
            }, {
                caption : "平均翻页数",
                type    : "number",
                help    : "PV维度，去掉搜索无结果和异常情况"
            }, {
                caption : "平均停留时长(s)/页",
                type    : "number",
                help    : "PV维度，去掉搜索无结果和异常情况(未加载出结果页)"
            }, {
                caption : "平均停留时长(s)/商品详情页",
                type    : "number",
                help    : "IPV维度，去掉异常情况(未加载出商品)"
            }],
            [{
                caption : "日期",
                type    : "string",
            }, {
                caption : "GMV/成交金额",
                type    : "number",
                help    : "搜索引导的直接成交额(立即购买、加购、收藏)" 
            }, {
                caption : "成交UV",
                type    : "number",
                help    : "有搜索引导成交记录的用户数"
            }, {
                caption : "成交笔数",
                type    : "number",
                help    : "搜索引导成交的子订单总数" 
            }, {
                caption : "IPV_UV转化率",
                type    : "number",
                help    : "来国美+搜索的UV，点击了搜索结果的用户占比",
                comment : "5_ipv_uv_lv"
            }, {
                caption : "UV成交转化率",
                type    : "number",
                help    : "来国美+搜索的UV，最终通过搜索结果成交的用户占比",
                comment : "6_uv_lv"
            }, {
                caption : "IPV-成交转化率",
                type    : "number",
                help    : "来国美+搜索的UV，通过点击搜索结果的IPV成交的用户占比",
                comment : "7_ipv_lv"
            }, {
                caption : "CTR",
                type    : "number",
                help    : "搜索产生的IPV占搜索展示的商品总数的比例",
                comment : "8_ctr"
            }]
        ],
        filter (data , query , dates){
            return filter.indexOne(data , query , dates);
        }
    });



    return Router;
}