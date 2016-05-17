<template>
    <h2>{{userInfo.name}}，欢迎来到数据平台！</h2>
    <h3>需要权限修改请联系：<a href="mailto:peijingjuan@gomeplus.com">裴静娟</a></h3>
</template>

<script>

var Vue = require('Vue');

var store = require('../store/store.js');

var Index = Vue.extend({
	name: 'App',
	store: store,
	data: function(){
		return {
            userInfo: window.allPageConfig.userInfo
		}
	},
    ready: function(){

    }
})

module.exports = Index;

</script>