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
				<m-multi-select :index="index" :init-data="initData" :page-components-data="pageComponentsData" :component-type="'level_select'" :argvs.sync='argvs'></m-multi-select>
				<m-table :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-table>
				<m-chart :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-chart>
			</div>
		</div>
	</div>
</div>
</template>
<style>
.panel-heading{position: relative;line-height: 32px;}
.head_group_con{right: 5px;font-size: 0;z-index: 9;display: inline-block;vertical-align: middle;float: right;}
.head_group_con .head_group{display: inline-block;vertical-align: middle;font-size: 14px;margin: 0 5px;}
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
var MultiSelect = require('../common/multiSelect.vue')

var utils = require('utils');

var Main = Vue.extend({
	name: 'Main',
	data: function(){
		return {
			argvs: {
				type: '',
				channel: '',
				ver: '',
				coupon_type: '',
				startTime: '',
				endTime: '',
				day_type: 1, // 摒弃的默认参数，默认1，不用更改
			},
			pageComponentsData: null,
			resultArgvs: ''
		}
	},
	props: ['initData','currentData','loading','index'],
	components: {
		'm-date': DatePicker,
		'm-drop-down': DropDown,
		'm-filter-select': FilterSelect,
		'm-table': Table,
		'm-chart': Chart,
		'm-btns': Btns,
		'm-multi-select': MultiSelect
	},
	created: function(){
		var _this = this;
		$.ajax({
			url: _this.currentData.query_api + '_json',
			type: 'get',
			success: function(data){
				_this.pageComponentsData = data.components;
				
				if(_this.isnoComponent(data.components)){
					_this.$set('argvs.forceChange',true);
				}
			}
		})
	},
	methods: {
		isnoComponent: function(componentData){
			// 如果没有组件，强制更新argvs，然后触发脏检查使得图表组件请求数据
			if(!componentData.date_picker.show && !componentData.drop_down.channel && !componentData.drop_down.coupon && !componentData.drop_down.platform && !componentData.drop_down.version && !componentData.filter_select.length){
				return true;
			}
			return false;
		}
	},
	watch: {
		'argvs': {
			handler: function(val){
				// 对各个组件汇总的参数处理
				var result = {};
				for(var item in this.argvs){
					if(this.argvs[item] !== ''){
						result[item] = this.argvs[item];
					}
				}
				this.resultArgvs = result;
				// for debug
				this.$log('resultArgvs');
			},
			deep: true
		}
	},
	events: {
		getTableDataLen(len) {
			this.$broadcast('sendTableDataLen', len);
		}
	}
})

module.exports = Main;

</script>