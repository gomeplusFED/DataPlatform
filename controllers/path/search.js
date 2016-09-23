/**
 * @author Mr.He
 * @date 20160921
 * @fileoverview 搜索推荐右侧模块控制
 */

module.exports = {
    searchIndex(){
        return {
            name : "商品搜索关键指标",
            path : "/search/index",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "商品搜索大盘指标",
                    query_api : "/search/indexOne"
                },
                /*{
                    type : "chart",
                    title: "商品搜索大盘趋势图",
                    query_api : "/search/indexTwo"
                }*/
            ]
        }
    },
    searchWord(){
        return {
            name : "商品搜索关键词分析",
            path : "/search/index2",
            display : true,
            defaultData : [
                // {
                //     type : "table",
                //     title: "商品搜索大盘指标",
                //     query_api : "/search/indexOne"
                // },
                // {
                //     type : "chart",
                //     title: "商品搜索大盘趋势图",
                //     query_api : "/search/indexTwo"
                // }
            ]
        }
    },
    searchRecommend(){
        return {
            name : "商品推荐关键指标",
            path : "/search/index3",
            display : true,
            defaultData : [
                // {
                //     type : "table",
                //     title: "商品搜索大盘指标",
                //     query_api : "/search/indexOne"
                // },
                // {
                //     type : "chart",
                //     title: "商品搜索大盘趋势图",
                //     query_api : "/search/indexTwo"
                // }
            ]
        }
    }
}