<template>
<ul class="con">
	<li>
		<span>选择</span>
		<span>一级目录</span>
		<span>二级目录／页面</span>
		<span>导出权限</span>
	</li>
	<li v-for="(key,item1) in pageAll">
		<div @click.stop="showLevel($event, $index)">
			<span><input @click.stop="parseLimitAll()" type="checkbox"></input></span>
			<span>{{item1.name}}</span>
			<span>&nbsp;</span>
			<span><label><input type="checkbox" v-model="exportLimit[key].length === item1.path.length"/>数据导出</label></span>
		</div>
		<ul v-show="levelShow[$index]">
			<li v-for="item2 in item1.path">
				<span><input type="checkbox" v-model="limitedObj[key][$index]"></input></span>
				<span>&nbsp;</span>
				<span>{{item2.name}}</span>
				<span><label><input type="checkbox" v-model="exportLimitObj[key][$index]"/>数据导出</label></span>
			</li>
		</ul>
	</li>
</ul>


</template>

<style scoped>
label{
	margin: 0;
}
label input{
	margin: 0 5px 0 0;
}
.con{
	width: 100%;
	border: 1px solid #333;
	box-sizing: border-box;
}
.con>li{
	width: 100%;
	font-size: 0;
}
.con>li span{
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	font-size: 14px;
	line-height: 32px;
	border-right: 1px solid #333;
	border-bottom: 1px solid #333;
	box-sizing: border-box;
}
.con>li span:nth-child(1){
	width: 10%;
}
.con>li span:nth-child(2){
	width: 30%;
}

.con>li span:nth-child(3){
	width: 30%;
}

.con>li span:nth-child(4){
	width: 30%;
	border-right: none;
}

.con>li>div{
	font-size: 0;
	background-color: rgb(204,204,255);
	cursor: pointer;
}
.con>li:last-child span{
	border-bottom: none;
}

.con>li>ul{
	font-size: 0;
	width: 100%;
}
.con>li>ul>li{
	font-size: 0px;
}

</style>

<script>
var Vue = require('Vue');
var $ = require('jQuery');

var LimitList = Vue.extend({
	name: 'LimitList',
	data: function(){
		return {
			pageAll: window.allPageConfig.pageAll,
			levelShow: {},
			limitedObj: {},
			exportLimitObj: {}
		}
	},
	props: ['id', 'limited', 'exportLimit'],
	created: function(){
		var count = 0;
		for(var item in this.pageAll){
			if(count === 0){
				Vue.set(this.levelShow, count, true);	
			}else{
				Vue.set(this.levelShow, count, false);
			}
			count += 1;
		}
	},
	methods: {
		showLevel: function(ev, index){
			if(ev.target.tagName === 'INPUT' || ev.target.tagName === 'LABEL'){
				return;
			}
			this.levelShow[index] = !this.levelShow[index];
		},
		parseLimitAll: function(){
			
			return true;
		},
		parseLimit: function(key, index){

		},
		parseArrayToObject: function(array){
			var result = {};
			for(var i = 0; i < array.length; i++){
				result[array[i]] = true;
			}
			return result;
		}
	},
	watch: {
		limited: {
			handler: function(val){
				for(var item in this.limited){
					var _curretnObj = this.parseArrayToObject(this.limited[item]);
					Vue.set(this.limitedObj, item, _curretnObj);
				}
			},
			deep: true
		},
		exportLimit: {
			handler: function(val){
				for(var item in this.exportLimit){
					var _curretnObj = this.parseArrayToObject(this.exportLimit[item]);
					Vue.set(this.exportLimitObj, item, _curretnObj);
				}
			},
			deep: true
		}
	}
})

module.exports = LimitList;

</script>