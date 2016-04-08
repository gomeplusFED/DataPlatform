<template>
	<div class="filter_select" v-show="pageComponentsData[componentType].length > 0">
		<div class="filter_group" :id="'filter_group_' + index + '_' + $index" v-for="item in pageComponentsData[componentType]" track-by="$index">
			<div class="group">
				<strong>{{item.title}}{{item.title === '' ? '' : '：'}}</strong>
				<div class="btn_group">
					<button v-for="group in item.groups" @click="getArgv(item.filter_key,group.key,$event)" track-by="$index">{{group.value}}</button>
				</div>	
			</div>
		</div>
	</div>
</template>

<style>
.filter_select{font-size: 0;margin: 0 0 12px 0;display: inline-block;}
.filter_select .filter_group{display: inline-block;vertical-align: middle;margin-right: 25px;}
.filter_select .filter_group .group{}
.filter_select .filter_group .group strong{font-size: 12px;display: inline-block;vertical-align: middle;}
.filter_select .filter_group .group .btn_group{font-size: 0;display: inline-block;vertical-align: middle;}
.filter_select .filter_group .group .btn_group:hover button{border-color: #bbb;}
.filter_select .filter_group .group .btn_group button{display: inline-block;vertical-align: middle;border: 1px solid #cacaca;color: #333;padding: 4px 12px;background: #fff;font-size: 12px;outline: none;margin-left: -1px;transition: all ease 0.2s;-webkit-transition: all ease 0.2s;}
.filter_select .filter_group .group .btn_group button:hover{background: #f5f5f5;}
.filter_select .filter_group .group .btn_group button:first-child{border-radius: 2px 0 0 2px;margin-left: 0;}
.filter_select .filter_group .group .btn_group button:last-child{border-radius: 0 2px 2px 0;}
.filter_select .filter_group .group .btn_group button.active{background: #3389d4;border: 1px solid #3389d4;color: #fff;}
</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var FilterSelect = Vue.extend({
	name: 'FilterSelect',
	data: function(){
		return {
			targetParentGroup: null
		}
	},
	props: ['index','pageComponentsData','componentType','argvs','initData'],
	ready: function(){
		
	},
	methods: {
		getArgv: function(key,value,ev){
			Vue.set(this.argvs, key, value);
		}
	},
	watch: {
		'pageComponentsData': {
			handler: function(val){
				var _this = this;
				// 异步请求组件参数，watch到变化之后初始化，其它组件类似
				if(val === null || !this.pageComponentsData[this.componentType].length > 0){
					return;
				}
				for(var i = 0;i < this.pageComponentsData[this.componentType].length;i++){
					(function(filterIndex){
						$('#filter_group_' + _this.index + '_' + filterIndex).find('button').bind('click',function(){
							$('#filter_group_' + _this.index + '_' + filterIndex).find('button').removeClass('active');
							$(this).addClass('active');
						})
					})(i)
					$('#filter_group_' + this.index + '_' + i).find('button').eq(0).trigger('click');
				}

			},
			deep: true
		}
	}
})
module.exports = FilterSelect;

</script>