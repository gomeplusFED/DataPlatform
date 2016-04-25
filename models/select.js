/**
 * @author liuliang
 * @fileoverview  查找用户数据
 */

var orm = require('orm');

module.exports.userFindAll = function(params, func) {
  var start = parseInt(params.start),
    end = parseInt(params.end),
    offset = end - start,
    model = params.model;

  var findParams = {
    is_admin: orm.ne('99')
  };
  if (params.query) {
      findParams.username = orm.like('%' + params.query + '%');
  }
  model.Users.count(findParams, function(err, count) {
    if (err) {
      func(err);
    } else {

      model.Users.find(findParams, {
        offset: start,
        limit: offset
      }, function(err, items) {
        if (err) {
          func(err);
        } else {
          func(err, items, count);
        }
      });
    }
  });
};
