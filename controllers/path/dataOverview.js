/**
 * @author luoye
 * @date 20160406
 * @fileoverview 数据概览
 */

var route = function() {
    return {
        path: "/dataOverview",
        name: "测试",
        display: true,
        defaultData: [{
            type: "table",
            title: "test",
            query_api: "/test_json1"
        }]
    }
}

module.exports = {
    route: route,
};
