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
var xhrProxy = fs.readFileSync(path.resolve(__dirname,'./script/xhr-proxy.js'), {encoding: 'utf8'});




module.exports = (Router) => {
    
    //圈子数据总揽
    Router.get('/databp/html', (req, res, next) => {
        
        let url = req.query.url;
        let trunk = url.replace(/\/[^\/]*?$/, '');
        let host = trunk.replace(/([^\/:\s])\/.*$/, '$1');
        let mobile = (req.query.m === 'H5'? true:false);

        let Host = trunk.replace(/https?:\/\//, '').split('/')[0];
        let options = {
            credentials: 'include',
            // agent,
            headers: {
                // Host,
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
            }
        };
        if (mobile) {
            // url = url.replace('//mall.', '//m.');
            options.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
        }

        let databpSess =  {
                url,
                origin: trunk,
                host
            };
        console.log(url);
        fetch(url, options)
        .then(function(result) {
            let rawcookie = result.headers;
            if ((rawcookie = rawcookie._headers) && (rawcookie = rawcookie['set-cookie'])) {
                rawcookie = rawcookie.toString();
                let cookie = rawcookie.match(/(mx_pc_gomeplusid|content_ctag)=.+?;/g);
                if (cookie) {
                    databpSess.cookie = cookie.join(' ').slice(0 , -1);
                } else {
                    databpSess.cookie = '';
                }
            }
            return result.text();
        }).then(function(body) {
            let html = body;
            // 移动端移除头部script，防止iframe无法正常渲染
            if (mobile) {
                html = html.replace(/^[\s\S]+?(<!DOCTYPE)/mi, function(m, p1) {
                    return p1;
                });
            }
            // 转化静态标签的src和href，使其可以正常访问

            html = html.replace(/(href|src)\s*=\s*"\s*((?!http|\/\/|javascript).+?)\s*"/g, function(m, p1, p2) {
                if(p2.indexOf('.') === 0) {
                    return `${p1}="${trunk}/${p2}"`;
                } else if (p2.indexOf('/') === 0) {
                    return `${p1}="${host}${p2}"`;
                } else {
                    return `${p1}="${host}/${p2}"`;
                }
            });
            // 添加自定义脚本
            let proxytext = `<script>${xhrProxy}('${querystring.stringify({origin:trunk})}');</script>`;
            html = html.replace('<head>', '<head>' + proxytext);
            req.session.databp = databpSess;
            res.end(html);
        }).catch(function(e) {
            console.log(e);
            res.end(e.toString());
            // next(e);
        });
        // res.end('error');

    });
    Router.all('/databp/ajax/*', (req, res, next) => {
        let sess = req.session.databp;
        let {method, url, query, body, headers} = req;
        let host = sess.host;
        let newurl = url.replace('/databp/ajax', host);
        let newheaders = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, sdch, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Cookie': sess.cookie,
            'Host': host.replace(/https?:\/\//, ''),
            'Pragma': 'no-cache',
            'Referer': sess.url,
            'User-Agent': headers['user-agent']
        }
        fetch(newurl, {
            method,
            headers: newheaders,
            body,
            credentials: 'include'
        })
        .then(function(result) {
            return result.text();
        }).then(function(json) {
            res.send(json);
        }).catch(function(err) {
            console.log(err);
        });
    })

    return Router;
};
