<template>
    BBBB
    <button @click="go">Go</button>
    <!-- <router-view keep-alive></router-view> -->
</template>

<script>
/**
 * 子模块界面
*/


let Vue = require("Vue");


module.exports = Vue.extend({
    methods : {
        go(){
            console.log(this.$route);
        }
    },
    ready(){
        console.log(this.$route.params);

        console.log(window.Result);
    }
});
</script>