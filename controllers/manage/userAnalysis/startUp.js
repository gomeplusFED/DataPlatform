/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 启动次数
 */
var api = require("../../../base/main"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/startUpOne",
        modelName : ["NewAccount"],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";
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
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/startUp/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, query, dates) {
            return userAnalysis.One(data,
                [ "start_up" ],
                [ "启动次数/浏览量" ],
                dates
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/startUpTwe",
        modelName : ["NewAccount"],
        paging : [true],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";
            return params;
        },
        order : [ "-date" ],
        rows : [[ 'date', 'start_up', 'startup_per' ]],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption : '启动次数/浏览量',
                    type : 'number',
                    help : "开启应用的次数"
                },
                {
                    caption : '启动次数/浏览量(人均)',
                    type : 'number',
                    help : "启动次数/活跃用户"
                }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return userAnalysis.startUp(data, dates);
        }
    });

    return Router;
};