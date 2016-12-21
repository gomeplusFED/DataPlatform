/**
 * @author yanglei
 * @date 20160401
 * @fileoverview 平台返利汇总
 */

module.exports = {
    platformOrder() {
        return {
            id : 60,
            path : "/platformRebate/platformOrder",
            name : "平台订单返利汇总",
            display : true,
            defaultData : [{
                type : "table",
                title : "返利汇总",
                query_api : "/platformRebate/platformOrderSix"
            },{
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
    individualEvent() {
        return {
            id : 61,
            path : "/platformRebate/individualEvent",
            name : "单项单级返利",
            display : true,
            defaultData : [{
                type : "table",
                title : "单项单级返利总览",
                query_api : "/platformRebate/individualEventOne"
            }, {
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/individualEventTwo"
            }, {
                type : "chart",
                title : "返利类型分布",
                query_api : "/platformRebate/individualEventThree"
            //}, {
            //    type : "table",
            //    title : "单项单级返利汇总",
            //    query_api : "/platformRebate/individualEventFour"
            }]
        };
    },
    platformPromotions() {
        return {
            id : 62,
            path : "/platformRebate/platformPromotions",
            name : "平台促销返利",
            display : true,
            defaultData : [{
                type : "table",
                title : "平台促销返利订单总览",
                query_api : "/platformRebate/platformPromotionsOne"
            }, {
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/platformPromotionsTwo"
            }, {
                type : "chart",
                title : "返利层级分布",
                query_api : "/platformRebate/platformPromotionsThree"
            }, {
                type : "chart",
                title : "返利类型分布",
                query_api : "/platformRebate/platformPromotionsFour"
            //}, {
            //    type : "table",
            //    title : "平台促销返利汇总",
            //    query_api : "/platformRebate/platformPromotionsFive"
            }]
        }
    },
    platformBasis() {
        return {
            id : 63,
            path : "/platformRebate/platformBasis",
            name : "平台基础返利",
            display : true,
            defaultData : [{
                type : "table",
                title : "平台基础返利总览",
                query_api : "/platformRebate/platformBasisOne"
            }, {
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/platformBasisTwo"
            }, {
                type : "chart",
                title : "返利层级分布",
                query_api : "/platformRebate/platformBasisThree"
            }, {
                type : "chart",
                title : "返利类型分布",
                query_api : "/platformRebate/platformBasisFour"
            //}, {
            //    type : "table",
            //    title : "平台基础返利汇总",
            //    query_api : "/platformRebate/platformBasisFive"
            }]
        }
    },
    inviteBusiness() {
        return {
            id : 64,
            path : "/platformRebate/inviteBusiness",
            name : "邀请商户分享返利",
            display : true,
            defaultData : [{
                type : "table",
                title : "邀请商户分享返利总览",
                query_api : "/platformRebate/inviteBusinessOne"
            }, {
                type : "chart",
                title : "返利订单趋势",
                query_api : "/platformRebate/inviteBusinessTwo"
            }, {
                type : "chart",
                title : "返利层级分布",
                query_api : "/platformRebate/inviteBusinessThree"
            //}, {
            //    type : "table",
            //    title : "邀请商户分享返利汇总",
            //    query_api : "/platformRebate/inviteBusinessFour"
            }]
        }
    },
    inviteRegisterAndEnter(){
        return {
            id : 65,
            path : "/platformRebate/inviteRegisterAndEnter",
            name : "邀请注册 / 入驻",
            display : true,
            defaultData : [{
                type : "table",
                title : "邀请好友注册总览",
                query_api : "/platformRebate/inviteRegisterAndEnterOne"
            },{
                type : "table",
                title : "邀请商户入驻总览",
                query_api : "/platformRebate/inviteRegisterAndEnterTwo"
            },{
                type : "chart",
                title : "邀请趋势",
                query_api : "/platformRebate/inviteRegisterAndEnterThree"
            },{
                type : "table",
                title : "邀请返利汇总",
                query_api : "/platformRebate/inviteRegisterAndEnterFour"
            }]
        }
    }
};