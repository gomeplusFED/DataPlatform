function _external(pageUrl, platform, origin, prefix) {
    window.$pageUrl = pageUrl;
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
