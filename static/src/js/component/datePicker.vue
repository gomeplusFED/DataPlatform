<template>
    <div class="date_picker">
        
    </div>
</template>
<style>

</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');
var DateCom = Vue.extend({
    name: 'DateCom',
    data: function() {
        return {

        }
    },
    props: ['index', 'pageComponentsData', 'argvs'],
    ready: function() {
        
    },
    methods: {
        formatTime: function(value) {
            if (!value) {
                return {
                    startTime: "",
                    endTime: ""
                };
            }
            var arr = value.split("~");
            return {
                startTime: arr[0].split("(")[1],
                endTime: arr[1].split(")")[0]
            };
        }
    }
})
module.exports = DateCom;
</script>