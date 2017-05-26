/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

const forward = require('express-forward-html');
const fs = require('fs');
const path = require('path');
const isMobile = (url) => /[/.](m|wap)\./.test(url);

module.exports = (Router) => {

    forward({
        isMobileUA(url, req) {
            return isMobile(url) || (req.query.m === 'H5');
        },
        needRedirect(url, req) {
            let mobile = isMobile(url);
            let isSpecifedH5 = req.query.m === 'H5';
            return (!isSpecifedH5 &&  mobile) || (!mobile && isSpecifedH5);
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
