/**
 * @author yanglei
 * @date 20160413
 * @fileoverview 启动次数
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/startUpOne",
        modelName : ["NewAccount"],
        version : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/startUp/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
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
        version : true,
        rows : [[ 'date', 'start_up', 'startup_per' ]],
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

    Router = new help(Router, {
        router : "/userAnalysis/startUp/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "启动次数",
                help : "开启应用的次数"
            },
            {
                name : "人均启动次数",
                help : "启动次数/活跃用户"
            }
        ]
    });

    return Router;
};