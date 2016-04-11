<template>
<div class="row">
	<div class="col-lg-12">
		<div class="panel panel-default">
			<div class="panel-heading">
				<strong>{{currentData.title}}</strong>
				<div class="head_group_con">
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
				<m-table :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-table>
				<m-chart :index="index" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-chart>
			</div>
		</div>
	</div>
</div>
</template>
<style>
.panel-heading{position: relative;line-height: 32px;}
.head_group_con{position: absolute;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);right: 5px;font-size: 0;z-index: 9;}
.head_group_con .head_group{display: inline-block;vertical-align: middle;font-size: 14px;margin: 0 5px;}
</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var DatePicker = require('./datePicker.vue');
var DropDown = require('./dropDown.vue');
var FilterSelect = require('./filterSelect.vue');
var Table = require('./table.vue');
var Chart = require('./chart.vue');
var Btns = require('./btnGroup.vue');

var utils = require('../utils/index.js');

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
	},
	created: function(){
		var _this = this;
		$.ajax({
			url: _this.currentData.query_api + '_json',
			type: 'get',
			success: function(data){
				_this.pageComponentsData = data.components;
			}
		})
	},
	methods: {
		
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
})

module.exports = Main;

</script>