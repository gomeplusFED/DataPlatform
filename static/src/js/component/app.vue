<template>
    <m-loading :loading.sync="loading"></m-loading>
    <m-alert></m-alert>
    <m-modal></m-modal>
    <m-main v-for="item in currentPageDefaultData.defaultData" :index="$index" :current-data="currentPageDefaultData.defaultData[$index]" :loading.sync="loading"></m-main>
</template>


<script>

var Vue = require('Vue');

var store = require('../store/store.js');

var Loading = require('./common/loading.vue');
var Alert = require('./common/alert.vue');
var ModalTable = require('./common/modalTable.vue');
var Main = require('./main/main.vue');

var App = Vue.extend({
	name: 'App',
	store: store,
	data: function(){
		return {

		}
	},
    vuex: {
        getters: {
            currentPageDefaultData: function() {
                return store.state.currentPageDefaultData;
            }
        }
    },
    components: {
        'm-loading': Loading,
        'm-alert': Alert,
        'm-modal': ModalTable,
        'm-main': Main
    },
    watch: {
        'currentPageDefaultData': {
            handle: function(val){
                console.log(val);
            },
            deep: true
        }
    }

})

module.exports = App;

</script>