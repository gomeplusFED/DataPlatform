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
            return isMobile(url) || (req.originalUrlObj.query.m === 'H5');
        },
        // filterHtml(html) {
        //     // 移除统计脚本
        //     return html.replace(/<script[\S]+?(uba-sdk|js-sdk)[\S]+?<\/script>/, '').replace(/top\.location/g, '{}');
        // },
        // requestFilter(req) {
        //     let cookie = req.headers.get('cookie');
        //     let referrer = req.originalUrlObj.query.referrer;
        //     if(/refurl/.test(cookie) && referrer) {
        //         req.headers.set('cookie', cookie.replace(/DataPlatform.*?=.+?;/gi, '').replace(/refurl=(.+?);/i, 'refurl=' + referrer + ';'));
        //     }
        //     return req;
        // },
        // filterAjax: {
        //     'gmsst5Login': (body, req) => {
        //         if (body.indexOf('successUrl') > -1) {
        //             let jsonbody = JSON.stringify(body);
        //             jsonbody.successUrl = urlLib.format(Object.assign({}, req.originalUrlObj, {
        //                 search: '?' + querystring.stringify(Object.assign({}, req.originalUrlObj, {url: jsonbody.successUrl}))
        //             }))
        //             return JSON.stringify(jsonbody);
        //         }
        //         return body;
        //     }
        // },
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
    return Router;
};