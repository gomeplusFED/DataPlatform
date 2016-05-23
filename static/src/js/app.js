'use strict';
var Vue = require('Vue');
var $ = require('jQuery');
var VueRouter = require('vue-router')
Vue.use(VueRouter);


// for jq plugin and debug
window.jQuery = $;
window.$ = $;


var dom = require('./dom/index.js');

var blankApp = Vue.extend({});

var App = require('./component/app.vue');
var Index = require('./component/index.vue');

var User = require('./component/main/user.vue');
var Role = require('./component/main/role.vue');
var Log = require('./component/main/log.vue');

var Erro = require('./component/common/404.vue');

var router = new VueRouter();

var store = require('./store/store.js');
var actions = require('./store/actions.js');

router.map({
    '*': {
        component: App
    },
    '/': {
        component: Index
    },
    '/user': {
        component: User
    },
    '/role': {
        component: Role
    },
    '/log': {
        component: Log
    },
    '/error': {
        component: Erro
    }
});

router.start(blankApp, '#page-wrapper');

router.afterEach(function(transition) {
    var url = window.location.hash;
    $('[href="' + url + '"]').parent().parent().parent().addClass('active');
    $('[href="' + url + '"]').parent().parent().addClass('in').attr('aria-expanded', true);
    $('[href="' + url + '"]').focus();
    $('#side-menu a').removeClass('active');
    $('[href="' + url + '"]').addClass('active');

    var key = transition.to.path;
    actions.setCurrentPageDefaultData(store, window.allPageConfig.page[key])
    if (!window.allPageConfig.page[key]) {
        actions.alert(store, {
            show: true,
            msg: '路径有误',
            type: 'danger'
        })
        router.go({
            path: '/'
        })
    }
});

$.ajaxSetup({
    global: true,
    complete: function(XMLHttpRequest, status) {
        var res = {};
        try{
            res = JSON.parse(XMLHttpRequest.responseText);
        }catch(e){};
        if(res.iserro){
            router.go('/error');
        }
    }
})
