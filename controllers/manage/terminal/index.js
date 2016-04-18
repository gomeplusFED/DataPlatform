/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 设备终端
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/terminal");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/terminal/modelOne",
        modelName : ["KeyValue"],
        filter_select: [{
            title: '',
            filter_key : 'key_type',
            groups: [{
                key: 'terminal_model',
                value: '机型',
                cell: {
                    title: '',
                    filter_key : 'filter_key',
                    groups : [{
                        key: 'value',
                        value: '新增用户'
                    },{
                        key: 'value3',
                        value: '启动次数'
                    }]
                }
            }, {
                key: 'terminal_resolution',
                value: '分辨率',
                cell: {
                    title: '',
                    filter_key : 'filter_key',
                    groups : [{
                        key: 'value',
                        value: '新增用户'
                    },{
                        key: 'value3',
                        value: '启动次数'
                    }]
                }
            }, {
                key: 'terminal_os',
                value: '操作系统',
                cell: {
                    title: '',
                    filter_key : 'filter_key',
                    groups : [{
                        key: 'value',
                        value: '新增用户'
                    },{
                        key: 'value3',
                        value: '启动次数'
                    }]
                }
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.modelOne(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/terminal/modelTwo",
        modelName : ["KeyValue"],
        excel_export : true,
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

    return Router;
};