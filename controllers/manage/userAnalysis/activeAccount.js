/**
 * @author yanglei
 * @date 20160411
 * @fileoverview 活跃用户分析
 */
var api = require("../../../base/api"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/activeAccountOne",
        modelName : ["NewAccount"],
        version : true,
        filter(data, filter_key, dates) {
            return userAnalysis.One(data,
                [ "active_users", "active_account" ],
                [ "活跃用户", "活跃账号" ],
                dates
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/activeAccountTwe",
        modelName : ["NewAccount"],
        version : true,
        rows : [['date', 'active_users', 'active_account' ]],
        cols : [
            [
                {
                    caption: '时间',
                    type: 'string',
                    width: 20
                }, {
                caption: '活跃用户',
                type: 'number'
            }, {
                caption: '活跃账户',
                type: 'number'
            }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return userAnalysis.activeUsersTwe(data, dates);
        }
    });

    return Router;
};