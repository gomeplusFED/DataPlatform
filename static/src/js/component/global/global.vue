<template>
	<div class="global">
		<button class="btn btn-default" v-if="pageComponentsData['flexible_btn']" @click="tab_checkbox(pageComponentsData['flexible_btn'])">{{pageComponentsData['flexible_btn'].content}}</button>
		<m-level-select v-if="pageComponentsData['level_select']" :index="1" :init-data="initData" :page-components-data="pageComponentsData" component-type="level_select" :argvs.sync='argvs'></m-level-select>
		<m-filter-select v-if="pageComponentsData['filter_select']" :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'filter_select'" :argvs.sync='argvs'></m-filter-select>
	</div>
</template>
<script>
	var Vue = require('Vue');
	var FilterTabCheckbox = require('../common/filter-tab-checkbox.vue');
	var LevelSelect = require('../common/levelSelect.vue');
	var FilterSelect = require('../common/filterSelect.vue');

	var eventBus = require('../support/event-bus.vue');

	var store = require('../../store/store.js');
	var actions = require('../../store/actions.js');

	export default {
		store: store,
		data() {
			return {
				initData: window.allPageConfig,
				pageComponentsData: {
					// level_select: {
					// 	name: "category_id",
					// 	show: true,
					// 	url: "/api/socialAnalysisCategories"
					// }
				},
				argvs: {
					channel: "",
					coupon_type: "",
					day_type: 1,
					endTime: "2016-08-29",
					startTime: "2016-08-23",
					type: "",
					ver: ""
				},
				showConfig: {
					flexible_btn: false,
					level_select: false
				}
			}
		},
		ready() {
			var _this = this;
			eventBus.$on('loadGlobal', function(data) {
				_this.pageComponentsData = data;

				if (data.filter_select && data.filter_select.length) { 
					data.filter_select.forEach(x => {
						_this.$watch('argvs.' + x.filter_key, function(val, oldVal) {
							if (val !== oldVal) {
								eventBus.$emit('platformChange',val, x.filter_key);
							}
						});
					});
				}
			});
			
			// setTimeout(function() {
			// 	let data= {
			// 		filter_select: [{
			// 			filter_key: "filter_key2",
			// 			title: "指标选择",
			// 			groups: [{
			// 				key: "new_topic_num",
			// 				value: "话题"
			// 			}, {
			// 				key: "new_topic_reply_num",
			// 				value: "回复"
			// 			}]
			// 		}],
			// 		level_select: {
			// 			name: "category_id",
			// 			show: true,
			// 			url: "/api/socialAnalysisCategories"
			// 		}
			// 	}
			// 	eventBus.$emit('loadGlobal', data);
			// },1000);
		},
		components: {
			'm-tab-checkbox': FilterTabCheckbox,
			'm-level-select': LevelSelect,
			'm-filter-select': FilterSelect
		},
		methods: {
			tab_checkbox: function(item) {
				var _this = this;
				actions.tabCheckbox(store, {
					show: true,
					title: '筛选',
					max: item.max,
					groups: item.groups,
					apply: val => {
						eventBus.$emit('platformChange',val , item.key);
						actions.tabCheckbox(store, {
							show: false
						});
					},
					cancel: () => {
						actions.tabCheckbox(store, {
							show: false
						});
					}
				});
			}
		},
		watch: {
			'argvs.category_id' : function (val, oldVal) {
				// level_select
				eventBus.$emit('platformChange',val, this.pageComponentsData.level_select.name);
			}
		}
	};
</script>
<style scoped>
	.global {
		margin: 0 0 10px 0;
	}
</style>