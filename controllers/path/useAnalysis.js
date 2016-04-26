/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 使用分析
 */

module.exports = {
    useTime() {
        return {
            path : "/useAnalysis/useTime",
            name : "使用时长",
            display : true,
            defaultData : [{
                type : "chart",
                title : "单次使用时长分布",
                query_api : "/useAnalysis/useTimeOne"
            },{
                type : "table",
                title : "单次使用时长分布明细",
                query_api : "/useAnalysis/useTimeTwo"
            },{
                type : "chart",
                title : "日使用时长分布",
                query_api : "/useAnalysis/useTimeThree"
            },{
                type : "table",
                title : "日使用时长分布明细",
                query_api : "/useAnalysis/useTimeFour"
            }]
        };
    },
    useFrequency() {
        return {
            path : "/useAnalysis/useFrequency",
            name : "使用频率",
            display : true,
            defaultData : [{
                type : "chart",
                title : "日启动次数分布",
                query_api : "/useAnalysis/useFrequencyOne"
            },{
                type : "table",
                title : "日启动次数分布明细",
                query_api : "/useAnalysis/useFrequencyTwo"
            },{
                type : "chart",
                title : "周启动次数分布",
                query_api : "/useAnalysis/useFrequencyThree"
            },{
                type : "table",
                title : "周启动次数分布明细",
                query_api : "/useAnalysis/useFrequencyFour"
            },{
                type : "chart",
                title : "月启动次数分布",
                query_api : "/useAnalysis/useFrequencyFive"
            },{
                type : "table",
                title : "月启动次数分布明细",
                query_api : "/useAnalysis/useFrequencySix"
            }]
        };
    },
    accessPage() {
        return {
            router : "/useAnalysis/accessPage",
            path : "/useAnalysis/accessPage",
            name : "访问页面",
            display : true,
            defaultData : [{
                type : "chart",
                title : "访问页面",
                query_api : "/useAnalysis/accessPageOne"
            },{
                type : "table",
                title : "访问页面明细",
                query_api : "/useAnalysis/accessPageTwo"
            }]
        };
    },
    accessWap() {
        return {
            path : "/useAnalysis/accessWap",
            name : "访问页面-wap",
            display : true,
            defaultData : [{
                type : "chart",
                title : "受访页面",
                query_api : "/useAnalysis/accessWapOne"
            },{
                type : "table",
                title : "访问页面明细",
                query_api : "/useAnalysis/accessWapTwo"
            }]
        };
    },
    accessPageNum() {
        return {
            path : "/useAnalysis/accessNum",
            name : "访问页面数量分布",
            display : true,
            defaultData : [{
                type : "chart",
                title : "访问页面分布",
                query_api : "/useAnalysis/accessPageNumOne"
            },{
                type : "table",
                title : "访问页面数据明细",
                query_api : "/useAnalysis/accessPageNumTwo"
            }]
        };
    }
};