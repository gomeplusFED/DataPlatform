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
        platform : false,
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
        platform : false,
        paging : true,
        order : ["-date"],
        sum : ["value", "value3"],
        filter_select: [{
            title: '',
            filter_key : 'key_type',
            groups: [{
                key: 'terminal_model',
                value: '机型'
            }, {
                key: 'terminal_resolution',
                value: '分辨率'
            }, {
                key: 'terminal_os',
                value: '操作系统'
            }]
        }],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.modelTwo(data, filter_key);
        },
        rows : [
            [ 'key_name', 'value', 'new_users_rate', 'value3', 'start_up_rate' ]
        ],
        cols : [
            [
                {
                    caption : "",
                    type : 'string'
                },
                {
                    caption : '新增用户',
                    type : 'number'
                },
                {
                    caption : '新增用户占比',
                    type : 'string'
                },
                {
                    caption : '启动次数',
                    type : 'number'
                },
                {
                    caption : '启动次数占比',
                    type : 'string'
                }
            ]
        ]
    });

    return Router;
};