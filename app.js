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
//  
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

//app.use("/dataOverview", (req, res, next) => {
//    res.render("table");
//});


// 测试
app.get('/viewtest', (req, res, next) => {
    res.render('main/index.html')
})
app.get('/404', (req, res, next) => {
    res.render('include/404')
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
})
app.get('/test_json1_json', (req, res) => {
    res.send({
        modelData: {
            data: [{
                "channel": "ALL",
                "new_users": 3305,
                "active_users": 16,
                "start_up": 36,
                "new_users_rate": "100%"
            }],
            code: 200,
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
        },
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

//app.use((err, req, res, next) => {
//  res.render('include/404');
//});

app.listen(7879);
