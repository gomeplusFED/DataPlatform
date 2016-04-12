<template>
<div class="loading_bg" v-if="loading" transition="fade">
	<div class="loading_main all_center">
		<img src="/dist/img/loading.png">
		<span>加载中...</span>
	</div>	
</div>
</template>

<style>
.loading_bg{position: fixed;width: 100%;height: 100%;left: 0;top: 0;background: rgba(0,0,0,0.6);z-index: 9999;}
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

var loadingBeginTime = Date.now();

var Loading = Vue.extend({
	name: 'Loading',
	data: function(){
		return {
			
		}
	},
	props: ['loading'],
})


var loadingBeginTime = Date.now();
Vue.transition('fade', {
	css: false,
    beforeEnter: function (el) {
		loadingBeginTime = Date.now();
    },
    enter: function (el, done) {
    	$(el).css('opacity', 1).animate({ opacity: 1 }, 300, done)
    },
    afterEnter: function (el) {
        
    },
    enterCancelled: function (el) {
    	$(el).stop();
    },
    beforeLeave: function (el) {
        
    },
    leave: function (el, done) {
        if(Date.now() - loadingBeginTime < 300){
        	setTimeout(function(){
        		$(el).animate({ opacity: 0 }, 300, done)
        	}, 300);
        }else{
        	$(el).animate({ opacity: 0 }, 300, done)
        }
    },
    afterLeave: function (el) {
        
    },
    leaveCancelled: function (el) {
        $(el).stop();
    }
})


module.exports = Loading;

</script>