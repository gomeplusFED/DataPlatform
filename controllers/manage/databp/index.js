/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

const forward = require('express-forward-html');

module.exports = (Router) => {

    forward({
        router: Router,
        filterHtml(html) {
            // 移除统计脚本
            return html.replace(/<script[\S]+?uba-sdk[\S]+?<\/script>/, '').replace(/top\.location/g, '{}');
        },
        filterCookie(cookie) {
            return cookie.replace(/DataPlatform.*?=.+?;/gi, '')
        },
        filterJs(js) {
            // 改变关于location的脚本
            return js && js.replace(/\.assign\(([^,]+?)\)/g, '.$assign($1)').replace(/top\.location/g, '{}');
        },
        prefix: '/databp'
    });
    return Router;
};