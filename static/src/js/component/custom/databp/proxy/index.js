var httpProxy = require('http-proxy');
var http = require('http');
var url = require("url");
var proxy = httpProxy.createProxyServer({});
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url);
    res.oldWriteHead = res.writeHead;
    res.writeHead = function (statusCode, headers) {
        // 设置跨域头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.oldWriteHead(statusCode, headers);
    }
    let target = urlObj.protocol + "//" + urlObj.host;
    proxy.web(req, res, {
        target: target
    });

}).listen(8038);