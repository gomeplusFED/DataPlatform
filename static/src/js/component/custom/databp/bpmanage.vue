<template>
<div class="bp-container panel-group">
	<div class="nform-box">
		<ul class="clearfix">
			<li class="clearfix">
				<label>埋点URL</label>
				<input class="form-control inp inpW1" type="text" placeholder="" v-model="searchParam.pageUrl">
				<label>埋点名称</label>
				<input class="form-control inp inpW2" type="text" placeholder="" v-model="searchParam.pointName">
				<label>状态</label>
				<select class="form-control inp inpW2" v-model="searchParam.isActive">
					<option value='1'>正常</option>
					<option value='0'>已删除</option>
				</select>
				<label>埋点事件名称</label>
				<input class="form-control inp inpW2" type="text" placeholder="" value="单击" disabled>
			</li>
			<li>
				<label>匹配模式</label>
				<input class="form-control inp inpW1" type="text" placeholder="" v-model="searchParam.pattern">
				<label>平台</label>
				<select class="form-control inp inpW2" v-model="searchParam.platform">
					<option value='PC'>PC</option>
					<option value='H5'>H5</option>
				</select>
				<label>类型</label>
				<select class="form-control inp inpW2" v-model="searchParam.type">
					<option value=''>全部</option>
					<option value='0'>模块</option>
					<option value='0'>单点</option>
				</select>

			</li>
			<li>
				<label><input type="checkbox" v-model="showDate"></input>起止时间</label>
				<div class="date_picker">                
					<m-date :index="index" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs' diasbled></m-date>
				</div>

				<button id="btnSearch" class="btn btn-searchLi-top btn-primary" type="button" data-toggle="popover" data-trigger="focus" @click="queryClick">查询</button>

			</li>
		</ul> 
	</div>
	<div class="list-cot list-cot-h list-group">
		<table class="table table-hover ntable">
			<thead>
				<tr>
					<th >序号</th>
					<th >埋点名称</th>
					<th >事件</th>
					<th >页面URL</th>
					<th >匹配模式</th>
					<th >埋点参数</th>
					<th >修改人</th>
					<th >埋点设置时间</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody> 
				<tr v-for="(i, item) in dataList">
					<td>{{i + baseIndex}}</td>
					<td>{{item.pointName}}</td>
					<td>单击</td>
					<td title="{{item.pageUrl}}"><a @click="heatmap(item)">{{item.pageUrl}}</a></td>
					<td title="{{item.pattern}}">{{item.pattern}}</td>
					<td title="{{item.pointParam}}">{{item.pointParam}}</td>
					<td title="{{item.userInfo?(item.userInfo.department + item.userInfo.email) : '--'}}">{{item.userInfo.name || '--'}}</td>
					<td>{{item.updateTime |Date 'yyyy-MM-dd hh:mm:ss'}}</td>
					<td><a @click="edit(item)">修改</a>&nbsp<a v-if="item.isActive === '1'" @click="del(item.pointId)">删除</a><a v-else @click="restore(item.pointId)">恢复</a></td>
				</tr>
				<tr v-show="noData">
					 <td colspan="7">暂无数据</td>
				 </tr>
			</tbody>
		</table>
	</div>
	<div class="panel-footer" v-show="paginationConf.totalItems > paginationConf.itemsPerPage">
		<m-pagination :pagination-conf="paginationConf"></m-pagination>
	</div>
</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');
	var DatePicker = require('../../common/datePicker.vue');
	var store = require('../../../store/store.js');
	var actions = require('../../../store/actions.js');
	var Pagination = require('../../common/pagination.vue');
	var api = require('./mock/api.js');
	var utils = require('utils');
	
	var databp = Vue.extend({
		name: 'bpmanage',
		components: {
			'm-pagination': Pagination,
			'm-date': DatePicker
		},
		props:['loading'],
		vuex: {
			getters: {
				vuexbp: function() {
					return store.state.bpConfig;
				}
			},
			actions: actions
		},
		computed: {
			baseIndex: function () {
				return (this.paginationConf.currentPage - 1) * this.paginationConf.itemsPerPage + 1;
			}
		},
		data: function() {
			return {
				index: 1,
				noData: false,
				showDate: null,
				argvs: {},
				paginationConf: {
					currentPage: 1,     // 当前页
					totalItems: 0,     // 总条数
					itemsPerPage: 12,    // 每页条数
					pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
					onChange: () => {
						this.query();
					}
				},
				pageComponentsData: {
					date_picker: {
						show: true,
						defaultData: 90,
						showDayUnit:true
					},
					trigger: true
				},
				dataList: [],
				searchParam: {
					pointName: '',
					platform: 'PC',
					pageUrl: '',
					pattern: '',
					isActive: '1',
					type: ''
				}
			}
		},
		ready() {
			this.showDate = false;
		},
		route: {
	        activate: function (transition) {
	        	this.query();
				return Promise.resolve(true);
	        }
    	},
		methods: {
			query() {
				this.loading.show = true;
				let options = Object.assign({
					// page从0开始
					page: this.paginationConf.currentPage - 1,
					size: this.paginationConf.itemsPerPage
				}, this.searchParam);
				if (this.showDate) {
					options.startTime = this.argvs.startTime + ' 00:00:00';
					options.endTime= this.argvs.endTime + ' 23:59:59';
				} else {
					options.startTime = '2000-01-01 00:00:00';
					options.endTime = utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				}
				api.listBps(options).then((res) => {
					this.dataList = res.data;
					if (this.dataList.length === 0) {
						 this.noData = true;
					} else {
						this.noData = false;
					}
				   
					this.paginationConf.totalItems = res.total;
					this.loading.show = false;
				}).catch((err) => {
					console.log(err);
					this.loading.show = false;
				});
			},
			del(id) {
				actions.confirm(store, {
					show: true,
					title: '删除确认',
					msg: '确定删除吗',
					apply: () => {
						api.deleteBp(id).then(() =>{
							this.query()
						});
						
					}
				});
			},
			restore(id) {
				actions.confirm(store, {
					show: true,
					title: '确认恢复',
					msg: '确认恢复吗',
					apply: () => {
						api.restoreBp(id).then(() =>{
							this.query()
						});
					}
				});
			},
			queryClick() {
				this.paginationConf.currentPage = 1;
				this.query();
			},
			edit(item) {
				let {pageUrl, pointName, pointParam, selector, platform, type} = item;
				this.$router.go({
					path: '/databp/visualbp',
					query: {pageUrl, pointName, pointParam, selector, platform, type}
				}); 
			},
			heatmap(item) {
				let {pageUrl, platform} = item;
				this.$router.go({
					path: '/databp/heatmap',
					query: {pageUrl, platform}
				}); 
			}
		},
		watch: {
			'showDate' :{
				handler(val) {
					let $dateInput = $('.date_picker input');
					if(val) {
						// triger the date picker
						this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
						$dateInput.removeAttr("disabled");
					} else {
						$dateInput.attr('disabled',true);
						$dateInput.val('');
						
					}
				}   
			}
		}
	});

	module.exports = databp;
</script>
<style scoped>
.bp-container {
	height: 100% !important;
	min-height: 600px;
	overflow: hidden;
	margin: -20px -15px;
}
.nform-box {
	border-bottom: 1px solid #ccc !important;
	background-color: #efefef;
	position: relative;
}
.nform-box ul {
	width: 100%;
	margin: 0 auto;
	padding: 11px;
}
.nform-box ul li{
	overflow: hidden;
	padding-bottom: 6px;
	list-style: none;
	margin-bottom: 10px;
	padding: 0;
}

.nform-box ul li label {
	margin: 0 18px 0 0;
	padding: 0;
	font-weight: normal !important;
	font-size: 12px !important;
	line-height: 28px;
	display: inline-block;
	min-width: 50px;
}
.nform-box ul li .date_picker {
	margin-left: -5px;
	float: left;
	min-width: 220px;
}
.nform-box li label, .nform-box li a, .nform-box li input, .nform-box li button, .nform-box li select, .nform-box li .sel-simulation, .nform-box li .sel-simulation span {
	float: left;
}
.nform-box ul li input, .nform-box ul li select {
	max-height: 30px;
	margin-right: 50px;
	border-color: #c2c2c2 !important;
}
.nform-box ul li .inpW1 {
	max-width: 200px;
}
.nform-box ul li .inpW2 {
	max-width: 100px;
}
.nform-box ul li input:last-child {
	margin-right: 0px;
}
.nform-box ul li input[type="checkbox"] {
	margin-top: 8px;
	margin-right: 4px;
}
.nform-box li .btn-searchLi-top {
	margin: 0 13px 0 118px;
}
.nform-box li a.btn-reset-search {
	line-height: 28px;
}
.pr {
	position: relative;
}
.sel-simulation {
	position: relative;
	display: inline-block;
}
.nform-box li .sel-simulation {
	margin-right: 12px;
}
.sel-simulation-tit {
	border-color: #c2c2c2 !important;
	background: none !important;
	background-color: #fafafa !important;
	cursor: default;
	position: relative;
	z-index: 2;
	width: 144px;
	height: 28px;
	padding-right: 25px;
	padding-left: 11px;
	border: 1px solid #2d2d2d;
	border-radius: 4px;
	background-position: 0 -763px;
	line-height: 26px;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.sel-simulation-tit .sel-simulation-down {
	position: absolute;
	right: 9px;
	top: 3px;
}
.sel-simulation-down {
	display: inline-block;
	width: 17px;
	height: 26px;
	background-position: -83px -54px;
}
.sel-simulation-cot {
	position: absolute;
	left: 1px;
	top: 28px;
	z-index: 3;
	display: none;
	width: 180px;
	border: 1px solid #c2c2c2 !important;
	border-radius: 0 4px 4px 4px;
	background: #e6e6e6;
	box-shadow: 0 7px 9px rgba(0,0,0,.5);
	overflow: hidden;
	color: #333;
}
.div-selitem {
	display: flex;
	margin-bottom: 10px;
}
.list-cot-h {
	height: -moz-calc(100% - 166px);
	height: -webkit-calc(100% - 166px);
	height: calc(100% - 166px);
	background: #fff;
	overflow: auto;
}
.list-cot .ntable {
	border-top-color: #999;
}
.ntable {
	border-top: 1px solid #d6d6d6;
	border-bottom: 1px solid #d6d6d6;
	font-size: 12px;
	table-layout: fixed;
}
.ntable thead tr th, .ntable tbody tr th, .ntable tbody tr td, .ntable tbody tr td .pop {
	height: 30px;
	padding: 0 2px;
	font-weight: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 30px;
}
.ntable thead tr th {
	text-align: center;
	border-top: 1px solid #d6d6d6;
	border-left: 1px solid #d6d6d6;
	border-bottom: 1px solid #d6d6d6;
	font-weight: normal;
}
.ntable tr:nth-child(odd) {
    background-color: #f2faff;
}
.ntable tr th:nth-child(3) {
	width: 50px;
}
.ntable tr th:first-child {
	width: 50px;
}
.ntable tr th:last-child {
	width: 80px;
}
.ntable tr th:first-child {
	width: 5%
}
.ntable tr th:nth-child(4) {
	width: 300px;
}
.ntable tr th:nth-child(5) {
	width: 200px;
}
.ntable tr th:nth-child(7) {
	width: 80px;
}
.ntable tr td {
	text-align: center;
}
.ntable tr a {
	cursor: pointer;
}
</style>
