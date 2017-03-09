/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 用户登陆控制器和权限校验
 */
var ldap = require('ldapjs');
var config = require('../config');
var lodash = require('lodash');
var username = 'LDAP_SysDevDept';
var password = '3m4>9kj9+@-du!p3';
const env = require("../db/config.json").db;
var ldapurl = 'ldap://10.69.100.4';
const login = {
    "test" : "http://10.58.56.172:8080/dataApp",
    "pro" : "http://bigdata.ds.gome.com.cn/"
};
const md5 = require("md5");
var superAdminInfo = {
    username: "superAdmin",
    password: "gome123456"
};

module.exports = function(Router) {

    Router.get('/register', function(req, res) {
        if (req.session.isLogin && !req.session.userInfo.isBi) {
            res.redirect('/');
        } else {
            req.session.destroy((err) => {
                console.log(err);
            });
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
        userInfo.limited =  JSON.parse(userInfo.limited || "{}");
        userInfo.export =  JSON.parse(userInfo.export || "{}");
        userInfo.sub_pages =  JSON.parse(userInfo.sub_pages || "{}");
        userInfo.type =  JSON.parse(userInfo.type || "{}");
        req.session.cookie.maxAge = new Date(Date.now() + maxAge);
        // req.sessionOptions.maxAge = new Date(Date.now() + maxAge);
        req.session.userInfo = userInfo;
        req.session.isLogin = true;
    }

    Router.post('/logout', function(req, res) {
        req.session.destroy((err) => {
            console.log(err);
        });
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
                                limited : '{"0":["0","1","2"]}',
                                is_admin : 99,
                                sub_pages : "{}",
                                type : "{}"
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
                        email += '@ds.gome.com.cn';
                    }
                    client.search('dc=ds,dc=gome,dc=com,dc=cn', {
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
                                client.bind(entry.objectName, pwd, function(err) {
                                    //验证成功
                                    if (err) {
                                        unbind(client, next);
                                        req.flash('密码和账户不正确');
                                        res.redirect('back');
                                    } else {
                                        let _email = "";
                                        for(let key of entry.attributes) {
                                            if(key.vals[0].indexOf("@") !== -1) {
                                                _email = key.vals[0];
                                            }
                                        }
                                        if(_email.indexOf("SMTP:") !== -1) {
                                            _email = _email.substr(5);
                                        }
                                        //const _email = entry.attributes[35].vals[0];
                                        const un = entry.objectName.match(/CN=(.*?)[(]/)[1];
                                        const name = entry.objectName.match(/[(](.*?)[\.]/)[1];
                                        const department = entry.objectName.match(/[\.]+(.*?)[)]+/)[1];
                                        req.models.User2.find({
                                            username: un
                                        }, function(err, ret) {
                                            if (err) {
                                                unbind(client, next);
                                            } else {
                                                if (ret.length) {
                                                    if(ret[0].status) {
                                                        if(ret[0].name === name
                                                            && ret[0].username === un
                                                            && ret[0].department === department
                                                            && ret[0].email === _email) {
                                                            saveLogin(req, res, remember, email, ret[0]);
                                                            unbind(client, next);
                                                            res.redirect(from + hash || '/');
                                                        } else {
                                                            ret[0].name = name;
                                                            ret[0].username = un;
                                                            ret[0].department = department;
                                                            ret[0].email = _email;
                                                            ret[0].save((err) => {
                                                                if(err) {
                                                                    unbind(client, next);
                                                                } else {
                                                                    saveLogin(req, res, remember, email, ret[0]);
                                                                    unbind(client, next);
                                                                    res.redirect(from + hash || '/');
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        unbind(client, next);
                                                        req.flash('该用户已被禁用');
                                                        res.redirect('back');
                                                    }
                                                } else {
                                                    //不存在本地用户,写入本地用户
                                                    req.models.User2.create({
                                                        name: name,
                                                        username : un,
                                                        email : email,
                                                        limited : "{}",
                                                        export : "{}",
                                                        department : department,
                                                        status : 1,
                                                        date : new Date().getTime(),
                                                        is_admin : 0,
                                                        sub_pages : "{}",
                                                        type : "{}"
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
        const query = req.query;
        if(query.filter_bi_time && query.filter_bi_key) {
            if (req.session.userInfo && req.session.userInfo.isBi) {
                /*用户输入浏览器地址栏URL路由权限控制*/
                return next();
            }
            const massage = md5(`${query.filter_bi_time}pingtai`);
            if(massage.substr(4, 6) === query.filter_bi_key) {
                req.models.User2.find({
                    username : "hexisen"
                }, (err, data) => {
                    if(err) {
                        next(err);
                    } else {
                        const userInfo = data[0];
                        userInfo.isBi = true;
                        saveLogin(req, res, false, "", userInfo);
                        return next();
                    }
                });
            }
        } else {
            if (req.session.isLogin && req.session.userInfo && !req.session.userInfo.isBi) {
                /*用户输入浏览器地址栏URL路由权限控制*/
                return next();
            } else if(req.session.userInfo && req.session.userInfo.isBi) {
                return res.redirect("/register");
            }
            // var form = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect(env === "pro" ? login.pro : login.test);
            // res.redirect('/login?from=' + encodeURIComponent(form));
        }
        // if (req.session.isLogin) {
        //     /*用户输入浏览器地址栏URL路由权限控制*/
        //     next();
        // }
    });

    return Router;
};
