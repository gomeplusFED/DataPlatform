/**
 * @author yanglei
 * @date 20160411
 * @fileoverview 活跃用户分析
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/activeAccountOne",
        modelName : ["NewAccount"],
        version : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/activeAccount/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
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
        paging : true,
        order : [ "-date" ],
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

    Router = new help(Router, {
        router : "/userAnalysis/activeAccount/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "活跃用户",
                help : "当日启动过应用的用户（去重）"
            }
        ]
    });

    return Router;
};