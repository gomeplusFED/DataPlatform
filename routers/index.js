var express = require('express'),
    router = express.Router(),
    config = require('../config'),
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

addRouter('./combine');
addRouter('./login');
addRouter('./user');
addRouter('../controllers/manage/userAnalysis');

for(var key of config.limit) {
    Object.keys(key).forEach((data) => {
        if(key[data].display) {
            if(key[data].path.length > 0) {
                for(var k of key[data].path) {
                    module.exports.push(new renderApi(router, k));
                }
            }
        }
    });
}