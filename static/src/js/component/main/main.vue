<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<strong>{{currentData.title}}</strong>
					<div class="head_group_con clearfix">
						<m-drop-down :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'platform'" :argvs.sync='argvs'></m-drop-down>
						<m-drop-down :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'channel'" :argvs.sync='argvs'></m-drop-down>
						<m-drop-down :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'version'" :argvs.sync='argvs'></m-drop-down>
						<m-drop-down :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'coupon'" :argvs.sync='argvs'></m-drop-down>
						<m-date :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs'></m-date>
						<m-btns :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'btn_group'" :result-argvs="resultArgvs"></m-btns>
					</div>
				</div>
				<div class="panel-body">
					<m-filter-select :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'filter_select'" :argvs.sync='argvs'></m-filter-select>
					<m-level-select :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'level_select'" :argvs.sync='argvs'></m-level-select>
					<m-control-table-col :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'control_table_col'" :current-data="currentData"></m-control-table-col>
					<m-search :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'search'" :argvs.sync='argvs'></m-search>
					<m-table :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-table>
					<m-chart :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-chart>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.panel-heading {
	position: relative;
	line-height: 32px;
}

.head_group_con {
	right: 5px;
	font-size: 0;
	z-index: 9;
	display: inline-block;
	vertical-align: middle;
	float: right;
}

.head_group_con .head_group {
	display: inline-block;
	vertical-align: middle;
	font-size: 14px;
	margin: 0 5px;
}
</style>
<script>
/*
 * 组件说明
 * 名称：模块主入口组件
 * 数据来源：ajax
 * 详细：先根据页面上的initData中相应的query_api请求此模块中需要的组件数据，然后渲染组件，然后接受参数，然后处理参数，然后传递给table.vue/chart.vue，然后这两个组件再根据参数请求图表数据进行渲染
 */
var Vue = require('Vue');
var $ = require('jQuery');

var DatePicker = require('../common/datePicker.vue');
var DropDown = require('../common/dropDown.vue');
var FilterSelect = require('../common/filterSelect.vue');
var Table = require('./table.vue');
var Chart = require('./chart.vue');
var Btns = require('../common/btnGroup.vue');
var LevelSelect = require('../common/levelSelect.vue');
var Search = require('../common/search.vue');
var ControlTableCol = require('../common/control-table-col.vue');

var utils = require('utils');

var eventBus = require('../support/event-bus.vue');

var Main = Vue.extend({
	name: 'Main',
	data: function() {
		return {
			argvs: {
				type: '',
				channel: '',
				ver: '',
				coupon_type: '',
				startTime: '',
				endTime: '',
				day_type: 1
			},
			pageComponentsData: null,
			resultArgvs: {},
			count: 0,
			canUpdate: false
		};
	},
	props: ['initData', 'currentData', 'loading', 'index'],
	components: {
		'm-date': DatePicker,
		'm-drop-down': DropDown,
		'm-filter-select': FilterSelect,
		'm-table': Table,
		'm-chart': Chart,
		'm-btns': Btns,
		'm-level-select': LevelSelect,
		'm-search': Search,
		'm-control-table-col': ControlTableCol
	},
	route: {
		data: function() {

		}
	},
	ready: function() {
		var _this = this;
		$.ajax({
			url: _this.currentData.query_api + '_json',
			type: 'get',
			success: function(data) {
				_this.pageComponentsData = data.components;

				if (_this.isnoComponent(data.components)) {
					Vue.set(_this.argvs, 'forceChange', true);
					_this.count = 0;
				}

				if (!_this.$route.path.match(/\?(.*)/)) {
					_this.count = 0;
				}
				if (/.*(\/.*One)/.test(_this.currentData.query_api)) {
					eventBus.$emit('globalPlataform', data.components.global_plataform || {});
				} else if (!_this.index) {
					eventBus.$emit('globalPlataform', {});
				}
			}
		});
		eventBus.$on('platformChange', (plataform, key) => {
			Vue.set(_this.argvs, key, plataform);
		});
	},
	methods: {
		isnoComponent: function(componentData) {
			// 如果没有组件，强制更新argvs
			if (!componentData.date_picker.show && !componentData.drop_down.channel && !componentData.drop_down.coupon && !componentData.drop_down.platform && !componentData.drop_down.version && !componentData.filter_select.length) {
				return true;
			}
			return false;
		}
	},
	watch: {
		'argvs': {
			handler: function(newVal, oldVal) {
				this.count++;
				if (this.count === 1 || this.canUpdate) {
					// 对各个组件汇总的参数处理
					var result = {};
					for (var item in newVal) {
						if (newVal[item] !== '') {
							result[item] = newVal[item];
						}
					}

					if (!this.canUpdate) {
						// 解析query部分，添加到参数中去，可能存在query部分的参数和默认的参数重复，所以，后设置query里的参数，防止覆盖
						if (this.$route.path.match(/\?(.*)/)) {
							var _this = this;
							this.$route.path.match(/\?(.*)/)[1].split('&').forEach(function(item) {
								var _curr = item.split('=');
								Vue.set(_this.argvs, _curr[0], _curr[1]);
							});
						}
					}

					this.resultArgvs = result;

					this.canUpdate = true;
				}
			},
			deep: true
		}
	},
	events: {
		getTableDataLen(len) {
			this.$broadcast('sendTableDataLen', len);
		}
	}
});

module.exports = Main;
</script>
