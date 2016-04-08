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
                type : "chart",
                title : "返利类型分布",
                query_api : "/platformRebate/platformOrderFour"
            },{
                type : "table",
                title : "返利计划汇总",
                query_api : "/platformRebate/platformOrderFive"
            }]
        }
    },
    inviteRegisterAndEnter(){
        return {
            path : "/platformRebate/inviteRegisterAndEnter",
            name : "邀请注册、入驻",
            display : true,
            defaultData : [{
                type : "table",
                title : "邀请好友注册总览",
                query_api : "/platformRebate/inviteRegisterAndEnterOne"
            },]
        }
    }
};


// {
//                 type : "table",
//                 title : "邀请商户入驻总览",
//                 query_api : "/platformRebate/inviteRegisterAndEnterTwo"
//             },{
//                 type : "chart",
//                 title : "邀请趋势",
//                 query_api : "/platformRebate/inviteRegisterAndEnterThree"
//             },{
//                 type : "table",
//                 title : "邀请返利汇总",
//                 query_api : "/platformRebate/inviteRegisterAndEnterFour"
//             }