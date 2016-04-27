<template>
    <!-- <div id="page-wrapper" style="min-height: 1054px;"> -->
        <m-loading :loading.sync="loading"></m-loading>
        <m-alert></m-alert>
        <m-modal></m-modal>
        <m-main v-for="item in currentPageDefaultData.defaultData" :index="$index" :init-data="initData" :current-data="currentPageDefaultData.defaultData[$index]" :loading.sync="loading"></m-main>
    <!-- </div> -->
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
            loading: {
                show: true,
                noLoaded: 0
            },
            initData: window.allPageConfig
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