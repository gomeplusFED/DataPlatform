<template>
    <h1>首页</h1>
</template>

<script>

var Vue = require('Vue');

var store = require('../store/store.js');

var Index = Vue.extend({
	name: 'App',
	store: store,
	data: function(){
		return {
            
		}
	},
    ready: function(){

    }
})

module.exports = Index;

</script>