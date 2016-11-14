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
// var cheerio = require('cheerio'),
// var xhrProxy = `<script>${fs.readFileSync(path.resolve(__dirname,'./script/xhr-proxy.js'), {encoding: 'utf8'})}</script>`;
var xhrProxy = fs.readFileSync(path.resolve(__dirname,'./script/xhr-proxy.js'), {encoding: 'utf8'});




module.exports = (Router) => {
    
    //圈子数据总揽
    Router.get('/databp/html', (req, res, next) => {
        
        let url = req.query.url;
        let trunk = url.replace(/\/[^\/]*?$/, '');
        let host = trunk.replace(/([^\/:\s])\/.*$/, '$1');
        let mobile = (req.query.m === 'H5'? true:false);
        // let agent = new https.Agent({
        //     keepAlive: true,
        //     keepAliveMsecs: 1500,
        //     maxSockets: 70
        // });
        let Host = trunk.replace(/https?:\/\//, '').split('/')[0];
        let options = {
            credentials: 'include',
            // agent,
            headers: {
                Host,
                'Connection': 'keep-alive',
                'Pragma': 'no-cache'
            }
        };
        if (mobile) {
            options.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
        }

        let databpSess =  {
                url,
                origin: trunk,
                host
            };

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
                // console.log(m);
                if(p2.indexOf('.') === 0) {
                    return `${p1}="${trunk}/${p2}"`;
                } else if (p2.indexOf('/') === 0) {
                    return `${p1}="${host}${p2}"`;
                } else {
                    return `${p1}="${host}/${p2}"`;
                }
            });
            // let $ = cheerio.load(html);
            // 添加自定义脚本
            let proxytext = `<script>${xhrProxy}('${querystring.stringify({origin:trunk})}');</script>`;
            html = html.replace('<head>', '<head>' + proxytext);
            req.session.databp = databpSess;
            // console.log('cookie set by html:' + databpSess.cookie);
            
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
        // console.log(sess);
        let {method, url, query, body, headers} = req;
        let host = sess.host;
        let newurl = url.replace('/databp/ajax', host);
        console.log(newurl);
        console.log('cookie when launch ajax: ' + sess.cookie);
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
        // console.log(newurl);
        // console.log(newheaders);
        fetch(newurl, {
            method,
            headers: newheaders,
            body,
            // agent: sess.agent,
            credentials: 'include'
        })
        .then(function(result) {
            return result.text();
        }).then(function(json) {
            // console.log(json);
            res.send(json);
        }).catch(function(err) {
            console.log(err);
        });
    })

    return Router;
};