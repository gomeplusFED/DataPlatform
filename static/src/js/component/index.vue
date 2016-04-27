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
            loading: {
                show: true,
                noLoaded: 0
            }
		}
	},
    ready: function(){
        console.log(111);
    }
})

module.exports = Index;

</script>