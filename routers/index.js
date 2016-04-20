var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    fs = require("fs"),
    path = require('path'),
    files = path.resolve(__dirname, "../controllers/manage"),
    renderApi = require("./renderApi");


var rd = require('rd');

//var model = mysql.init({
//  username: 'datapltfm_user',
//  pwd: 'Db57AteE172E4D1168',
//  host: '10.125.31.220',
//  database: 'dataplatform'
//});



router.get('/api/test',function(req,res,next){
    // console.log(222);
    res.send('22211as')
})



module.exports = [];


var context = require.context("../controllers/manage", true, /\.js$/);

function addRouter(path) {
    module.exports.push(context(path)(router));
}



// var filePath = async(path) => {
//     return new Promise((resolve, reject) => {
//         fs.readdir(path, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         })
//     });
// };

// addRouter('./combine');

module.exports.push(require('./login')(router));
module.exports.push(require('./user')(router));
module.exports.push(require('./categories')(router));

// (async() => {
//     try {
//         var data = await filePath(files);
//         for (var file of data) {
//             if (file.indexOf(".js") < 0) {
//                 var f = await filePath(files + "/" + file);
//                 for (var key of f) {
//                     if (key.indexOf("js") >= 0) {
//                         addRouter(files + "/" + file + "/" + key);
//                     }
//                 }
//             }
//         }
//     } catch (err) {
//         console.log(err);
//     }
// })();



var routeFiles = rd.readFileFilterSync(files, /\.js/);
routeFiles.forEach(function(item) {
    addRouter(item.replace(files,'.'));
})


for (var key of config.limit) {
    Object.keys(key).forEach((data) => {
        if (key[data].display) {
            if (key[data].path.length > 0) {
                for (var k of key[data].path) {
                    module.exports.push(new renderApi(router, k));
                }
            } else if (key[data].routers && key[data].routers.length > 0) {
                for (var k of key[data].routers) {
                    module.exports.push(new renderApi(router, k));
                }
            }
        }
    });
}

