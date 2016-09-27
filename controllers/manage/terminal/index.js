/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 设备终端
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/terminal");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/terminal/modelOne",
        modelName : ["KeyValue"],
        platform : false,
        firstSql(query, params) {
            let sql = `SELECT SUM(value) value, SUM(value3) value3, key_name FROM ads2_terminal_key_value WHERE date <= ? AND date >= ? AND key_type=? GROUP BY key_name ORDER BY ${query.filter_key} DESC LIMIT 0,10`,
                _params = [query.endTime, query.startTime, query.key_type];

            return {
                sql : sql,
                params : _params
            }
        },
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
        filter(data, query, dates) {
            return filter.modelOne(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/terminal/modelTwo",
        modelName : ["KeyValue"],
        platform : false,
        paging : [true],
        firstSql(query, params, isCount) {
            if(isCount) {
                let sql = `SELECT COUNT(key_name) count FROM ads2_terminal_key_value WHERE date <= ? AND date >= ? AND key_type=? GROUP BY key_name`,
                    _params = [query.endTime, query.startTime, query.key_type];

                return {
                    sql : sql,
                    params : _params
                };
            } else {
                let sql = `SELECT SUM(value) value, SUM(value3) value3, key_name FROM ads2_terminal_key_value WHERE date <= ? AND date >= ? AND key_type=? GROUP BY key_name ORDER BY value DESC LIMIT ?,?`,
                    page = query.page - 1 || 0,
                    offset = query.from || (page * query.limit),
                    limit = query.to || query.limit || 0,
                    _params = [query.endTime, query.startTime, query.key_type, +offset, +limit];

                return {
                    sql : sql,
                    params : _params
                };
            }
        },
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
        filter(data, query, dates) {
            return filter.modelTwo(data, query.filter_key);
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