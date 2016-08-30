<template>
	<m-loading :loading.sync="loading"></m-loading>
	<m-alert></m-alert>
	<m-modal></m-modal>
	<m-confirm></m-confirm>
	<m-export-confirm></m-export-confirm>
	<m-plataform></m-plataform>
	<m-tab-checkbox></m-tab-checkbox>
	<m-global></m-global>
	<m-main v-for="item in currentPageDefaultData.defaultData" :index="$index" :init-data="initData" :current-data="currentPageDefaultData.defaultData[$index]" :loading.sync="loading"></m-main>
</template>
<script>
var Vue = require('Vue');
var $ = require('jQuery');

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var Loading = require('./common/loading.vue');
var Alert = require('./common/alert.vue');
var ModalTable = require('./common/modalTable.vue');
var Main = require('./main/main.vue');
var Confirm = require('./common/confirm.vue');
var ExportConfirm = require('./common/exportConfirm.vue');
var Plateform = require('./common/plataform.vue');
var FilterTabCheckbox = require('./common/filter-tab-checkbox.vue');
var Global = require('./global/global.vue');
var eventBus = require('./support/event-bus.vue');

var App = Vue.extend({
	name: 'App',
	store: store,
	data: function() {
		return {
			loading: {
				show: true,
				noLoaded: 0
			},
			initData: window.allPageConfig
		};
	},
	vuex: {
		getters: {
			currentPageDefaultData: function() {
				return store.state.currentPageDefaultData;
			},
			actions: actions
		}
	},
	components: {
		'm-loading': Loading,
		'm-alert': Alert,
		'm-modal': ModalTable,
		'm-main': Main,
		'm-confirm': Confirm,
		'm-export-confirm': ExportConfirm,
		'm-plataform': Plateform,
		'm-tab-checkbox': FilterTabCheckbox,
		'm-global': Global
	},
	ready() {

	},
	route: {
		data: function(transition) {
			var url = this.$route.path.replace(/(\?.*)/, '');

			if (!window.allPageConfig.page[url]) {
				this.$route.router.go({
					path: '/'
				});
				return;
			}

			$('[href="#!' + url + '"]').parent().parent().parent().addClass('active');
			$('[href="#!' + url + '"]').parent().parent().addClass('in').attr('aria-expanded', true);
			$('[href="#!' + url + '"]').focus();
			$('#side-menu a').removeClass('active');
			$('[href="#!' + url + '"]').addClass('active');

			actions.setCurrentPageDefaultData(store, window.allPageConfig.page[url]);

			// 页面访问统计
			$.ajax({
				url: '/dataPlatform/count',
				type: 'get',
				data: {
					pagename: transition.to.path.replace(/(\?.*)/, ''), // 页面URL
					username: window.allPageConfig.page[url].pageTitle // 页面名称 （狗血）
				}
			});
		}
	}

});

module.exports = App;
</script>
