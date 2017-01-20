/**
 * @author fuqiang
 * @fileoverview main app.js
 * @date 20151201
 */
var ejs = require('ejs');
var express = require('express');
var session = require('cookie-session');
var lactate = require('lactate');
var config = require('./config/config');
var bodyParser = require('body-parser');
var flash = require('flashify');
var mysql = require('./models2/mysql');
var app = express();
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var orm = require('orm');
var redis = require("ioredis");
var redisInfo = require("./db/redis.json");
var redisConfig = require("./db/config.json").redis;
var cluster = new redis.Cluster(redisInfo[redisConfig]);
global.cluster = cluster;
var routers = require('./routers');
var log4js       = require("./log");




orm.settings.set("connection.pool", true);
// orm.settings.set("connection.debug", true);
Object.keys(config).forEach(function(key) {
    app.locals[key] = config[key];
});

// 测试使用 
// var logger = require("morgan");
// app.use(logger('dev'));

/* 日志配置，启用 */
log4js.configure();
app.use(log4js.useLog());

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
    console.log(err);
    if (err) {
        res.json({
            iserro: true
        });
    }
});

if(process.env.NODE_ENV != "development"){
    app.use((req, res, next) => {
        res.redirect("/");
    });
}
    

app.listen(7879 , function(){
    console.log("启动成功" , new Date().toLocaleTimeString());
});

