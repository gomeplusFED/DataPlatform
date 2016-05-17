/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/share/outer");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/share/outerOne",
        modelName : ["ShareAnalysis"],
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/share/outer/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.outerOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/share/outerTwo",
        modelName : ["ShareAnalysis"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.outerTwo(data);
        },
        rows : [
            ['channel','open_num','open_num_rate']
        ],
        cols : [
            [
                {
                    caption: '分享平台',
                    type: 'string'
                },
                {
                    caption: '累计打开次数',
                    type: 'number'
                },
                {
                    caption: '打开次数占比',
                    type: 'string'
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/share/outer/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "分享平台",
                help : "社会化平台（QQ,QQ空间，微信，朋友圈，微博）"
            },
            {
                name : "累计打开次数",
                help : "分享到各个平台的累计打开次数"
            },
            {
                name : "打开次数占比",
                help : "分享平台累计打开次数/所有平台累计打开次数"
            }
        ]
    });

    return Router;
};