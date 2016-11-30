<template>
    CCC
</template>

<script>
let Vue = require("Vue");


module.exports = Vue.extend({
    ready(){
        console.log(this.$route.params);
    }
});
</script>