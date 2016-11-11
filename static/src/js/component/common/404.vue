<template>
    <p>{{second}}秒后回到<a href="#" v-link="{path: '/'}">首页</a></p>
	<img src="/dist/img/404.png"/>
</template>

<script>
	
var Vue = require('Vue');
var timer;
var Erro = Vue.extend({
    name: 'Erro',
    data() {
        return {
            second: 5
        }
    },
    route: {
        data() {
            clearInterval(timer);
            timer = setInterval(() => {
                if (!this.second) {
                    this.$route.router.go({
						path: '/'
					});
                    clearInterval(timer);
                } else {
                    this.second--;
                }
            }, 1000);
        }
    }
})

module.exports = Erro;
</script>