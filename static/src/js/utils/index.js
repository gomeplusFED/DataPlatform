'use strict';

var common = require('./common.js');
var dom = require('./dom.js');
var selector = require('./selector.js');

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
utils.mixin(utils, selector);

module.exports = utils;
