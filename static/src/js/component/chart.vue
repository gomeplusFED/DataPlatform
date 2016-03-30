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
	props: ['index','initData','argvs','loading','currentData'],
	methods: {
		checkIsChart: function(){
			return this.currentData.type.match(/chart/i) !== null;
		},
		fetchData: function(cb){
		    $.ajax({
		        url: data.query_api,
		        type: 'get',
		        data: this.argvs,
		        success: function(data){
		            cb && cb(data);
		        }
		    })
		}
	},
	watch: {
	    'argvs': {
	        handler: function(val){
	            // 参数改了 请求数据，进行渲染
	            if(this.checkIsChart()){
		            this.$log('argvs');
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