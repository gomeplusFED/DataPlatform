'use strict';
var Vue = require('Vue');
var $ = require('jQuery');
var VueRouter = require('vue-router')
Vue.use(VueRouter);


// for jq plugin
window.jQuery = $;
window.$ = $;


var dom = require('./dom/index.js');

// var _currentHtml = '';
// var initHtml = function(defaultData, cb) {
//     defaultData.forEach(function(item, index) {
//         _currentHtml += '<m-main :index="' + index + '" :init-data="initData" :current-data="initData.defaultData['+ index +']" :loading.sync="loading"></m-main>\n';
//     })
//     $('#page-wrapper').html($('#page-wrapper').html() + _currentHtml);
//     cb && cb();
// }

// if(window.initData){
    // window.initData.defaultData === undefined ? window.initData.defaultData = [] : window.initData.defaultData = window.initData.defaultData;
    // initHtml(window.initData.defaultData);

    // var Loading = require('./component/loading.vue');
    // var Main = require('./component/main.vue');
    // var Alert = require('./component/alert.vue');
    // var ModalTable = require('./component/modalTable.vue');

    // var store = require('./store/store.js');

    // var app = new Vue({
    //     el: '#page-wrapper',
    //     store,
    //     data: {
    //         loading: {
    //             show: true,
    //             noLoaded: 0
    //         },
    //         initData: window.initData
    //     },
    //     components: {
    //         'm-loading': Loading,
    //         'm-main': Main,
    //         'm-alert': Alert,
    //         'm-modal': ModalTable
    //     }
    // });

    var blankApp = Vue.extend({});

    var App = require('./component/app.vue');

    var router = new VueRouter();

    var store = require('./store/store.js');
    var actions = require('./store/actions.js');

    router.map({
        '*': {
            component: App
        }
    })

    router.beforeEach(function (transition) {
        // console.log(transition.to.path);
        var key = transition.to.path;
        actions.setCurrentPageDefaultData(store, window.allPageConfig.page[key])
        if(!window.allPageConfig[key]){
            router.go({
                // path: '/dataOverview/app'
            })
        }
    })

    router.redirect({
        '/': '/dataOverview/app'
    })



    router.start(App, '#page-wrapper')
// }

