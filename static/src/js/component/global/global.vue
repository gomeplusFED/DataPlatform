<template>
	<div class="global">
		<button class="btn btn-default" v-if="pageComponentsData['flexible_btn']" @click="tab_checkbox(pageComponentsData['flexible_btn'])">{{pageComponentsData['flexible_btn'].content || 筛选}}</button>
		<button class="btn btn-default excel-export" v-if="pageComponentsData['export']" @click="location(pageComponentsData['export'])">导出</button>
		<m-level-select v-if="pageComponentsData['level_select']" :index="-1" :init-data="initData" :page-components-data="pageComponentsData" component-type="level_select" :argvs.sync='argvs'></m-level-select>
		<m-filter-select v-if="pageComponentsData['filter_select']" index="-1" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'filter_select'" :argvs.sync='argvs'></m-filter-select>
		<m-date :is-global="true" :index="-1" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs'></m-date>
	</div>
</template>
<style>
    #datePicker_-1 {
        float: right;
        bottom: 10px;
    }
    .excel-export {
        float: right;
        margin-right: 20px;
        margin-bottom: 10px;
    }
</style>
<script>
	var Vue = require('Vue');
	var FilterTabCheckbox = require('../common/filter-tab-checkbox.vue');
	var LevelSelect = require('../common/levelSelect.vue');
	var FilterSelect = require('../common/filterSelect.vue');
	var DatePicker = require('../common/datePicker.vue');

	var eventBus = require('../support/event-bus.vue');

	var store = require('../../store/store.js');
	var actions = require('../../store/actions.js');

	export default {
		store: store,
		data() {
			return {
				initData: window.allPageConfig,
				pageComponentsData: {
					date_picker: {
						show: false
					}
				},
				argvs: {
					type: '',
					channel: '',
					ver: '',
					coupon_type: '',
					startTime: '',
					endTime: '',
					day_type: 1,
					main_show_type_filter : ''
				},
				showConfig: {
					flexible_btn: false,
					level_select: false
				},
				watcher: []
			}
		},
		ready() {
			var _this = this;
			eventBus.$off('loadGlobal');
			eventBus.$on('loadGlobal', function(data) {
				_this.$set('argvs', {
					type: '',
					channel: '',
					ver: '',
					coupon_type: '',
					startTime: '',
					endTime: '',
					day_type: 1,
					main_show_type_filter: ''
				});

				data.date_picker = data.date_picker || {show: false, defaultData: 7};
				_this.pageComponentsData = data;

				if (data.filter_select && data.filter_select.length) { 
					data.filter_select.forEach(x => {
						_this.$watch('argvs.' + x.filter_key, function(val, oldVal) {
							if (val !== oldVal) {
								eventBus.$emit('platformChange', val, x.filter_key);
							}
						});
					});
				}
			});
			
			// setTimeout(function() {
			// 	let data= {
			// 		flexible_btn: {
			// 			show: false
			// 		},
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
			// 		},
			// 		date_picker: {
			// 			name: '',
			// 			endname: '',
			// 			defaultData: 7,
			// 			showDayUnit: true,
			// 			show: true
			// 		},
			// 		export: {
			// 			url: 'http://baidu.com'
			// 		}
			// 	}
			// 	eventBus.$emit('loadGlobal', data);
			// },1000);
		},
		components: {
			'm-tab-checkbox': FilterTabCheckbox,
			'm-level-select': LevelSelect,
			'm-filter-select': FilterSelect,
			'm-date': DatePicker
		},
		methods: {
			tab_checkbox: function(item) {
				var _this = this;
				actions.tabCheckbox(store, {
					show: true,
					title: item.content || '筛选',
					max: item.max,
					groups: item.groups,
					apply: val => {
						eventBus.$emit('platformChange', val, item.key);
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
			},
			location: function(item) {
				if (item.url)
				window.open(item.url)
			}
		},
		watch: {
			'argvs.category_id' : function (val, oldVal) {
				// level_select
				eventBus.$emit('platformChange',val, this.pageComponentsData.level_select.name);
			},
			'argvs.startTime' : function (val, oldVal) {
				// level_select
				if (this.pageComponentsData['date_picker'].show)
				eventBus.$emit('platformChange',val, this.pageComponentsData.date_picker.name || 'startTime');
			},
			'argvs.endTime' : function (val, oldVal) {
				// level_select
				if (this.pageComponentsData['date_picker'].show)
				eventBus.$emit('platformChange',val, this.pageComponentsData.date_picker.endname || 'endTime');
			},
			'argvs.day_type' : function (val, oldVal) {
				// level_select
				if (this.pageComponentsData['date_picker'].show)
				eventBus.$emit('platformChange',val, 'day_type');
			}
		}
	};
</script>
<style scoped>
	.global {
		/*margin: 0 0 20px 0;*/
	}
</style>