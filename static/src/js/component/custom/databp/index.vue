<template>
	<router-view keep-alive></router-view>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');

	var App = Vue.extend({
		name: 'DataBp',
		route: {
			data: function(transition) {
				var url = this.$route.path.replace(/(\?.*)/, '');

				// $('[href="#!' + url + '"]').parent().parent().parent().addClass('active');
				$('[href="#!' + url + '"]').focus();
				$('#side-menu a').removeClass('active');
				$('[href="#!' + url + '"]').addClass('active');

			}
		}

});

	module.exports = App;
</script>