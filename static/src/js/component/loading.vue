<template>
<div class="loading_bg" v-show="loading" transition="fade">
	<div class="loading_main all_center">
		<img src="/main/dist/img/loading.png">
		<span>加载中...</span>
	</div>	
</div>
</template>

<style>
.loading_bg{position: absolute;width: 100%;height: 100%;left: 0;top: 0;background: rgba(0,0,0,0.6);z-index: 999;}
.loading_bg .loading_main{width: 120px;height: 120px;background: #fff;border-radius: 12px;}
.loading_bg .loading_main img{display: block;margin: 32px auto 0;-webkit-animation:loading linear both 1s infinite;}
.loading_bg .loading_main span{display: block;width: 100%;text-align: center;font-size: 14px;line-height: 24px;margin-top: 5px;}
@-webkit-keyframes loading {
    from {   
        -webkit-transform: rotate(0deg);
    }
    to {    
        -webkit-transform: rotate(360deg);
    }
}
</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var Loading = Vue.extend({
	name: 'Loading',
	data: function(){
		return {

		}
	},
	props: ['loading']
})

module.exports = Loading;

</script>