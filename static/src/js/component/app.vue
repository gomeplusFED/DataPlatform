<template>
	<m-loading :loading.sync="loading"></m-loading>
	<m-alert></m-alert>
	<m-modal></m-modal>
	<m-confirm></m-confirm>
	<m-export-confirm></m-export-confirm>
	<m-plataform></m-plataform>
	<m-plataform index="1"></m-plataform>
	<m-tab-checkbox></m-tab-checkbox>
	<m-global></m-global>
	<m-main v-ref:main v-for="item in list" :index="$index" :init-data="initData" :current-data="list[$index]" :loading.sync="loading" @click.stop="hrefCheck"></m-main>
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
				initData: window.allPageConfig,
				subPages: []
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
		computed: {
			list() {
				if (this.currentPageDefaultData.defaultData) {
					let list = this.currentPageDefaultData.defaultData.filter(x => x.query_api.indexOf('Zero') === -1)
					return list;
				}
				return [];
			}
		},
		methods: {
			hrefCheck(ev) {
				let $target = $(ev.target);
				let href = $target.attr('href') || $target.parents('a').attr('href');
				if (/^#!(\/[^\/]+?)+$/.test(href) && !this.subPages.some(x => href.includes(x.url))) {
					console.log(href +' has been stoped');
					ev.preventDefault();
				}
			}
		},
		route: {
			data: function(transition) {
				var url = this.$route.path.replace(/(\?.*)/, '');

				if (!window.allPageConfig.page[url]) {
					this.$route.router.go({
						path: '/error'
					});
					return;
				}

				$('[href="#!' + url + '"]').parent().parent().parent().addClass('active');
				$('[href="#!' + url + '"]').parent().parent().addClass('in').attr('aria-expanded', true);
				$('[href="#!' + url + '"]').focus();
				$('#side-menu a').removeClass('active');
				$('[href="#!' + url + '"]').addClass('active');

				var currentPageDefaultData = window.allPageConfig.page[url];
				this.subPages = currentPageDefaultData.subPages;

				var query_api = currentPageDefaultData.defaultData[0].query_api;

				if(query_api.lastIndexOf('Zero') === query_api.length-4) {
					$.ajax({
						url: query_api + '_json',
						type: 'get',
						success: function(data) {
							// 如果没有时间组件延迟加载
							if (data.components.date_picker && data.components.date_picker.show) {
								eventBus.$emit('loadGlobal', data.components);
							} else {
								setTimeout(() => {
									eventBus.$emit('loadGlobal', data.components);
								}, 1000)
							}
							return;
						}
					})
					// currentPageDefaultData.defaultData.splice(0, 1);
				} else {
					eventBus.$emit('loadGlobal', {});
				}

				actions.setCurrentPageDefaultData(store, currentPageDefaultData);

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
