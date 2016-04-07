/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */

module.exports = {
    platformOrder() {
        return {
            path : "/platformRebate/platformOrder",
            name : "平台订单返利汇总",
            display : true,
            defaultData : [{
                type : "table",
                title : "返利订单总览",
                query_api : "/platformRebate/platformOrderOne"
            },{
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/platformOrderTwe"
            },{
                type : "chart",
                title : "返利层级分布",
                query_api : "/platformRebate/platformOrderThree"
            },{
                type : "table",
                title : "返利计划汇总",
                query_api : "/platformRebate/platformOrderFour"
            }]
        }
    },
    inviteRegisterAndEnter(){
        return {
            path : "/platformRebate/platformOrder",
            name : "邀请注册、入驻",
            display : true,
            defaultData : [{
                type : "table",
                title : "返利订单总览",
                query_api : "/platformRebate/platformOrderOne"
            },{
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/platformOrderTwe"
            },{
                type : "chart",
                title : "返利层级分布",
                query_api : "/platformRebate/platformOrderThree"
            },{
                type : "table",
                title : "返利计划汇总",
                query_api : "/platformRebate/platformOrderFour"
            }]
        }
    }
};