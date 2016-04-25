'use strict';
var Vue = require('Vue');
var $ = require('jQuery');
var VueRouter = require('vue-router')
Vue.use(VueRouter);


// for jq plugin
window.jQuery = $;
window.$ = $;


var dom = require('./dom/index.js');

var blankApp = Vue.extend({});

var App = require('./component/app.vue');

var router = new VueRouter();

var store = require('./store/store.js');
var actions = require('./store/actions.js');

router.map({
    '*': {
        component: App
    }
});

console.log(111);
router.beforeEach(function (transition) {

    var url = window.location.hash;
    $('[href="'+ url +'"]').parent().parent().parent().addClass('active');
    $('[href="'+ url +'"]').parent().parent().addClass('in').attr('aria-expanded', true);
    console.log($('[href="'+ url +'"]'));

    var key = transition.to.path;
    actions.setCurrentPageDefaultData(store, window.allPageConfig.page[key])
    if(! window.allPageConfig.page[key]){
        router.go({
            path: '/dataOverview/app'
        })
    }

});

router.redirect({
    '/': '/dataOverview/app'
});


router.start(App, '#page-wrapper');
