/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/share");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/share/indexOne",
        modelName : ["ShareAnalyzeOverview"],
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/share/index/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return filter.indexOne(data);
        },
        rows : [
            ["shareTimeSum", "shareUserSum", "clickTimeSum", "clickUserSum", "rate"]
        ],
        cols : [
            [
                {
                    caption : "分享次数",
                    type : "number"
                },{
                    caption : "分享人数",
                    type : "number"
                },{
                    caption : "点击次数",
                    type : "number"
                },{
                    caption : "点击人数",
                    type : "number"
                },{
                    caption : "有效分享占比",
                    type : "string"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/share/insideTwo",
        modelName : ["ShareAnalysis"],
        excel_export : true,
        paging : true,
        order : ["-date"],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.insideTwo(data, dates);
        },
        rows : [
            ['date','share_num','open_num']
        ],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                },
                {
                    caption: '分享次数',
                    type: 'number'
                },
                {
                    caption: '打开次数',
                    type: 'number'
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/share/index/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "有效分享占比",
                help : "有效点击次数/分享次数"
            },
            {
                name : "分享回流率",
                help : "分享文案中的链接点击次数/分享次数"
            }
        ]
    });

    return Router;
};