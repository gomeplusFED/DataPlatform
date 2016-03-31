<template>
	<div class="filter_select" :id="'filter_select_'+index" v-show="pageComponentsData[componentType].show">
		<strong>{{pageComponentsData[componentType].data.title}}</strong>
		<div class="groups_con">
			<div class="radio-inline" v-for="item in pageComponentsData[componentType].data.groups">
				<label><input type="radio" name="filter_select" :key="item.key" @change="getArgv(item.key)">{{item.value}}</label>
			</div>
		</div>
	</div>
</template>

<style>

</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var FilterSelect = Vue.extend({
	name: 'FilterSelect',
	data: function(){
		return {

		}
	},
	props: ['index','pageComponentsData','componentType','argvs','initData'],
	ready: function(){
		
	},
	methods: {
		getArgv: function(key){
			// console.log($(ev.target).attr('key'));
			console.log(key);
		}
	},
	watch: {
		'pageComponentsData': {
			handler: function(val){
				// 异步请求组件参数，watch到变化之后初始化，其它组件类似
				if(val === null || !this.pageComponentsData[this.componentType].show){
					return;
				}
				this.$log('pageComponentsData');
			},
			deep: true
		}
	}
})
module.exports = FilterSelect;

</script>