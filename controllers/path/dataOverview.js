/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

module.exports = () => {
    return {
        router : "/11",
            pageTitle : "测试",
        defaultData : [{
            type : "table",
            title : "test",
            query_api : "/test_json"
        }]
    }

};