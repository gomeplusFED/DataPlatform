var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    fs = require("fs"),
    files = "./controllers/manage",
    renderApi = require("./renderApi");

//var model = mysql.init({
//  username: 'datapltfm_user',
//  pwd: 'Db57AteE172E4D1168',
//  host: '10.125.31.220',
//  database: 'dataplatform'
//});


module.exports = [];

function addRouter(path) {
    if(typeof require(path) == "object"){
        console.warn("路由加载警告,",path);
        return;
    } 
    module.exports.push(require(path)(router));
}

// addRouter('./combine');
addRouter('./login');
addRouter('./count');
addRouter('./categories');
addRouter('./addModule');

var data = fs.readdirSync(files);
for (var file of data) {
    if (file.indexOf(".js") < 0 && file.indexOf('.') !== 0) {
        var f = fs.readdirSync(files + "/" + file);
        for (var key of f) {
            if (key.indexOf("js") >= 0) {
                try {
                    addRouter("." + files + "/" + file + "/" + key);
                } catch (err) {
                    console.log(err, ",ERROR in router/index,", "file in "+"." + files + "/" + file + "/" + key);
                }
            }
        }
    }
}


Object.keys(config.limit).forEach((key) => {
    var limit = config.limit[key];
    if(limit.display) {
        if (limit.path.length > 0) {
            for (var k of limit.path) {
                module.exports.push(new renderApi(router, k));
            }
        } else if (limit.routers && limit.routers.length > 0) {
            for (var k of limit.routers) {
                module.exports.push(new renderApi(router, k));
            }
        }
    }
});