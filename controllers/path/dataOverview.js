/**
 * @author luoye
 * @date 20160406
 * @fileoverview 数据概览
 */

module.exports = {
    all() {
        return {
            name: "数据概览",
            path: "/dataOverview",
            display: true,
            defaultData: [{
                type: "table",
                title: "数据概览",
                query_api: "/test_json1"
            }]
        }
    }
};
