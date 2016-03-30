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
            filter_select: {
                show: false,
                type: 'btn/radio',
                data: {
                    title: '指标选择',
                    groups: [{
                        key: '',
                        value: ''
                    }, {
                        key: '',
                        value: ''
                    }]
                }
            },
            filter_select_level: {
                show: true,
                data: [{
                    title: '',
                    groups: [],
                    cell: {
                        title: '',
                        key: '',
                        groups: [{
                            key: '',
                            value: ''
                        }, {
                            key: '',
                            value: ''
                        }, {
                            key: '',
                            value: ''
                        }],
                    }
                }]
            }
        }
    })
})
app.get('/test_json2', (req, res) => {
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
                version: true,
                coupon: false,
            },
            level_select: {
                show: true,
                data: 'data'
            },
            filter_select: {
                show: false,
                type: 'btn/radio',
                data: {
                    title: '指标选择',
                    groups: [{
                        key: '',
                        value: ''
                    }, {
                        key: '',
                        value: ''
                    }]
                }
            },
            filter_select_level: {
                show: true,
                data: [{
                    title: '',
                    groups: [],
                    cell: {
                        title: '',
                        key: '',
                        groups: [{
                            key: '',
                            value: ''
                        }, {
                            key: '',
                            value: ''
                        }, {
                            key: '',
                            value: ''
                        }],
                    }
                }]
            }
        }
    })
})

//app.use((err, req, res, next) => {
//  res.render('include/404');
//});

app.listen(7879);
