/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 启动次数
 */
var api = require("../../../base/api"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/startUpOne",
        modelName : ["NewAccount"],
        filter(data, filter_key, dates) {
            return userAnalysis.One(data,
                [ "start_up" ],
                [ "启动次数" ],
                dates
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/startUpTwe",
        modelName : ["NewAccount"],
        rows : [[ 'date', 'start_up', 'active_users', 'active_account', 'startup_per' ]],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '启动次数',
                    type : 'number'
                },
                {
                    caption : '活跃用户',
                    type : 'number'
                },
                {
                    caption : '活跃账户',
                    type : 'number'
                },
                {
                    caption : '人均启动次数',
                    type : 'number'
                }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return userAnalysis.startUp(data, dates);
        }
    });

    return Router;
};