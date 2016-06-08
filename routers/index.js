var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    fs = require("fs"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
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
    module.exports.push(require(path)(router));
}

var filePath = async((path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
});

// addRouter('./combine');
addRouter('./login');
addRouter('./count');
addRouter('./user');
addRouter('./categories');

async(() => {
    try {
        var data = await (filePath(files));
        for (var file of data) {
            if (file.indexOf(".js") < 0) {
                var f = await (filePath(files + "/" + file));
                for (var key of f) {
                    if (key.indexOf("js") >= 0) {
                        addRouter("." + files + "/" + file + "/" + key);
                    }
                }
            }
        }
    } catch (err) {
        console.log(err, ",ERROR in router/index");
    }
})();


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