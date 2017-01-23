'use strict';

var common = require('./common.js');
var dom = require('./dom.js');
<<<<<<< .merge_file_4TOIRX
=======
var selector = require('./selector.js');
>>>>>>> .merge_file_3IpmJx

var utils = {};

utils.mixin = function(source, target) {
	for (var i in target) {
		if (target.hasOwnProperty(i)) {
			source[i] = target[i];
		}
	}
	return source;
};

utils.mixin(utils, common);
utils.mixin(utils, dom);
<<<<<<< .merge_file_4TOIRX
=======
utils.mixin(utils, selector);
>>>>>>> .merge_file_3IpmJx

module.exports = utils;
