<template>
	<h2>{{userInfo.name}}，欢迎来到数据平台！</h2>
	<h3>需要权限修改请联系：<a href="mailto:chenjuan@gomeplus.com">陈娟</a></h3>
	<br>
	<hr>
	<h4>本平台所有模块</h4>
	<ul class="module">
		<li v-for="item in allModule"><span>{{item.name}}</span></li>
	</ul>
</template>
<style soped>
.module {
	font-size: 0;
}
.module li {
	font-size: 14px;
	line-height: 28px;
	display: inline-block;
	width: 50%;
	margin: 5px 0;
}
.module li span {
	background-color: rgba(0, 0, 0, 0.3);
	color: #fff;
	padding: 10px 16px;
	display: inline-block;
	width: 50%;
}
</style>
<script>
var Vue = require('Vue');

var store = require('../store/store.js');

var Index = Vue.extend({
	name: 'App',
	store: store,
	data: function() {
		return {
			userInfo: window.allPageConfig.userInfo,
			allModule: window.allPageConfig.pageAll
		};
	},
	ready: function() {

	}
});

module.exports = Index;
</script>
