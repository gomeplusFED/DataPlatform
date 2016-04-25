/**
 * @author liuliangsir
 * @date 20151209
 * @description 针对用户模块的增删改查
 */
var update = require('../models/update');
var select = require('../models/select');
var lodash = require('lodash');
module.exports = function(Router) {

  Router.get('/user/all', function(req, res, next) {
    var pageMax = 4;
    var paginationMaxCount = 4;
    var path = '/user/all';
    var page = parseInt(req.query.page);

    if(isNaN(page) || page <= 0){
      page = 1; 
    }

    var start = (page - 1) * pageMax;
    var end = page * pageMax;
    var query = req.query.query ? req.query.query : null;

    select.userFindAll({
      start: start,
      end: end,
      model: req.models,
      query: query
    }, function(err, ret, pageCount) {
      if (err) {
        next(err);
      } else {
        var fixedRet = lodash.map(ret, function(item) {
          var obj = {};
          lodash.forIn(item, function(val, key) {
            if (val !== null && (key === "id" || key === "username" || key === "is_admin")) {
              obj[key] = val;
            }
          });
          return obj;
        });
        res.render('user/index', {
          users: fixedRet,
          currentPage: page,
          pageCount: Math.ceil(pageCount / pageMax),
          pageMax: pageMax,
          paginationMaxCount: paginationMaxCount,
          path: path
        });
      }
    });
  });

  Router.post('/user/updateLimit', function(req, res, next) {
    var userId = req.body.userId,
      limits = req.body.limits;
    update.userLimitUpdate({
      model: req.models,
      userId: userId,
      limited: limits,
      req: req
    }, function(err, ret) {
      if (err) {
        next(err);
      } else {
        res.json(ret);
      }
    });
  });

  Router.post('/user/showLimit', function(req, res, next) {
    var userId = req.body.userId;
    req.models.Users.find({
      id: userId
    }, function(err, ret) {
      if (err) {
        next(err);
      } else {
        res.json(ret);
      }
    });
  });

  Router.post('/user/changeRole', function(req, res, next) {
    var role = req.body.role,
      userId = req.body.userId;
    update.userRoleUpdate({
      model: req.models,
      userId: userId,
      role: role,
      req: req
    }, function(err, ret) {
      if (err) {
        next(err);
      } else {
        res.json(ret);
      }
    });
  });

  return Router;
};
