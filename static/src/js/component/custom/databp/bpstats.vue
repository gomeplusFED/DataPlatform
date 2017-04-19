<template>
	<div class="bp-container panel-group">
		<div class="nform-box">
			<ul class="clearfix">
				<li class="clearfix">
					<div>
						<label>埋点URL</label>
						<input class="form-control inp inpW1"
						       type="text"
						       placeholder=""
						       v-model="searchParam.pageUrl">
					</div>
					<div>
						<label>埋点名称</label>
						<input class="form-control inp inpW2"
						       type="text"
						       placeholder=""
						       v-model="searchParam.pointName">
					</div>
					<div>
						<label>平台</label>
						<select class="form-control inp inpW2"
						        v-model="searchParam.platform">
							<option value='PC'>PC</option>
							<option value='H5'>H5</option>
						</select>
					</div>
					<div>
						<label>是否模块</label>
						<select class="form-control inp inpW2"
						        v-model="searchParam.type">
							<option value=''>全部</option>
							<option value='block'>模块</option>
							<option value='point'>单点</option>
						</select>
					</div>
				</li>
				<li>
					<div>
						<label>查询时间</label>
						<div class="date_picker">
							<m-date :index="index"
							        :page-components-data="pageComponentsData"
							        :component-type="'date_picker'"
							        :argvs.sync='argvs'
							        :custom-option="datepickerOption"
							        :cancel-date-limit="1"></m-date>
						</div>
					</div>
					<div>
						<label>埋点版本</label>
						<select id="version"
						        class="form-control data-type"
						        v-model="searchParam.version"
						        data-content="请选择版本">
							<option v-for="(i, t) of versions"
							        value={{t.version}}
							        :selected="t.version === searchParam.version ? 'selected' : ''">{{t.version}} - {{t.dateTime}}</option>
						</select>
					</div>
					<button id="btnSearch"
					        class="btn btn-search btn-primary"
					        type="button"
					        data-toggle="popover"
					        data-trigger="focus"
					        @click="queryClick">查询</button>
				</li>
				<li style="height:30px;">
					<label>
						<input type="checkbox"
						       v-model="showSum"></input>总计</label>
					<input v-show="showSum"
					       class="form-control inp inpW1"
					       type="text"
					       placeholder=""
					       value="点击量 : {{sum.pv == null ? '  ' : sum.pv}}  日UV : {{sum.uv == null ? '  ' : sum.uv}}"
					       disabled>
				</li>
			</ul>
		</div>
		<div class="list-cot list-cot-h list-gro	up">
			<table class="table table-hover ntable">
				<thead>
					<tr>
						<th>序号</th>
						<th>埋点名称</th>
						<th>埋点版本</th>
						<th>事件</th>
						<th>是否模块</th>
						<th>页面URL</th>
						<th>埋点参数</th>
						<th>点击量</th>
						<th>日UV</th>
						<th>详情</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i, item) in dataList">
						<td>{{i + baseIndex}}</td>
						<td>{{item.pointName}}</td>
						<td title="{{item.version}}">{{item.version}}</td>
						<td>单击</td>
						<td title="{{item.type}}">{{item.type === 'block' ? '是' : '否'}}</td>
						<td title="{{item.pageUrl}}"><a v-if="item.uniquePoint !== '2'"
							   @click="heatmap(item)">{{item.pageUrl}}</a></td>
						<td title="{{item.pointParam}}">{{item.pointParam || '-'}}</td>
						<td title="{{item.PV}}">{{item.pv || '-'}}</td>
						<td title="{{item.UV}}">{{item.uv || '-'}}</td>
						<td><a @click="detail(item)">趋势</a></td>
					</tr>
					<tr v-show="noData">
						<td colspan="10">暂无数据</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="panel-footer"
		     v-show="paginationConf.totalItems > paginationConf.itemsPerPage">
			<m-pagination :pagination-conf="paginationConf"></m-pagination>
		</div>
		<div v-show="trend.show"
		     class="modal">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button"
						        class="close"
						        @click="trend.show=false">
							&times;
						</button>
						<ul class="nav nav-tabs">
							<li role="presentation"
							    class="active"><a href="#tab_chart"
								   data-toggle="tab"
								   aria-expanded="true"><span class="fa fa-line-chart"></span></a></li>
							<li role="presentation"
							    class=""><a href="#tab_table"
								   data-toggle="tab"
								   aria-expanded="false"><span class="fa fa-table"></span></a></li>
						</ul>
					</div>
					<div class="modal-body tab-content">
						<div id="tab_chart"
						     class="tab-pane active in">
							<div v-if="trend.show || (trend.chartOption && trend.chartOption.xAxis.data.length)"
							     v-show="trend.chartOption && trend.chartOption.xAxis.data.length"
							     class="trend-chart"
							     v-echarts="trend.chartOption">
							</div>
							<div v-show="trend.chartOption && trend.chartOption.xAxis.data.length === 0"
							     class="nodata all_center">
								<img src="/dist/img/nodata.png">
								<span>暂无数据</span>
							</div>
						</div>
						<div id="tab_table"
						     class="tab-pane fade">
							<table class="table table-hover trend-table">
								<thead>
									<tr>
										<th>日期</th>
										<th>点击量</th>
										<th>日UV</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item of trend.data">
										<td>{{item.date || '-'}}</td>
										<td>{{item.pv || '-'}}</td>
										<td>{{item.uv || '-'}}</td>
									</tr>
									<tr v-if="trend.data.length === 0">
										<td colspan="3">暂无数据</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
var Vue = require('Vue');
var $ = require('jQuery');
var DatePicker = require('common/datePicker.vue');
var store = require('store');
var actions = require('actions');
var Pagination = require('common/pagination.vue');
var api = require('./api');
var utils = require('utils');
var defaultChartOption = {
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		show: true,
		bottom: 10,
		data: ['点击量', '日UV']
	},
	grid: {
		top: 10,
		left: '3%',
		right: '4%',
		bottom: '13%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: []
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			name: '点击量',
			type: 'line',
			data: []
		},
		{
			name: '日UV',
			type: 'line',
			data: []
		}
	]
};
const BP_STAT_SUM = 'showbpsum';
var databp = Vue.extend({
	name: 'bpstats',
	components: {
		'm-pagination': Pagination,
		'm-date': DatePicker
	},
	props: ['loading'],
	computed: {
		baseIndex() {
			return (this.paginationConf.currentPage - 1) * this.paginationConf.itemsPerPage + 1;
		},
		startTime() {
			return (this.argvs.startTime + ' 00:00:00');
		},
		endTime() {
			return (this.argvs.endTime + ' 23:59:59');
		}
	},
	data: function () {
		let datepickerOption = {
			startDate: utils.formatDate((() => {
				let date = new Date();
				date.setDate(date.getDate() - 7);
				return date;
			})(), 'yyyy-MM-dd'),
			endDate: utils.formatDate(new Date(), 'yyyy-MM-dd'),
			opens: 'right'
		};
		return {
			index: 1,
			noData: false,
			showSum: false,
			sum: { pv: '', uv: '' },
			argvs: {
				// 注意此时时间选取控件尚未初始化
				endTime: datepickerOption.endDate,
				startTime: datepickerOption.startDate
			},
			versions: [],
			trend: {
				show: false,
				data: null,
				chartOption: null
			},
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 0,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: () => {
					this.query();
				}
			},
			datepickerOption,
			pageComponentsData: {
				date_picker: {
					show: true,
					defaultData: 90,
					showDayUnit: true
				},
				trigger: true
			},
			dataList: [],
			searchParam: {
				pointName: '',
				platform: 'PC',
				version: null,
				pageUrl: '',
				pattern: '',
				isActive: '1',
				type: ''
			}
		}
	},
	created() {
		this.showSum = !!window.localStorage.getItem(BP_STAT_SUM);
	},
	ready() {
		// triger the date picker
		this.pageComponentsData.trigger = !this.pageComponentsData.trigger;

	},
	route: {
		async activate(transition) {
			let res = await api.getHeatVersions(this.searchParam);
			this.versions = res.map(x => ({
					...x,
					dateTime: utils.formatDate(new Date(x.dateTime), 'yyyy-MM-dd hh:mm:ss')
				}));
			if(!this.searchParam.version) {
				await api.getLatestVersions(this.searchParam).then(ver => {
						this.searchParam.version = ver;
				})
			}
			await this.query();
			return Promise.resolve(true);
		}
	},
	methods: {
		query() {
			this.loading.show = true;
			Object.assign(this.searchParam, {
				// page从0开始
				page: this.paginationConf.currentPage - 1,
				size: this.paginationConf.itemsPerPage,
				startTime: this.startTime,
				endTime: this.endTime
			});
			api.getHeatList(this.searchParam).then((res) => {
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
					api.deleteBp(id).then(() => {
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
					api.restoreBp(id).then(() => {
						this.query()
					});
				}
			});
		},
		queryClick() {
			this.paginationConf.currentPage = 1;
			if (this.showSum) {
				api.getHeatSum(this.searchParam).then((data) => {
					this.sum = data;
				});
			}
			this.query();
		},
		detail(item) {
			let startTime = this.startTime;
			let endTime = this.endTime;
			// fetch detail data
			api.getHeatDetail({ ...item, startTime, endTime }).then((data) => {
				// show modal
				this.trend.show = true;
				// build chart option
				let xdata = [];
				let pvdata = [];
				let uvdata = [];
				for (let item of data) {
					// parse the date to string
					item.date = utils.formatDate(new Date(item.date), 'yyyy-MM-dd');
					xdata.push(item.date);
					pvdata.push(item.pv);
					uvdata.push(item.uv);
				}
				// store the data
				this.trend.data = data;
				let chartOption = Object.assign({}, defaultChartOption);
				chartOption.xAxis.data = xdata;
				chartOption.series[0].data = pvdata;
				chartOption.series[1].data = uvdata;
				this.trend.chartOption = chartOption;
			});
		},
		heatmap(item) {
			let { pageUrl, version } = item;
			let platform = this.searchParam.platform;
			this.$router.go({
				path: '/databp/heatmap',
				query: { pageUrl, platform, version }
			});
		}
	},
	watch: {
		'showSum': {
			handler(val) {
				if (val) {
					api.getHeatSum(this.searchParam).then((data) => {
						this.sum = data;
					});
					window.localStorage.setItem(BP_STAT_SUM, 1);
				} else {
					this.sum.pv = '';
					this.sum.uv = '';
					window.localStorage.removeItem(BP_STAT_SUM);
				}
			}
		}
	}
});

module.exports = databp;
</script>
<style scoped>
.modal-body {
	height: 450px;
}

.nodata {
	top: 40%;
}

.nodata span {
	display: block;
	text-align: center;
}

.trend-chart {
	width: 100%;
	height: 410px;
	overflow: hidden;
}

.modal .nav-tabs {
	border: none;
}

.modal-header {
	padding-bottom: 0;
}

.trend-table {
	width: 800px;
	margin: 20px auto;
}

.trend-table th,
.trend-table td {
	text-align: center;
	border: 1px solid #d6d6d6 !important;
	border-top: 1px solid #d6d6d6;
	font-weight: normal;
}

.trend-table th:first-child,
.trend-table td:first-child {
	width: 40%;
}

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

.nform-box .inp {
	font-size: 12px;
}

.nform-box ul {
	width: 100%;
	margin: 0 auto;
	padding: 11px;
	padding-bottom: 2px;
}

.nform-box ul li {
	display: flex;
	justify-content: flex-start;
	overflow: hidden;
	padding-bottom: 6px;
	list-style: none;
	margin-bottom: 10px;
	padding: 0;
}

.nform-box ul li>div {

	display: flex;
	margin-right: 5%;
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


.nform-box li label,
.nform-box li a,
.nform-box li input,
.nform-box li button,
.nform-box li select {
	float: left;
}

.nform-box ul li input,
.nform-box ul li select {
	max-height: 30px;
	margin-right: 50px;
	border-color: #c2c2c2 !important;
}

.nform-box ul li .inpW1 {
	width: 210px;
    margin-right: 5px;
}

.nform-box ul li .inpW2 {
	width: 100px;
}

.nform-box ul li input[type="checkbox"] {
	margin-top: 8px;
	margin-right: 4px;
}

.nform-box li .btn-search {
	margin: 0 0 0 16%;
	width: 80px;
}

.nform-box li .data-type {
    width: 200px;
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

.ntable thead tr th,
.ntable tbody tr th,
.ntable tbody tr td,
.ntable tbody tr td .pop {
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
	width: 50px;
}

.ntable tr th:nth-child(5) {
	width: 100px;
}

.ntable tr th:nth-child(6) {
	width: 250px;
}

.ntable tr th:nth-child(10) {
	width: 80px;
}

.ntable tr td {
	text-align: center;
}

.ntable tr a {
	cursor: pointer;
}
</style>
