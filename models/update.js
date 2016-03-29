/**
 * @author liuliang
 * @fileoverview 用户权限update
 */
var utils = require('../libs/utils');
module.exports.userLimitUpdate = function(params, func) {

  var model = params.model,
    userId = params.userId,
    limited = params.limited,
    req = params.req;

  model.Users.find({
    id: userId
  }, function(err, ret) {
    if (err) {
      func(err);
    } else {
      if (ret.length > 0) {
        ret[0].limited = limited;
        ret[0].save(function(error) {
          if (error) {
            func(error);
          } else {
            /*更新session*/
            if(req.session 
              && req.session.userInfo 
              && parseInt(req.session.userInfo.id) === parseInt(userId)){
              utils.updateSession(req,{userInfo:ret[0]});
            }
            func(null, {
              msg: "更新成功",
              status: 200,
              success: true
            });
          }
        });
      } else {
        func(new Error("该用户不存在"));
      }
    }
  });
};

module.exports.userRoleUpdate = function(params, func) {
  var model = params.model,
    userId = params.userId,
    role = parseInt(params.role),
    self = this,
    req = params.req;

  if(role !== 0 && role !== 1){
    role = 0; 
  }

  model.Users.find({
    id: userId
  }, function(err, ret) {
    if (err) {
      func(err);
    } else {
      if (ret.length > 0) {
        ret[0].isAdmin = role;
        ret[0].limited = self.userLimitUpdateByCondition(role,/0\-0(\,)?/,"0-0,",ret[0].limited);
        ret[0].save(function(error) {
          if (error) {
            func(error);
          } else {
            func(null, {
              msg: "更新成功",
              status: 200,
              success: true,
              data: role
            });
          }
        });
      } else {
        func(new Error("该用户不存在"));
      }
    }
  });

};

module.exports.userLimitUpdateByCondition = function(condition,regExp,tpl,limited){  
  if(condition){
    if(!regExp.test(limited)) return  tpl+limited;
    else return limited;
  }else{
    if(regExp.test(limited)) return limited.replace(regExp,"");
    else return limited;
  }
};