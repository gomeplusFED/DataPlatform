var utils = {};

var $ = require('jQuery');

utils.strToDom = function(str){
	var obj = document.createElement('div');
	obj.innerHTML = str;
	return obj.childNodes[1];
}

module.exports = utils;
