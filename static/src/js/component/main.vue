<template>
<div class="row">
	<div class="col-lg-12">
		<div class="panel panel-default">
			<div class="panel-heading">
				<strong>{{data.title}}</strong>
				<div class="head_group_con">
					<m-drop-down :index="index" :argvs.sync='argvs' :page-components-data="pageComponentsData" :component-type="'plataform'"></m-drop-down>
					<m-drop-down :index="index" :argvs.sync='argvs' :page-components-data="pageComponentsData" :component-type="'channel'"></m-drop-down>
					<m-drop-down :index="index" :argvs.sync='argvs' :page-components-data="pageComponentsData" :component-type="'version'"></m-drop-down>
					<m-drop-down :index="index" :argvs.sync='argvs' :page-components-data="pageComponentsData" :component-type="'coupon'"></m-drop-down>
					<m-date :index="index" :argvs.sync='argvs' :page-components-data="pageComponentsData"></m-date>
				</div>
			</div>
			<div class="panel-body">
				<m-table :index="index" :argvs='resultArgvs' :data="data" :loading.sync="loading"></m-table>
				<m-chart :index="index" :argvs='resultArgvs' :data="data" :loading.sync="loading"></m-chart>
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
var DayType = require('./dayType.vue');
var Table = require('./table.vue');
var Chart = require('./chart.vue');

var utils = require('../utils/index.js');

var Main = Vue.extend({
	name: 'Main',
	data: function(){
		return {
			pageComponentsData: '',
			argvs: {
				type: '',
				channel: '',
				ver: '',
				coupon_type: '',
				startTime: '',
				endTime: '',
				day_type: 1
			},
			resultArgvs: ''
		}
	},
	props: ['data','loading','index'],
	components: {
		'm-date': DatePicker,
		'm-drop-down': DropDown,
		'm-table': Table,
		'm-chart': Chart
	},
	created: function(){
		this.pageComponentsData = this.data.components;
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
			},
			deep: true
		}
	},
})

module.exports = Main;

</script>