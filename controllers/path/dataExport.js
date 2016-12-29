/**
 * @author 詹韬
 * @date 20161226
 * @fileoverview O2M店铺流量交易
 */

module.exports = {
    shopflow() {
        return {
            name : "O2M店铺流量交易",
            path : "/dataExport/shopFlow",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "O2M店铺流量交易",
                    query_api : "/dataExport/shopFlowOne"
                }
            ]
        }
    }
};