<template>
    SAAAAAA

    <button @click="go">Go</button>
</template>

<script>
let Vue = require("Vue");


module.exports = Vue.extend({
    methods : {
        go(){
            console.log(window.Result);
        }
    }
});
</script>