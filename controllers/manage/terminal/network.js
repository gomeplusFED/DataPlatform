/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 网络及运营商
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/terminal/network");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/terminal/networkOne",
        modelName : ["KeyValue"],
        filter_select: [{
            title: '',
            filter_key : 'key_type',
            groups: [{
                key: 'terminal_network',
                value: '联网方式',
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
                key: 'terminal_isp',
                value: '运营商',
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
            }
            ]
        }],
        filter(data, query, dates) {
            return filter.networkOne(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/terminal/networkTwo",
        modelName : ["KeyValue"],
        paging : [true],
        order : ["-date"],
        sum : ["value", "value3"],
        filter_select: [{
            title: '',
            filter_key : 'key_type',
            groups: [{
                key: 'terminal_network',
                value: '联网方式'
            }, {
                key: 'terminal_isp',
                value: '运营商'
            }]
        }],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return filter.networkTwo(data, query.filter_key);
        },
        rows : [
            [ 'key_name', 'value', 'new_users_rate', 'value3', 'start_up_rate' ]
        ],
        cols : [
            [
                {
                    caption : '',
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