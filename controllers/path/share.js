/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */

module.exports = {
    inside() {
        return {
            name : "站内分享",
            path : "/share/inside",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "站内分享趋势",
                    query_api : "/share/insideOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/insideTwo"
                }
            ]
        }
    },
    outer() {
        return {
            name : "站外分享",
            path : "/share/outer",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "站内分享趋势",
                    query_api : "/share/outerOne"
                },
                {
                    type : "table",
                    title : "站内分享计数据详情",
                    query_api : "/share/outerTwo"
                }
            ]
        }
    }
};