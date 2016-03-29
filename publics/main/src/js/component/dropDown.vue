<template>
	<div class="btn-group searchDatas head_group" :id="'dropDown_'+componentType+'_'+index" v-show="pageComponentsData['drop_down'][componentType]['show']">
	    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	    	{{currentItem}}
	    	<span class="caret caret_close"></span>
	    </button>
	    <ul class="dropdown-menu">
	        <li v-for="item in pageComponentsData['drop_down'][componentType]['defaultData']" @click="getArgv($event)"><a>{{item}}</a></li>
	    </ul>
	</div>
</template>

<style>
.btn-group .dropdown-menu li{cursor: pointer;}
.btn-group .caret{transition: all ease 0.2s;-webkit-transition: all ease 0.2s;}
.btn-group .caret_close{transform: rotate(-90deg);-webkit-transform: rotate(-90deg);}
.btn-group .caret_open{transform: rotate(0deg);-webkit-transform: rotate(0deg);}
</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var DropDown = Vue.extend({
	name: 'DropDown',
	data: function(){
		return {
			currentItem: ''
		}
	},
	props: ['index','pageComponentsData','componentType','argvs'],
	ready: function(){
		if(this.pageComponentsData['drop_down'][this.componentType]['show']){
			$('#dropDown_'+this.componentType+'_'+this.index).find('ul li').eq(0).trigger('click');
		}
		$('#dropDown_'+this.componentType+'_'+this.index).on('click',function(){
			if($(this).find('.caret').hasClass('caret_close')){
				$(this).find('.caret').removeClass('caret_close');
				$(this).find('.caret').addClass('caret_open');
			}else{
				$(this).find('.caret').removeClass('caret_open');
				$(this).find('.caret').addClass('caret_close');
			}
		})
	},
	methods: {
		getArgv: function(ev){
			var keyMap = {
				plataform: 'type',
				channel: 'channel',
				version: 'ver',
				coupon: 'coupon_type'
			}
			this.currentItem = $(ev.target).text();
			this.argvs[keyMap[this.componentType]] = $(ev.target).text();
		}
	}
})
module.exports = DropDown;

</script>