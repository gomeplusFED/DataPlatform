<template>
	<div :id="'chart_'+index" class="chart" v-show="checkIsChart()">
		<h1>12312</h1>
	</div>
</template>

<style>
	
</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var Chart = Vue.extend({
	name: 'Chart',
	data: function(){
		return {

		}
	},
	props: ['index','initData','resultArgvs','loading','currentData','pageComponentsData'],
	methods: {
		checkIsChart: function(){
			return this.currentData.type.match(/chart/i) !== null;
		},
		fetchData: function(cb){
			var _this = this;
		    $.ajax({
		        url: data.query_api,
		        type: 'get',
		        data: _this.resultArgvs,
		        success: function(data){
		            cb && cb(data);
		        }
		    })
		}
	},
	watch: {
	    'resultArgvs': {
	        handler: function(val){
	            // 参数改了 请求数据，进行渲染
	            if(this.checkIsChart()){
		            this.$log('resultArgvs');
		            // this.fetchData(function(data){

		            // })
	            }
	        },
	        deep: true
	    }
	}

})

module.exports = Chart;

</script>