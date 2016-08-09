/**
 * @author yanglei
 * @date 20160323
 * @fileoverview 用户分析
 */
var api = require("../../../base/api"),
    moment = require("moment"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/newUsersOne",
        modelName : ["NewAccount"],
        version : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/newUsers/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return userAnalysis.One(data,
                [ "new_users", "new_account" ],
                [ "新增用户", "新增账户" ],
                dates
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/newUsersTwe",
        modelName : ["NewAccount"],
        version : true,
        paging : true,
        order : ["-date"],
        rows : [['date', 'new_users', 'new_users_rate', 'new_account', 'new_account_rate' ]],
        cols : [
            [
                {
                    caption: '时间',
                    type: 'string',
                    width: 20
                }, {
                caption: '新增用户',
                type: 'number'
            }, {
                caption: '新增用户占比',
                type: 'string'
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '新增账户占比',
                type: 'string'
            }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return userAnalysis.newUsersTwe(data, dates);
        }
    });

    Router = new help(Router, {
        router : "/userAnalysis/newUsers/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新用户占比",
                help : "新用户/访客数"
            },
            {
                name : "新增账户占比",
                help : "新增账户占比"
            }
        ]
    });

    return Router;
};