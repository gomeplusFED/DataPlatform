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

// app.use((err, req, res, next) => {
//     res.send({
//         iserro: true
//     });
// });

app.listen(7879);
