<template>
	<div class="global">
		<button class="btn btn-default" v-if="showConfig.filter" @click="filter">筛选</button>
		<m-level-select v-if="showConfig.level_select" :index="1" :init-data="initData" :page-components-data="pageComponentsData" component-type="level_select" :argvs.sync='argvs'></m-level-select>
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
					level_select: {
						name: "category_id",
						show: true,
						url: "/api/categories"
					}
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
					filter: false,
					level_select: false
				}
			}
		},
		ready() {
			var _this = this;
			eventBus.$on('load', function(data) {
				data.forEach(function(item) {
					_this.showConfig[item.type] = true;
					console.log(item.type);
				})
			});
			// eventBus.$emit('load', [{type: 'level_select'}, {type: 'filter'}]);
		},
		components: {
			'm-tab-checkbox': FilterTabCheckbox,
			'm-level-select': LevelSelect
		},
		methods: {
			filter: function(item) {
				var _this = this;
				actions.tabCheckbox(store, {
					show: false,
					title: '筛选',
					max: item.max,
					groups: item.groups,
					apply: val => {
						eventBus.$emit('platformChange', item.key, val);
						this.cancel();
					},
					cancel: () => {
						actions.tabCheckbox(store, {
							show: false
						})
					}
				});
			}
		}
	};
</script>
<style scoped>
	.global {
		margin: 0 0 10px 0;
	}
</style>