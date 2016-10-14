/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 版本分析
 */
var api = require("../../../base/main"),
    orm = require("orm"),
    moment = require("moment"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/versionOne",
        modelName : ["UserAnalysisVersion", "UserAnalysisVersion"],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";
            return params;
        },
        procedure : [false, {
            aggregate : {
                value : ["version"]
            },
            sum : ["new_users", "total_users", "start_up"],
            groupBy : ["version"],
            get : ""
        }],
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
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'new_users',
                value: '新增用户'
            }, {
                key: 'total_users',
                value: '活跃用户'
            }, {
                key: 'start_up',
                value: '次数'
            }]
        }],
        filter(data, query, dates) {
            return userAnalysis.versionOne(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/versionTwo",
        modelName : ["UserAnalysisVersion", "UserAnalysisVersion"],
        params(query, params) {
            params.type = query.type || "ios";
            return params;
        },
        secondParams(query, params) {
            params.version = "all";

            return params;
        },
        platform : false,
        paging : [true, false],
        date_picker_data : 1,
        rows : [
            ["version", "total_users", "total_users_rate"]
        ],
        cols : [
            [
                {
                    caption : '版本',
                    type : 'string'
                },{
                    caption : '当天用户数',
                    type : 'number'
                },{
                    caption : '当天用户占比',
                    type : 'string'
                }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data) {
            return userAnalysis.versionTwo(data);
        }
    });

    return Router;
};