<template>
    <m-loading :loading.sync="loading"></m-loading>
    <m-alert></m-alert>
    <m-modal></m-modal>
    <m-main v-for="item in currentPageDefaultData" :index="$index"></m-main>
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
    el: '#page-wrapper',
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
    }

})

module.exports = App;

</script>