<template>
<div class="mask" v-show="mask"> </div>
<visualbp> </visualbp>
</template>
<script>
	let Vue = require('Vue');
	let $ = require('jQuery');
	let utils = require('utils');
	let api = require('./api');
	let Loading = require('../../common/loading.vue');
	let visualbp = require('./visualbp.vue');

	let heatmap = Vue.extend({
		name: 'databp',
		components: {
			'visualbp': visualbp
		},
		data: function() {
			return {
				mask: true
			}
		},
		route: {
	        activate: function (transition) {
				let query = this.$route.query;   	
	        	let pageUrl = query.pageUrl;
				if (pageUrl) {
					this.$broadcast('visual_url', query);
				}
				return Promise.resolve(true);
	        }
    	},
		events: {
		    'visualbp_loaded': function (config) {
		    	this.init(config);
		    }
		},
		methods: {
			init(config) {
				api.getHeatData(config).then((data) => {
					var $iframe = $('iframe').contents();
					var $body = $iframe.find('body');
					// let $elem = $iframe.find('body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li.active > a');
	    //   			let mask = this.genDiv($elem, 200);
	    //   			$body.append(mask);
					
		      		for(let t of data) {
		      			let $elem = $iframe.find(t.selector);
		      			let mask = this.genDiv($elem, t.pv/100);
		      			$body.append(mask);
		      		}
		      	})
			},
			genDiv($elem, value) {
				let offset = $elem.offset();
				let width = $elem.outerWidth();
				let height = $elem.outerHeight();
				let centerX = offset.left + width / 2;
				let centerY = offset.top + height / 2;
				let newDiv = document.createElement("div");
				newDiv.style = `z-index:900;height:${value}px;width:${value}px; position:absolute;top:${centerY-value/2}px;left:${centerX-value/2}px;background: radial-gradient(red, yellow 20%, #1E90FF 30%, rgba(255,255,255,0) 50%);`;
				return newDiv;
			}
		}
	});
	module.exports = heatmap;
</script>
<style scoped>
.mask {
	position: absolute;
	margin-top: 60px;
	width: 100%;
	height: 100%;
	top: 0;
	z-index: 100;
	cursor: auto;
	background: rgba(255,255,255,0.2);
}

</style>
