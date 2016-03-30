<template>
	<div class="head_group" :id="'dat_type_btn'+index" v-show="pageComponentsData.date_type.show">
	    <input class="btn btn-default" type="button" value="天" day_type="1" @click="getArgv($event)"/>
	    <input class="btn btn-default" type="button" value="周" day_type="2" @click="getArgv($event)"/>
	    <input class="btn btn-default" type="button" value="月" day_type="3" @click="getArgv($event)"/>
	</div>
</template>

<style>
/*.detailDate {background-color: #428bca;color: #fff;border-radius: 3px;border-width: 0;}*/
</style>

<script>
var Vue = require('Vue');
var $ = require('jQuery');

var DayType = Vue.extend({
	name: 'DayType',
	data: function(){
		return {

		}
	},
	props: ['index','pageComponentsData','argvs'],
	ready: function(){
		$('#dat_type_btn'+this.index).find('input').bind('click',function(){
			$(this).siblings().removeClass('btn-primary');
			$(this).addClass('btn-primary');
		})
		if(this.pageComponentsData.date_type.show){
			$('#dat_type_btn'+this.index).find('input').eq(0).trigger("click");
		}
	},
	methods: {
		getArgv: function(ev){
			if(this.pageComponentsData.date_type.show){
				this.argvs['day_type'] = $(ev.target).attr('day_type');
			}
		}
	}
})

module.exports = DayType;

</script>