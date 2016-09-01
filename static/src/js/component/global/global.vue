<template>
	<div class="global">
		<button class="btn btn-default" v-if="pageComponentsData['flexible_btn']" @click="tab_checkbox(pageComponentsData['flexible_btn'])">筛选</button>
		<m-level-select v-if="pageComponentsData['level_select']" :index="1" :init-data="initData" :page-components-data="pageComponentsData" component-type="level_select" :argvs.sync='argvs'></m-level-select>
	</div>
</template>
<script>
	var Vue = require('Vue');
	var FilterTabCheckbox = require('../common/filter-tab-checkbox.vue');
	var LevelSelect = require('../common/levelSelect.vue');

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
				// for(var item in data) {
				// 	_this.showConfig[item] = true;
				// }
				// data.forEach(function(item) {
				// 	_this.showConfig[item.type] = true;
				// 	console.log(item.type);
				// })
			});
			
		},
		components: {
			'm-tab-checkbox': FilterTabCheckbox,
			'm-level-select': LevelSelect
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
			'argvs': {
				handler: function (val, oldVal) {
				 	let category_id = val.category_id;

				 	eventBus.$emit('platformChange',category_id, this.pageComponentsData.level_select.name);

					// let mains = this.$parent.$refs.main;
					// mains.forEach(x => {
					// 	if (x.currentData.title != '返利计划汇总')
					// 	x.$set('argvs.category_id', category_id);
					// })
				},
				deep: true
			}
		}
	};
</script>
<style scoped>
	.global {
		margin: 0 0 10px 0;
	}
</style>