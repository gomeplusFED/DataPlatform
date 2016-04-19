/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 用户登陆控制器和权限校验
 */
var ldap = require('ldapjs');
var config = require('../config');
var lodash = require('lodash');

var username = 'yunyingbaobiao';
var password = '5P=/d_Xp';
var ldapurl = 'ldap://10.69.100.1';
var superAdminInfo = {
    username: "superAdmin",
    password: "12345678"
};

module.exports = function(Router) {

    Router.get('/login', function(req, res) {
        if (req.session.isLogin) {
            res.redirect('/dataOverview/app');
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
        var maxAge = 1000 * 60 * 60 * 2; //2小时
        if (remember) {
            maxAge = 1000 * 60 * 60 * 24 * 7; // 一周
        }
        req.sessionOptions.maxAge = new Date(Date.now() + maxAge);
        req.session.userInfo = userInfo;
        req.session.isLogin = true;
    }

    function authorityRouteFromBrowserUrl(req, res, next) {
        var url = req.originalUrl,
            limitedStr = "",
            urlTransToIndex = "",
            fixedUrl = url;

//.match(/^\/.+?\/.+   (?=\?|\/) |  ^\/.+?\/.+ (?=\?|\/)? /);


        if (fixedUrl) {
            var limitedConfigArr = config.limit;
            limitedStr = req.session.userInfo.limited;
            // fixedUrl = fixedUrl[0];
            lodash.forEach(limitedConfigArr, function(item) {
                var key = Object.keys(item)[0];
                var obj = item[key];
                var href = obj.href;
                var path = obj.path;
                if (href === fixedUrl) {
                    urlTransToIndex = obj.id;
                } else if (obj.path.length) {
                    var flag = true;
                    lodash.forEach(path, function(v, k) {
                        if (v.path === fixedUrl && flag) {
                            urlTransToIndex = obj.id + "-" + k;
                            flag = false; //类似break功能
                        } else if (flag) {
                            /*serverConfig读取权限*/
                            if (v.serverConfig && v.serverConfig.links) {
                                var links = v.serverConfig.links;
                                lodash.forEach(links, function(v1) {
                                    if (v1.href === fixedUrl) {
                                        urlTransToIndex = obj.id + "-" + k;
                                        flag = false;
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        /*路由不存在或者无权限时urlTransToIndex为空字符串*/
        if (urlTransToIndex) {
            urlTransToIndex = urlTransToIndex.toString();
            var parent = urlTransToIndex.split("-")[0];
            var children = urlTransToIndex.split("-")[1];
            if (limitedStr.split(',').some(function(item) {
                    var arrs = item.split("-");
                    var arrsFirstItem = arrs.shift();
                    return arrsFirstItem === parent || arrs.indexOf(children) >= 0;
                })) {
                /*实现三级菜单所处的index保存到session*/
                req.session.thirdMenuIndex = urlTransToIndex;
                next();
            } else {
                res.render("include/authority");
            }
        } else {
            next();
        }
    }

    Router.post('/logout', function(req, res) {
        req.session = null;
        res.redirect('/login');
    });

    Router.post('/login', function(req, res, next) {
        if (req.session.isLogin) {
            res.redirect('/dataOverview/app');
        } else {
            //本地要有个数据库
            var email = req.body.email,
                pwd = req.body.password,
                from = req.body.from,
                remember = req.body.remember;
            //直接去ldap交换验证
            if (!email || !pwd) {
                req.flash('密码和账户不正确');
                res.redirect('back');
                return;
            } else if (email === superAdminInfo.username && pwd === superAdminInfo.password) {
                /*超级管理员不进行ldap验证*/
                req.models.Users.find({
                    username: email
                }, function(err, ret) {
                    if (err) {
                        next(new Error("用户不存在"));
                    } else {
                        if (ret.length) {
                            saveLogin(req, res, remember, email, ret[0]);
                            res.redirect(from || '/dataOverview/app');
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
                                //console.log('entry: ' + JSON.stringify(entry.object));
                                client.bind(entry.object.dn, pwd, function(err) {
                                    //验证成功
                                    if (err) {
                                        //console.log(err);
                                        unbind(client, next);
                                        req.flash('密码和账户不正确');
                                        res.redirect('back');
                                    } else {
                                        req.models.Users.find({
                                            username: email
                                        }, function(err, ret) {
                                            if (err) {
                                                unbind(client, next);
                                            } else {
                                                if (ret.length) {
                                                    saveLogin(req, res, remember, email, ret[0]);
                                                    unbind(client, next);
                                                    res.redirect(from || '/dataOverview/app');
                                                } else {
                                                    //不存在本地用户,写入本地用户
                                                    req.models.Users.create({
                                                        username: email,
                                                        login_time: new Date(entry.object.lastLogon),
                                                        lastlogin_time: new Date(entry.object.lastLogonTimestamp)
                                                    }, function(err, ret) {
                                                        if (err) {
                                                            unbind(client, next);
                                                        } else {
                                                            saveLogin(req, res, remember, email, ret);
                                                            unbind(client, next);
                                                            res.redirect(from || '/dataOverview/app');
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
            authorityRouteFromBrowserUrl(req, res, next);
        } else {
            var form = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect('/login?from=' + encodeURIComponent(form));
        }
    });

    Router.all('/', function(req, res) {
        res.redirect("/dataOverview/app");
    });

    return Router;
};
