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
        modelName : ["ShareAnalysis"],
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/share/inside/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'product',
                value: '商品'
            }, {
                key: 'shop',
                value: '店铺'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.insideOne(data, filter_key, dates);
        }
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
        router : "/share/inside/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "分享次数（站内）",
                help : "被分享到站内的次数，站内（联系人，我的圈子，我的群聊）"
            },
            {
                name : "打开次数（站内）",
                help : "站内分享的链接被点击的次数"
            }
        ]
    });

    return Router;
};