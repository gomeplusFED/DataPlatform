<template>
	<div :id="'chart_'+index" class="chart" v-show="checkIsChart()">
		<div class="chart_con" v-for="(index, item) in chartData" :style="{'height': chartHeight + 'px', 'width': shouldHalfWidth[index] ? '50%' : '100%'}">
			<div class="nodata all_center">
				<img src="/dist/img/nodata.png">
				<span>暂无数据</span>
			</div>
		</div>
	</div>
</template>
<style>
.chart {
	font-size: 0;
}
.chart_con {
	background: #fff;
	display: inline-block;
}

.chart_con .nodata {
	text-align: center;
}

.chart_con .nodata img {
	display: block;
	width: 100px;
}

.chart_con .nodata span {
	display: block;
	position: absolute;
	font-size: 14px;
	color: #000;
	width: 100%;
	text-align: center;
}
</style>
<script>
/*
 * 组件说明
 * 名称：图组件
 * 数据来源：ajax
 * 详细：根据其他组件中交互导致的参数变化，然后请求数据进行渲染
 */
var Vue = require('Vue');
var $ = require('jQuery');

var chartDataModel = {
	title: {
		text: '',
		x: 'center'
	},
	tooltip: {
		trigger: 'xAxis',
		axisPointer: {
			type: 'shadow'
		}
	},
	legend: { // 图例
		data: []
	},
	toolbox: {
		show: false,
		feature: {}
	},
	grid: {
		containLabel: true,
		show: true
	},
	xAxis: { // X轴
		type: 'category',
		boundaryGap: true,
		data: []
	},
	yAxis: { // Y轴
		type: 'value'
	},
	series: [] // 数据列
};

var visualMap = {
	min: 0,
	max: 2500,
	left: 'left',
	top: 'bottom',
	calculable: true
};

var mapDefaultSeries = {
	mapType: 'china',
	roam: false,
	label: {
		normal: {
			show: true
		},
		emphasis: {
			show: true
		}
	}
};

// echart 主模块，npm安装
var echarts = require('echarts/lib/echarts');
require('echarts/lib/component/legend'); // 图例
// require('echarts/lib/component/tooltip'); // 工具箱
require('echarts/lib/component/toolbox'); // 工具箱
require('echarts/lib/chart/bar'); // 柱状图
require('echarts/lib/chart/line'); // 折线图
require('echarts/lib/chart/pie'); // 饼图
require('echarts/map/js/china.js');

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var Chart = Vue.extend({
	name: 'Chart',
	data: function() {
		return {
			initEd: false,
			chartData: [],
			chartHeight: 400,
			shouldHalfWidth: {}
		};
	},
	vuex: {
		getters: {
			alertConfig: function() {
				return store.state.alertConfig;
			}
		},
		actions: actions
	},
	created: function() {
		this.initEd = true;
	},
	props: ['index', 'initData', 'resultArgvs', 'loading', 'currentData', 'pageComponentsData'],
	methods: {
		checkIsChart: function() {
			return this.currentData.type.match(/chart/i) !== null;
		},
		fetchData: function(cb, errcb) {
			var _this = this;
			if (_this.resultArgvs.forceChange) {
				delete _this.resultArgvs.forceChange;
			}
			$.ajax({
				url: _this.currentData.query_api + '_json',
				type: 'get',
				data: _this.resultArgvs,
				timeout: 5000,
				success: function(data) {
					if (data.iserro) {
						actions.alert(store, {
							show: true,
							msg: '查询失败',
							type: 'danger'
						});
						return;
					}
					cb && cb(data);
				},
				error: function(jqXHR, status, errorThrown) {
					if (status === 'timeout') {
						errcb && errcb();
					};
				}
			});
		},
		rinseData: function(chartType, data, map, config) {
			var options = $.extend(true, {}, chartDataModel);
			var xAxis = [];
			var series = [];
			var legend = [];
			for (var item in data) {
				xAxis.push(item);
			}
			for (let item in map) {
				legend.push(map[item]);
				var _currentObj = {};
				_currentObj.type = chartType;
				chartType === 'pie' ? _currentObj.startAngle = 180 : null;
				_currentObj.stack = config.stack ? 'stack' : '';
				_currentObj.data = [];
				_currentObj.name = map[item];
				chartType === 'bar' ? _currentObj.barMaxWidth = '40px' : null;
				for (var dataItem in data) {
					_currentObj.data.push({
						value: data[dataItem][item],
						name: dataItem
					});
				}
				var _curr = _currentObj;
				if (chartType === 'map') {
					_curr = Object.assign(mapDefaultSeries, _currentObj);
				}
				series.push(_curr);
			}

			if (legend.length > 10 || chartType === 'pie') {
				options.legend.orient = 'vertical';
				options.legend.left = 0;
			}
			options.legend.data = legend;
			options.xAxis.data = xAxis;
			options.series = series;

			// 柱状图 false:竖置 true:横置
			var categoryY = config.categoryY || false;
			if (categoryY) {
				var _xAxis = options.xAxis;
				var _yAxis = options.yAxis;
				options.xAxis = _yAxis;
				options.yAxis = _xAxis;
			}

			if (chartType === 'pie') {
				options.legend.data = xAxis;
				options.tooltip.formatter = '{a} <br/>{b} : {c} ({d}%)';
				delete options.xAxis;
				delete options.yAxis;
				delete options.grid;
			}

			if (chartType === 'map') {
				options.visualMap = visualMap;
				options.visualMap.max = config.mapMaxValue;
				delete options.grid;
				delete options.xAxis;
				delete options.yAxis;
			}

			if (config.toolBox) {
				options.toolbox.show = true;
				Object.keys(config.toolBox).forEach(function(item) {
					options.toolbox.feature[item] = config.toolBox[item];
				});
				if (options.toolbox.feature.dataView) {
					options.toolbox.feature.dataView.optionToContent = function(options) {
						var axisData = data;
						var series = options.series;
						var table = '<div style="width: 100%;height: 100%;overflow: scroll;">';
						table += '<table class="table table-bordered table-hover" style="width: 100%;text-align: center;"><tr><td></td>';
						Object.keys(map).forEach(function(item) {
							table += '<td>' + map[item] + '</td>';
						});
						table += '</tr>';
						Object.keys(data).forEach(function(th) {
							table += '<tr><td>' + th + '</td>';
							Object.keys(map).forEach(function(td) {
								table += '<td>' + data[th][td] + '</td>';
							});
							table += '</tr>';
						});
						table += '</table></div>';
						return table;
					};
				}
			}
			if (config.title) {
				options.title.text = config.title;
			}
			return options;
		}
	},
	watch: {
		'resultArgvs': {
			handler: function(val) {
				// 参数改了 请求数据，进行渲染
				if (this.checkIsChart()) {
					var _this = this;
					_this.loading.show = true;
					_this.loading.noLoaded += 1;
					this.fetchData(function(data) {
						_this.chartData = data.modelData;
						_this.chartData.forEach(function(item, domIndex) {
							if (!_this.shouldHalfWidth[domIndex]) {
								Vue.set(_this.shouldHalfWidth, domIndex, false);
							}
							if (Object.keys(item.data).length === 0) {
								return;
							}
							var nextChart = _this.chartData[domIndex + 1] || {};
							if (item.type === 'pie' && nextChart.type === 'pie' && _this.shouldHalfWidth[domIndex] === false) {
								_this.shouldHalfWidth[domIndex] = true;
								_this.shouldHalfWidth[domIndex + 1] = true;
							}
							var chartOptions = _this.rinseData(item.type, item.data, item.map, item.config);
							setTimeout(function() {
								if (chartOptions.series[0].data.length) {
									var Chart = echarts.init($('#chart_' + _this.index).find('.chart_con').eq(domIndex)[0]);
									_this.chartHeight = 400;
									if (item.type === 'map') {
										_this.chartHeight = 800;
									}
									setTimeout(function() {
										Chart.resize({});
									}, 1);
									Chart.setOption(chartOptions);
								}
							}, 1);
						});
						_this.loading.noLoaded -= 1;
						if (_this.loading.noLoaded === 0) {
							_this.loading.show = false;
						}
					}, function() {
						_this.loading.noLoaded -= 1;
						if (_this.loading.noLoaded === 0) {
							_this.loading.show = false;
						}
						// erro
						actions.alert(store, {
							show: true,
							msg: '查询超时',
							type: 'danger'
						});
					});
				}
			},
			deep: true
		}
	}
});

module.exports = Chart;
</script>
