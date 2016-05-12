<template>
    <h2>{{userInfo.name}}，欢迎来到数据平台！</h2>
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