<template>
<ul class="con">
	<li>
		<span>选择</span>
		<span>一级目录</span>
		<span>二级目录／页面</span>
		<span>导出权限</span>
	</li>
	<li v-for="item1 in pageAll">
		<div>
			<span><input type="checkbox"></input></span>
			<span>{{item1.name}}</span>
			<span>&nbsp;</span>
			<span><label><input type="checkbox"/>数据导出</label></span>
		</div>
		<ul>
			<li v-for="item2 in item1.path">
				<span><input type="checkbox"></input></span>
				<span>&nbsp;</span>
				<span>{{item2.name}}</span>
				<span><label><input type="checkbox"/>数据导出</label></span>
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
			pageAll: window.allPageConfig.pageAll
		}
	},
	props: ['limited'],
	created: function(){
		console.log(this.limited);
	}
})

module.exports = LimitList;

</script>