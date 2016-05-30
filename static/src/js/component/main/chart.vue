<template>
	<div :id="'chart_'+index" class="chart" v-show="checkIsChart()">
		<div class="chart_con" v-for="item in chartData" style="height: 400px;width: 100%;">
			<div class="nodata all_center">
				<img src="/dist/img/nodata.png">
				<span>暂无数据</span>
			</div>
		</div>
	</div>
</template>

<style>
.chart_con {background: #fff;}
.chart_con .nodata{text-align: center;}
.chart_con .nodata img{display: block;width: 100px;}
.chart_con .nodata span{display: block;position: absolute;font-size: 14px;color: #000;width: 100%;text-align: center;}
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
	tooltip: {
        trigger: 'xAxis',
        axisPointer : {
			type : 'shadow'
		}
    },
    legend: { // 图例
        data:[]
    },
    grid: {
        containLabel: true,
        show: true,
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

// echart 主模块，npm安装
var echarts = require('echarts/lib/echarts');
require('echarts/lib/component/legend'); // 图例
require('echarts/lib/component/tooltip'); // 工具箱
require('echarts/lib/chart/bar'); // 柱状图
require('echarts/lib/chart/line'); // 折线图
require('echarts/lib/chart/pie'); // 饼图


var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var Chart = Vue.extend({
	name: 'Chart',
	data: function(){
		return {
			initEd: false,
			chartData: [],
		}
	},
	vuex: {
	    getters: {
	        alertConfig: function() {
	            return store.state.alertConfig;
	        }
	    },
	    actions: actions
	},
	created: function(){
		this.initEd = true;
	},
	props: ['index','initData','resultArgvs','loading','currentData','pageComponentsData'],
	methods: {
		checkIsChart: function(){
			return this.currentData.type.match(/chart/i) !== null;
		},
		fetchData: function(cb, errcb){
			var _this = this;
			if(_this.resultArgvs.forceChange){
				delete _this.resultArgvs.forceChange;
			}
		    $.ajax({
		        url: _this.currentData.query_api + '_json',
		        type: 'get',
		        data: _this.resultArgvs,
		        timeout: 5000,
		        success: function(data){
		        	if(data.iserro){
		        		actions.alert(store, {
		        			show: true,
		        			msg: '查询失败',
		        			type: 'danger'
		        		})
		        		return;
		        	}
		            cb && cb(data);
		        },
		        error: function(jqXHR, status, errorThrown) {
	                if(status === 'timeout') {
						errcb && errcb();
	                } 
	            }
		    })
		},
		rinseData: function(chartType,data,map,config){
			var options = $.extend(true, {}, chartDataModel);
			var xAxis = [];
			var series = [];
			var legend = [];
			for(var item in data){
				xAxis.push(item);
			}
			for(var item in map){
				legend.push(map[item]);
				var _currentObj = {};
				_currentObj.type = chartType;
				_currentObj.stack = config.stack ? 'stack' : '';
				_currentObj.data = [];
				_currentObj.name = map[item];
				_currentObj.data = [];
				for(var dataItem in data){
					_currentObj.data.push({
						value: data[dataItem][item],
						name: dataItem
					});
				}
				series.push(_currentObj);
			}
			

			if(xAxis.length > 10){
				options.legend.orient = 'vertical';
				options.legend.left = 0;
			}
			options.legend.data = legend;
			options.xAxis.data = xAxis;
			options.series = series;


			// 柱状图 false:竖置 true:横置
			var categoryY = config.categoryY ? config.categoryY : false;
			if(categoryY){
				var _xAxis = options.xAxis;
				var _yAxis = options.yAxis;
				options.xAxis = _yAxis;
				options.yAxis = _xAxis;
			}

			if(chartType === 'pie'){
				options.legend.data = xAxis;
				delete options.xAxis;
				delete options.yAxis;
				delete options.grid;
			}
			return options;
		}
	},
	watch: {
	    'resultArgvs': {
	        handler: function(val){
	            // 参数改了 请求数据，进行渲染
	            if(this.checkIsChart()){
		            var _this = this;
		            _this.loading.show = true;
		            _this.loading.noLoaded += 1;
		            this.fetchData(function(data){
		            	_this.chartData = data.modelData;
		            	_this.chartData.forEach(function(item,domIndex){
		            		var chartOptions = _this.rinseData(item.type, item.data, item.map, item.config);
		            		setTimeout(function(){
		            			if(chartOptions.series[0].data.length){
		            				var Chart = echarts.init($('#chart_' + _this.index).find('.chart_con').eq(domIndex)[0]);
		            				Chart.setOption(chartOptions);
		            			}
		            		}, 1);
		            	})
		            	_this.loading.noLoaded -= 1;
		            	if(_this.loading.noLoaded === 0){
		            	    _this.loading.show = false;
		            	}
		            },function(){
		            	_this.loading.noLoaded -= 1;
		            	if(_this.loading.noLoaded === 0){
		            	    _this.loading.show = false;
		            	}
		            	// erro
		            	actions.alert(store, {
		            		show: true,
		            		msg: '查询超时',
		            		type: 'danger'
		            	})
		            })
	            }
	        },
	        deep: true
	    }
	}

})

module.exports = Chart;

</script>