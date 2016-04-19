/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 终端属性
 */

module.exports = {
    model() {
        return {
            name : "设备终端",
            path : "/terminal/model",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "TOP 10",
                    query_api : "/terminal/modelOne"
                },
                {
                    type : "table",
                    title : "明细",
                    query_api : "/terminal/modelTwo"
                }
            ]
        }
    },
    network() {
        return {
            name : "网络及运营商",
            path : "/terminal/network",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "TOP 10",
                    query_api : "/terminal/networkOne"
                },
                {
                    type : "table",
                    title : "明细",
                    query_api : "/terminal/networkTwo"
                }
            ]
        }
    },
    provinces() {
        return {
            name : "地域",
            path : "/terminal/provinces",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title : "TOP 10",
                    query_api : "/terminal/provincesOne"
                },
                {
                    type : "table",
                    title : "明细",
                    query_api : "/terminal/provincesTwo"
                }
            ]
        }
    }
};