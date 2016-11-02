/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 用户登陆控制器和权限校验
 */
var ldap = require('ldapjs');
var config = require('../config');
var lodash = require('lodash');
var ldapJson = require("../db/ldap.json");

var username = ldapJson.username;
var password = ldapJson.password;
var ldapurl = ldapJson.ldapurl;
var superAdminInfo = {
    username: "superAdmin",
    password: "12345678"
};

module.exports = function(Router) {

    Router.get('/login', function(req, res) {
        if (req.session.isLogin) {
            res.redirect('/');
        } else {
            res.render('login/login', {
                from: req.query.from
            });
        }
    });

    function unbind(client, next) {
        client.unbind(function(err) {
            if (err) {
                next(err);
            }
        });
    }

    function saveLogin(req, res, remember, email, userInfo) {
        var maxAge = 1000 * 60 * 60 * 24; //2小时
        if (remember) {
            maxAge = 1000 * 60 * 60 * 24 * 7; // 一周
        }
        userInfo.limited =  JSON.parse(userInfo.limited);
        userInfo.export =  JSON.parse(userInfo.export);
        req.sessionOptions.maxAge = new Date(Date.now() + maxAge);
        req.session.userInfo = userInfo;
        req.session.isLogin = true;
    }

    Router.post('/logout', function(req, res) {
        req.session = null;
        res.redirect('/login');
    });

    Router.post('/login', function(req, res, next) {
        if (req.session.isLogin) {
            res.redirect('/');
        } else {
            //本地要有个数据库
            var email = req.body.email,
                pwd = req.body.password,
                from = req.body.from,
                remember = req.body.remember,
                hash = req.body.hash;

            //直接去ldap交换验证
            if (!email || !pwd) {
                req.flash('密码和账户不正确');
                res.redirect('back');
                return;
            } else if (email === superAdminInfo.username && pwd === superAdminInfo.password) {
                /*超级管理员不进行ldap验证*/
                req.models.User2.find({
                    username: email
                }, function(err, ret) {
                    if (err) {
                        next(new Error("用户不存在"));
                    } else {
                        if (ret.length) {
                            saveLogin(req, res, remember, email, ret[0]);
                            res.redirect(from + hash || '/');
                        } else {
                            req.models.User2.create({
                                name : "超级用户",
                                username : "superAdmin",
                                role : "超级管理员",
                                status : 1,
                                limited : '{"0":[0,1,2]}',
                                is_admin : 99
                            }, (err, data) => {
                                if(!err) {
                                    saveLogin(req, res, remember, email, data);
                                    res.redirect(from + hash || '/');
                                } else {
                                    next(new Error("用户不存在"));
                                }
                            })
                        }
                    }
                });
                return;
            }
            var client = ldap.createClient({
                url: ldapurl,
                timeout: 5000,
                connectTimeout: 10000
            });
            client.bind(username, password, function(err) {
                if (err) {
                    unbind(client, next);
                } else {
                    if (email.indexOf("@") < 0) {
                        email += '@gomeplus.com';
                    }
                    client.search('ou=美信,dc=meixin,dc=com', {
                        filter: '(userprincipalname=' + email + ')',
                        scope: 'sub'
                    }, function(err, resp) {
                        var entrys = [];
                        resp.on('searchEntry', function(entry) {
                            entrys.push(entry);
                        });
                        resp.on('error', next);
                        resp.on('end', function() {
                            if (entrys.length === 1) {
                                var entry = entrys[0];
                                client.bind(entry.object.dn, pwd, function(err) {
                                    //验证成功
                                    if (err) {
                                        unbind(client, next);
                                        req.flash('密码和账户不正确');
                                        res.redirect('back');
                                    } else {
                                        req.models.User2.find({
                                            email: email
                                        }, function(err, ret) {
                                            if (err) {
                                                unbind(client, next);
                                            } else {
                                                if (ret.length) {
                                                    if(ret[0].status) {
                                                        saveLogin(req, res, remember, email, ret[0]);
                                                        unbind(client, next);
                                                        res.redirect(from + hash || '/');
                                                    } else {
                                                        unbind(client, next);
                                                        req.flash('该用户已被禁用');
                                                        res.redirect('back');
                                                    }
                                                } else {
                                                    //不存在本地用户,写入本地用户
                                                    var name = entry.object.dn.match(/CN=(.*?)($|-)/)[1];
                                                    req.models.User2.create({
                                                        name: name,
                                                        username : entry.object.sAMAccountName,
                                                        email : email,
                                                        limited : "{}",
                                                        export : "{}",
                                                        department : entry.object.dn.match(/OU=(.*?),/)[1],
                                                        status : 1,
                                                        date : new Date().getTime(),
                                                        is_admin : 0
                                                    }, function(err, ret) {
                                                        if (err) {
                                                            unbind(client, next);
                                                        } else {
                                                            saveLogin(req, res, remember, email, ret);
                                                            unbind(client, next);
                                                            res.redirect(from + hash || '/');
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                unbind(client, next);
                                req.flash('密码和账户不正确');
                                res.redirect('back');
                            }
                        });
                    });
                }
            });
        }
    });

    Router.get(/^((?!\/dist).)*$/, function(req, res, next) {
        if (req.session.isLogin) {
            /*用户输入浏览器地址栏URL路由权限控制*/
            next();
        } else {
            var form = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect('/login?from=' + encodeURIComponent(form));
        }
    });

    return Router;
};
