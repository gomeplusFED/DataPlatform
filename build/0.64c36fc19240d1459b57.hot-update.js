exports.id = 0;
exports.modules = {

/***/ 190:
/***/ function(module, exports) {

	'use strict';

	/**
	 * @author fuqiang
	 * @date 20151128
	 * @fileoverview 用户登陆控制器和权限校验
	 */

	module.exports = function (Router) {
	    Router.get('/api/test', function (req, res, next) {
	        console.log(1);
	        res.sendStatus(111);
	    });

	    return Router;
	};

/***/ }

};