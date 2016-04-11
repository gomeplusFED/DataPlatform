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
// addRouter('./multiSelect');
addRouter('../controllers/manage/dataOverview');
addRouter('../controllers/manage/userAnalysis');
addRouter('../controllers/manage/businessRebate');
addRouter('../controllers/manage/platformRebate');
addRouter('../controllers/manage/platformRebate/inviteRegisterAndEnter');
addRouter('../controllers/manage/platformRebate/individualEvent');
addRouter('../controllers/manage/platformRebate/platformPromotions');
addRouter('../controllers/manage/platformRebate/platformBasis');
addRouter('../controllers/manage/platformRebate/inviteBusiness');
addRouter('../controllers/manage/platformRebate/inviteRegisterAndEnter');


for(var key of config.limit) {
    Object.keys(key).forEach((data) => {
        if(key[data].display) {
            if(key[data].path.length > 0) {
                for(var k of key[data].path) {
                    module.exports.push(new renderApi(router, k));
                }
            } else if(key[data].routers && key[data].routers.length > 0) {
                for(var k of key[data].routers) {
                    module.exports.push(new renderApi(router, k));
                }
            }
        }
    });
}