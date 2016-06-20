/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */

module.exports = {
    index() {
        return {
            name : "分享数据",
            path : "/share/index",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "分享数据总览",
                    query_api : "/share/indexOne"
                //},
                //{
                //    type : "chart",
                //    title : "分享趋势",
                //    query_api : "/share/indexTwo"
                //},
                //{
                //    type : "chart",
                //    title : "分享渠道分布",
                //    query_api : "/share/indexThree"
                //},
                //{
                //    type : "table",
                //    title : "分享数据详情 ",
                //    query_api : "/share/indexFour"
                }
            ]
        }
    }
};