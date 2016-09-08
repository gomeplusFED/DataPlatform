/**
 * @author yanglei
 * @date 20160323
 * @fileoverview 用户分析
 */
var api = require("../../../base/main"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/newUsersOne",
        modelName : ["NewAccount"],
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/newUsers/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params(query, params) {
            params.type = query.type || 'ios';
            return params;
        },
        global_platform : {
            show: true,
            key: 'type',
            list: [{
                key: 'ios',
                name: 'IOS'
            }, {
                key: 'android',
                name: 'Android'
            }, {
                key: 'app',
                name: 'APP'
            }, {
                key: 'pc',
                name: 'PC'
            }, {
                key: 'm',
                name: 'H5'
            }]
        },
        filter(data, query, dates) {
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
        paging : [true],
        platform : false,
        params(query, params) {
            params.type = query.type || 'ios';

            return params;
        },
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
                type: 'string',
                help : "新用户/访客数"
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '新增账户占比',
                type: 'string',
                help : "新增账户占活跃账户比重"
            }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return userAnalysis.newUsersTwe(data, dates);
        }
    });

    return Router;
};