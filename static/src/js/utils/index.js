'use strict';

var common = require('./common.js');
var dom = require('./dom.js');

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

module.exports = utils;
