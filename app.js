/**
 * @author fuqiang
 * @fileoverview main app.js
 * @date 20151201
 */
var ejs = require('ejs');
var express = require('express');
var session = require('cookie-session');
var lactate = require('lactate');
var config = require('./config');
var routers = require('./routers');
var bodyParser = require('body-parser');
var flash = require('flashify');
var mysql = require('./models/mysql');
var app = express();
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var orm = require('orm');

orm.settings.set("connection.pool", true);
Object.keys(config).forEach(function(key) {
    app.locals[key] = config[key];
});

app.use(function(req, res, next) {
    if (req.headers['user-agent'].indexOf('Chrome') === -1) {
        res.send('请使用谷歌浏览器');
    } else {
        next();
    }
});

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

//parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
    extended: false
}));

//parse application/json 
app.use(bodyParser.json());

app.set('trust proxy', 1);

app.use(session({
    name: 'DataPlatform',
    secret: 'DataPlatform'
}));

app.use(flash);

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//载入view helps
require('./helps')(app);

new mysql(app);

routers.forEach(function(router) {
    app.use(router);
});

app.use(lactate.static(__dirname + '/static'));

app.use(function() {
    var args = arguments;
    var isErr = args[0] instanceof Error;
    if (isErr) {
        args[2].status(500).send(args[0]);
    } else {
        args[2]();
    }
});

app.use((err, req, res, next) => {
    res.send({
        iserro: true
    });
});

// 测试
app.get('/viewtest', (req, res, next) => {
    res.render('main/index.html')
})
app.get('/test_json1', (req, res) => {
    res.send({
        components: {
            excel_export: true,
            date_picker: {
                show: true,
                defaultData: 7
            },
            drop_down: {
                platform: true,
                channel: false,
                version: false,
                coupon: false,
            },
            level_select: {
                show: true,
                data: 'data'
            },
            filter_select: [{
                title: '',
                filter_key: 'filter1',
                groups: [{
                    key: 'date',
                    value: '日期'
                }, {
                    key: 'area',
                    value: '地区'
                }]
            }, {
                title: '',
                filter_key: 'filter2',
                groups: [{
                    key: 'date',
                    value: '一页'
                }, {
                    key: 'area',
                    value: '两页'
                }]
            }]
        }
    })
})
app.get('/test_json1_json', (req, res) => {
    setTimeout(function() {
        res.send({
            code: 200,
            modelData: [{
                data: [{
                    "channel": "ALL",
                    "new_users": 3305,
                    "active_users": 16,
                    "start_up": 36,
                    "new_users_rate": "100%"
                }, {
                    "channel": "ALL",
                    "new_users": 3305,
                    "active_users": 16,
                    "start_up": 36,
                    "new_users_rate": "100%"
                }],
                rows: ["channel", "new_users", "active_users", "start_up", "new_users_rate"],
                cols: [{
                    "caption": "渠道名",
                    "type": "string"
                }, {
                    "caption": "新增用户",
                    "type": "number"
                }, {
                    "caption": "活跃用户",
                    "type": "number"
                }, {
                    "caption": "启动次数",
                    "type": "number"
                }, {
                    "caption": "新用户占比",
                    "type": "number"
                }]
            }, {
                data: [{
                    "channel": "ALL",
                    "new_users": 3305,
                    "active_users": 16,
                    "start_up": 36,
                    "new_users_rate": "100%"
                }],
                rows: ["channel", "new_users", "active_users", "start_up", "new_users_rate"],
                cols: [{
                    "caption": "渠道名",
                    "type": "string"
                }, {
                    "caption": "新增用户",
                    "type": "number"
                }, {
                    "caption": "活跃用户",
                    "type": "number"
                }, {
                    "caption": "启动次数",
                    "type": "number"
                }, {
                    "caption": "新增用户比",
                    "type": "string"
                }]
            }],
            components: {
                flexible_btn: [{
                    content: '导出',
                    preMethods: ['excel_export','test'],
                    customMethods: ''
                }, {
                    content: '<a href="asdasd" target="_blank">查看全部</a>',
                    preMethods: [],
                    customMethods: 'console.log("!!!");'
                }],
                date_picker: {
                    show: true,
                    defaultData: 7
                },
                drop_down: {
                    platform: true,
                    channel: false,
                    version: false,
                    coupon: false,
                },
                level_select: {
                    show: true,
                    data: 'data'
                },
                filter_select: [{
                    title: '',
                    filter_key: 'filter1',
                    groups: [{
                        key: 'date',
                        value: '日期'
                    }, {
                        key: 'area',
                        value: '地区'
                    }]
                }, {
                    title: '',
                    filter_key: 'filter1',
                    groups: [{
                        key: 'date',
                        value: '日期'
                    }, {
                        key: 'area',
                        value: '地区'
                    }]
                }]
            }
        })
    }, 100);


})
app.get('/test_json2', (req, res) => {
    res.send({
        components: {
            excel_export: false,
            date_picker: {
                show: false,
                defaultData: 1
            },
            drop_down: {
                platform: true,
                channel: false,
                version: true,
                coupon: false,
            },
            level_select: {
                show: true,
                data: 'data'
            },
            filter_select: [{
                title: '指标选择',
                filter_key: 'filter1',
                groups: [{
                    key: 'filter_argv1',
                    value: '指标1'
                }, {
                    key: 'filter_argv2',
                    value: '指标2'
                }]
            }, {
                title: '指标选择',
                filter_key: 'filter2',
                groups: [{
                    key: 'filter_argv1',
                    value: '指标1'
                }, {
                    key: 'filter_argv2',
                    value: '指标2'
                }]
            }]
        }
    })
})
app.get('/test_json2_json', (req, res) => {
    res.send({
        code: 200,
        modelData: [{
            type: 'pie',
            data: {
                '2016-03-21': {
                    pv: 1000,
                    uv: 500
                },
                '2016-03-22': {
                    pv: 2000,
                    uv: 1000
                },
                '2016-03-23': {
                    pv: 3000,
                    uv: 1500
                },
                '2016-03-24': {
                    pv: 4000,
                    uv: 2000
                },
                '2016-03-25': {
                    pv: 5000,
                    uv: 2500
                },
            },
            map: {
                pv: '访问数',
                uv: '访客数'
            },
            config: {
                stack: true // 是否堆叠
            }
        }, {
            type: 'line',
            data: {
                '2016-03-21': {
                    pv: 1000,
                    uv: 500
                },
                '2016-03-22': {
                    pv: 2000,
                    uv: 1000
                },
                '2016-03-23': {
                    pv: 3000,
                    uv: 1500
                },
                '2016-03-24': {
                    pv: 4000,
                    uv: 2000
                },
                '2016-03-25': {
                    pv: 5000,
                    uv: 2500
                },
            },
            map: {
                pv: '访问数',
                uv: '访客数'
            },
            config: {
                stack: false // 是否堆叠
            }
        }],
        components: {
            excel_export: false,
            date_picker: {
                show: false,
                defaultData: 1
            },
            drop_down: {
                platform: true,
                channel: false,
                version: true,
                coupon: false,
            },
            level_select: {
                show: true,
                data: 'data'
            },
            filter_select: [{
                title: '指标选择',
                filter_key: 'filter1',
                groups: [{
                    key: 'filter_argv1',
                    value: '指标1'
                }, {
                    key: 'filter_argv2',
                    value: '指标2'
                }]
            }, {
                title: '指标选择',
                filter_key: 'filter2',
                groups: [{
                    key: 'filter_argv1',
                    value: '指标1'
                }, {
                    key: 'filter_argv2',
                    value: '指标2'
                }]
            }]
        }
    })
})



app.listen(7879);
