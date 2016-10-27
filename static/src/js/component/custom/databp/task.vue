<template>
<div>this is databp view任务管理</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');

	var Loading = require('../../common/loading.vue');
	
	var databp = Vue.extend({
		name: 'databp',
		components: {
			'm-loading': Loading
		},
		data: function() {
			return {
				loading: {
					show: true,
					noLoaded: 0
				},
				model: {
					channel_type: '',
					channel_type_code:'',
					channel_name: '',
					channel_type: '',
					channel_ex: ''
				},
				list: []
			}
		},
		methods: {
		}
	});

	module.exports = databp;
</script>
<style scoped>
	.add-channel {
		margin-bottom: 20px;
	}
</style>
