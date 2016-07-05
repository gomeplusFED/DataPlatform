/**
 * @author yanglei
 * @date 20160630
 * @fileoverview 实时分析
 */

module.exports = {
    index() {
        return {
            name : "实时概况",
            path : "/realTime",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "实时概况",
                    query_api : "/realTime/one"
                },
                {
                    type : "chart",
                    title : "实时趋势",
                    query_api : "/realTime/two"
                //},
                //{
                //    type : "table",
                //    title : "实时地域分布TOP10",
                //    query_api : "/realTime/three"
                //},
                //{
                //    type : "table",
                //    title : "访问页面分布TOP10",
                //    query_api : "/realTime/four"
                }
            ]
        }
    }
};