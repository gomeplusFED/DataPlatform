/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

const forward = require('express-forward-html');
const fs = require('fs');
const path = require('path');
const urlLib = require('url');
const querystring = require('querystring');
const request = require('request');
const isMobile = (url) => /[/.](m|wap)\./.test(url);

module.exports = (Router) => {

    forward({
        isMobileUA(url, req) {
            return isMobile(url) || (req.query.m === 'H5');
        },
        needRedirect(url, req) {
            let mobile = isMobile(url);
            let isSpecifedH5 = req.query.m === 'H5';
            return (!isSpecifedH5 && mobile) || (!mobile && isSpecifedH5);
        },
        filterHtml(html) {
            // 移除统计脚本
            return html.replace(/<script[\S]+?uba-sdk[\S]+?<\/script>/, '').replace(/top\.location/g, '{}');
        },
        filterCookie(cookie) {
            return cookie.replace(/DataPlatform.*?=.+?;/gi, '')
        },
        filterStatic(content) {
            // 改变关于location的脚本
            return content && content.replace(/\.assign\(([^,]+?)\)/g, '.$assign($1)').replace(/top\.location/g, '{}');
        },
        prefix: '/databp',
        script: function _external(urlObj) {
            window.$pageUrl = urlObj.href;
            let platform = urlObj.mobile ? 'H5' : 'PC'
            window.$platform = platform;
            window.$originalUrl = urlObj.serverUrlObj.href;
            window.location.$assign = function (url) {
                let newurl;
                if (/https?:\/\//.test(url)) {
                    // do noting
                    newurl = url;
                } else {
                    newurl = '/databp/html?m=' + platform + '&url=' + encodeURIComponent(pageUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, ''));
                }
                window.location.assign(newurl);
            }
        }
    })(Router);

    Router.all(`/databp/*`, function (req, res, next) {
        let {
            url,
            method,
            query,
            body,
            headers
        } = req;
        let {
            referer
        } = headers;
        if (!referer) {
            res.status(400).end(`Can not forward other request because of non referer in headers, HTML url: ${referer||'null'}, XHR url: ${url}`);
            return;
        }
        let refobj = urlLib.parse(referer);
        let refQuery = querystring.parse(refobj.query);
        let referurl = refQuery.url;
        if (!referurl) {
            res.status(400).end(`Can not forward other request because of non refer url in headers, HTML url: ${referer||'null'}, XHR url: ${url}`);
            return;
        }
        let referurlObj = urlLib.parse(referurl, true);
        if (referurlObj.query.url) {
            url = decodeURIComponent(referurlObj.query.url);
        }
        url = urlLib.resolve(referurl, url.replace('/databp/', ''));
        url = `${refobj.protocol}//${refobj.host}${refobj.pathname}?${querystring.stringify(Object.assign({}, querystring.parse(urlLib.parse(url).query), refQuery, {url}))}`
        res.redirect(url);
    });
    return Router;
};