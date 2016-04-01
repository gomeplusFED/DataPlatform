<template>
	<div :id="'chart_'+index" class="chart" v-show="checkIsChart()">
		<div class="chart_con" v-for="item in chartData" style="height: 400px;width: 100%;"></div>
	</div>
</template>

<style>
	
</style>

<script>

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
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip'); //
require('echarts/lib/chart/bar'); // 柱状图
require('echarts/lib/chart/line'); // 折线图
require('echarts/lib/chart/pie'); // 饼图

var Chart = Vue.extend({
	name: 'Chart',
	data: function(){
		return {
			initEd: false,
			chartData: [],
		}
	},
	created: function(){
		this.initEd = true;
	},
	props: ['index','initData','resultArgvs','loading','currentData','pageComponentsData'],
	methods: {
		checkIsChart: function(){
			return this.currentData.type.match(/chart/i) !== null;
		},
		fetchData: function(cb){
			var _this = this;
		    $.ajax({
		        url: _this.currentData.query_api + '_json',
		        type: 'get',
		        data: _this.resultArgvs,
		        success: function(data){
		            cb && cb(data);
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
			options.legend.data = legend;
			options.xAxis.data = xAxis;
			options.series = series;
			if(chartType === 'pie'){
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
		            this.$log('resultArgvs');
		            var _this = this;
		            _this.loading = true;
		            this.fetchData(function(data){
		            	_this.chartData = data.modelData;
		            	_this.chartData.forEach(function(item,domIndex){
		            		var chartOptions = _this.rinseData(item.type, item.data, item.map, item.config);
		            		setTimeout(function(){
		            			var Chart = echarts.init($('#chart_' + _this.index).find('.chart_con').eq(domIndex)[0]);
		            			Chart.setOption(chartOptions);
		            		}, 1);
		            		if(_this.loading === 1 || _this.initEd){
		            		    _this.loading = false;
		            		}else{
		            		    _this.loading = 1;
		            		}
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