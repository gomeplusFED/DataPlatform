'use strict';
var Vue = require('Vue');
Vue.config.debug = true;
var $ = require('jQuery');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

// for jq plugin and debug
window.jQuery = $;
window.$ = $;

// fileter
require('./filter/index.js');

// directive
require('./directive/tips.js');

var dom = require('./dom/index.js');

var blankApp = Vue.extend({});

var App = require('./component/app.vue');
var Index = require('./component/index.vue');
var Log = require('./component/main/log.vue');

var Erro = require('./component/common/404.vue');

var router = new VueRouter();

var store = require('./store/store.js');
var actions = require('./store/actions.js');

window.store = store;
window.actions = actions;

router.map({
	'*': {
		component: App
	},
	'/': {
		component: Index
	},
	'/user': {
		component: require('./component/user/index.vue'),
		subRoutes: {
			'/account': {
				component: require('./component/user/account/index.vue')
			},
			'/role': {
				component: require('./component/user/role/index.vue')
			}
		}
	},
	'/log': {
		component: Log
	},
	'/error': {
		component: Erro
	},
	'/custom': {
		component: require('./component/custom/index.vue'),
		subRoutes: {
			'/saveActivity': {
				component: require('./component/custom/saveActivity.vue')
			},
			'/channel': {
				component: require('./component/custom/channel.vue')
			}
		}
	},
	'/databp': {
		component: require('./component/custom/databp/index.vue'),
		subRoutes: {
			'/visualbp': {
				component: require('./component/custom/databp/visualbp.vue')
			},
			'/bpmanage': {
				component: require('./component/custom/databp/bpmanage.vue')
			},
			'/heatmap': {
				component: require('./component/custom/databp/heatmap.vue')
			}
		}
	}
});

router.start(blankApp, '#page-wrapper');

$.ajaxSetup({
	global: true,
	complete: function(XMLHttpRequest, status) {
		var res = {};
		try {
			res = JSON.parse(XMLHttpRequest.responseText);
		} catch (e) {};
		if (res.iserro) {
			router.go('/error');
		}
	}
});
