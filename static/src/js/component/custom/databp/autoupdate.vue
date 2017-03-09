<template>
<div class="bp-container panel-group">
	<div class="nform-box">
		<ul class="clearfix">
			<li class="clearfix">
				<label>平台</label>
				<select class="form-control inp inpW2" v-model="searchParam.platform">
					<option value='PC'>PC</option>
					<option value='H5'>H5</option>
				</select>
				<label>站点</label>
				<select class="form-control inp inpW1" v-model="searchParam.website">
					<option v-for="site in sites" value={{site.url}}>{{site.name}}</option>
				</select>
				<label>版本号</label>
				<input class="form-control inp inpW2" type="text" placeholder="" v-model="searchParam.version">
				<button id="btnSearch" class="btn" type="button"  @click="query">查看更新日志</button>
			</li>
			<li>
				<button id="btnSearch" class="btn btn-searchLi-top btn-primary" type="button" @click="runUpdate">一键更新</button>
			</li>
		</ul> 
	</div>
	<div v-show="dataList.length || noData" class="list-cot list-cot-h list-group">
		<table class="table table-hover ntable">
			<thead>
				<tr>
					<th>更新时间</th>
					<th>版本号</th>
					<th>更新是否成功</th>
					<th>操作人</th>
					<th>站点</th>
				</tr>
			</thead>
			<tbody> 
				<tr v-for="(i, item) in dataList">
					<td>{{i + baseIndex}}</td>
					<td>{{item.pointName}}</td>
					<td>单击</td>
					<td title="{{item.type}}">{{item.type === 'block' ? '是' : '否'}}</td>
					<td title="{{item.pageUrl}}"><a v-if="item.uniquePoint !== '2'" @click="heatmap(item)">{{item.pageUrl}}</a></td>
				</tr>
				<tr v-show="noData">
					 <td colspan="5">暂无数据</td>
				 </tr>
			</tbody>
		</table>
		<div class="panel-footer" v-show="paginationConf.totalItems > paginationConf.itemsPerPage">
			<m-pagination :pagination-conf="paginationConf"></m-pagination>
		</div>
	</div>
</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');
	var store = require('store');
	var actions = require('actions');
	var Pagination = require('common/pagination.vue');
	var api = require('./api');
	var utils = require('utils');
	var autodatabp = Vue.extend({
		name: 'bpstats',
		components: {
			'm-pagination': Pagination
		},
		props:['loading'],
		computed: {
			baseIndex () {
				return (this.paginationConf.currentPage - 1) * this.paginationConf.itemsPerPage + 1;
			}
		},
		data: function() {
			return {
				index: 1,
				noData: false,
				sites: [
					{
						name: '国美PLUS站',
						url: 'https://www.gomeplus.com'
					}
				],
				paginationConf: {
					currentPage: 1,     // 当前页
					totalItems: 0,     // 总条数
					itemsPerPage: 10,    // 每页条数
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
					website: '',
					platform: 'PC',
					version: ''
				}
			}
		},
		ready() {
			// triger the date picker
			this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
		},
		route: {
	        activate: function (transition) {
	        	// this.query();
				return Promise.resolve(true);
	        }
    	},
		methods: {
			runUpdate() {
				actions.confirm(store, {
					show: true,
					title: '更新确认',
					msg: '确定更新自动埋点吗',
					apply: () => {
						api.runUpdate().then(() =>{
							this.query();
						});
						
					}
				});
			},
			query() {
				this.loading.show = true;
				Object.assign(this.searchParam, {
					// page从0开始
					page: this.paginationConf.currentPage - 1,
					size: this.paginationConf.itemsPerPage,
					startTime: this.startTime,
					endTime: this.endTime
				});
				
				return api.getLogs(this.searchParam).then((res) => {
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
			queryClick() {
				this.paginationConf.currentPage = 1;
				this.query();
			}
		}
	});

	module.exports = autodatabp;
</script>
<style scoped>
	.modal-body {
		height: 450px;
	}
	.nodata {
		top: 40%;
	}
	.nodata span{
		display: block;
	    text-align: center;
	}
	.bp-container {
		height: 100% !important;
		min-height: 600px;
		overflow: hidden;
		margin: -20px -15px;
	}
	.nform-box {
		border-bottom: 1px solid #ddd !important;
		background-color: #efefef;
	}
	.nform-box ul {
		padding-top: 25px;
	}
	.nform-box ul li{
		display: flex;
		margin-bottom: 20px;
		justify-content: center;
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
	.nform-box li label, .nform-box li a, .nform-box li input, .nform-box li button, .nform-box li select {
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
		width: 150px;
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

	.ntable tr th:nth-last-child(n+2) {
		width: 150px;
	}
	.ntable tr td {
		text-align: center;
	}
	.ntable tr a {
		cursor: pointer;
	}
</style>
