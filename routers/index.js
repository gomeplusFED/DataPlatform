var express = require('express');
var router = express.Router();
var mysql = require('../models/mysql');
var config = require('../libs/config');
var api = require('./api');

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
addRouter('./dataOverview');
addRouter('./user');
addRouter('./achievements');

config.limit.forEach(function(options) {
  Object.keys(options).forEach(function(key) {
    if(options[key].display) {
      if (options[key].path.length > 0) {
        options[key].path.forEach(function(p) {
          if (p.serverConfig) {
            module.exports.push(new api(router, p.serverConfig));
          }
        });
      }
    }
  });
});
