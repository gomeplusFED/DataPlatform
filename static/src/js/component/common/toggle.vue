<template>
<div class="btn-group" v-if="show || pageComponentsData[componentType].show">
    <button type="button" class="btn btn-default btn-sm" @click="fun('table')">
        <span class="fa fa-table"></span>表格
    </button>
    <button type="button" class="btn btn-default btn-sm" @click="fun('chart')">
        <span class="fa fa-bar-chart"></span>图表
    </button>
</div>
</template>
<script>
var Vue = require('Vue');

var Toggle = Vue.extend({
    name: 'Toggle',
    props: ['pageComponentsData', 'componentType', 'show', 'fun']
})
module.exports = Toggle;
</script>