/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

var fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var https = require('https');
var xhrProxy = fs.readFileSync(path.resolve(__dirname, './script/xhr-proxy.js'), {
    encoding: 'utf8'
});
var parseCookie = require('./lib/parser.js');


var databpStorage = {};

module.exports = (Router) => {

    Router.get('/databp/html', (req, res, next) => {

        let url = req.query.url;
        let options = {
            credentials: 'include',
            // agent,
            headers: {
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
            }
        };
        let platform = req.query.m;
        let mobile = (platform === 'H5' ? true : false);
        let mobileProc = Promise.resolve(true);
        let relocation;
        if (mobile || (/\/\/m\./.test(url) && !mobile)) {
            // url = url.replace('//mall.', '//m.');
            if (mobile) {
                options.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
            }
            options.redirect = 'manual';
            // 先请求一次，探查真实地址
            mobileProc = fetch(url, options).then(function (result) {
                // console.log(result.headers);
                if ((relocation = result.headers._headers) && (relocation = relocation.location) && (relocation = relocation[0]) && (relocation !== url)) {
                    url = relocation;
                    if (!mobile) {
                        platform = 'PC';
                    }
                }
                options.redirect = 'follow';
                return true;
            });
        }
        let trunk, host, databpSess;

        mobileProc.then(() => {
            trunk = url.replace(/\/[^\/]*?$/, '');
            host = trunk.replace(/([^\/:\s])\/.*$/, '$1');
            databpSess = {
                url,
                origin: trunk,
                host
            };
        }).then(() => fetch(encodeURI(url), options)
            .then(function (result) {
                // console.log(result);
                let rawcookie = result.headers;
                if ((rawcookie = rawcookie._headers) && (rawcookie = rawcookie['set-cookie'])) {
                    let cookie = parseCookie(rawcookie);
                    databpSess.cookie = cookie;
                    for (let c of cookie) {
                        res.append('Set-Cookie', c + ';');
                    }
                }

                return result.text();
            }).then(function (body) {
                let html = body;
                // 移动端移除头部script，防止iframe无法正常渲染
                if (mobile) {
                    html = html.replace(/^[\s\S]+?(<!DOCTYPE)/mi, function (m, p1) {
                        return p1;
                    });
                }
                // 转化静态标签的src和href，使其可以正常访问

                html = html.replace(/(href|src)\s*=\s*"\s*((?!http|\/\/|javascript)[^"\s]+?)\s*"/g, function (m, p1, p2) {
                    if (p2.indexOf('.') === 0) {
                        return `${p1}="${trunk}/${p2}"`;
                    } else if (p2.indexOf('/') === 0) {
                        return `${p1}="${host}${p2}"`;
                    } else {
                        return `${p1}="${host}/${p2}"`;
                    }
                });
                // 移除统计脚本
                html = html.replace(/<script[\S]+?uba-sdk[\S]+?<\/script>/, '');
                html = html.replace(/top\.location/g, '{}');
                // 添加自定义脚本
                let proxytext = `<script>${xhrProxy}('${url}', '${platform}', '${trunk}');</script>`;
                html = html.replace('<head>', '<head>' + proxytext);
                // databpSess.oldCookieKeys = parseCookie(req.headers.cookie, true);
                databpStorage[req.session.userInfo.id] = databpSess;
                res.end(html);
            })
        ).catch(function (e) {
            console.log(e);
            res.end(e.toString());
            // next(e);
        });

    });
    Router.all('/databp/ajax/*', (req, res, next) => {
        let sess = databpStorage[req.session.userInfo.id] || {};
        let {
            method,
            url,
            query,
            body,
            headers
        } = req;
        let host = sess.host;
        let newurl = url.replace('/databp/ajax', host);
        let newheaders = {
                'cookie': headers.cookie.replace(/DataPlatform.*?=.+?;/gi, ''),
                'host': host.replace(/https?:\/\//, ''),
                'referer': encodeURI(sess.url),
                'origin': null
        };
        if (sess.cookie) {
            sess.cookie.some((x, i) => {
                if (x.includes('content_ctag')) {
                    newheaders['content-type-ctag'] = x.split('content_ctag=')[1].slice(0, -1);
                    return true;
                }
                return false;
            });
        }
        let keys = Object.keys(headers);
        for (let key of keys) {
            if (newheaders[key] == null) {
                newheaders[key] = headers[key];
            }
        }
        delete newheaders['origin'];
        for (let key in body) {
            let oldval = body[key]
            body[key] = encodeURI(oldval);
        }
        if (newheaders['content-type'] && newheaders['content-type'].indexOf('x-www-form-urlencoded') > -1) {
            let qstr = '';
            for (let key in body) {
                qstr += `${key}=${body[key]}&`
            }
            body = qstr.slice(0, -1);
        } else {
            body = JSON.stringify(body);
        }
        let option = {
            headers,
            method,
            headers: newheaders,
            body,
            credentials: 'include'
        };
        fetch(newurl, option)
            .then(function (result) {
                return result.text();
            }).then(function (json) {
                res.send(json);
            }).catch(function (err) {
                console.log(err);
            });
    })
    Router.get('/databp/js', (req, res, next) => {
        let sess = databpStorage[req.session.userInfo.id] || {};
        let {
            query
        } = req;
        let method = 'get';
        let newurl = query.url;
        let host = newurl.match(/https?:\/\/(.+?)\//)[1];
        let newheaders = {
            host
        }
        fetch(newurl, {
                method,
                headers: newheaders,
                cookie: headers.cookie.replace(/DataPlatform.*?=.+?;/gi, ''),
                credentials: 'include'
            })
            .then(function (result) {
                return result.text();
            }).then(function (js) {
                // 改变关于location的脚本
                js = js && js.replace(/\.assign\(([^,]+?)\)/g, '.$assign($1)');
                js = js && js.replace(/top\.location/g, '{}');
                res.send(js);
            }).catch(function (err) {
                console.log(err);
            });
    })
    return Router;
};