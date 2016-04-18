var multistream = require('multistream');
var utils = require('../utils');
var path = require('path');
var fs = require('fs');

module.exports = function(Router) {
    Router.get('*', function(req, res, next) {
        //https://github.com/xiaojue/node-combo/blob/master/lib/tools.js#L26
        var files = utils.checkFilePath(req.url, 'js|css', path.join(__dirname, '../static'));
        //concat，不存在的文件不录入
        if (files) {
            var streams = files.map(function(file) {
                return fs.createReadStream(file);
            });
            multistream(streams).pipe(res);
        } else {
            next();
        }
    });

    return Router;
};
