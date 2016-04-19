'use strict';
var Vue = require('Vue');
var $ = require('jQuery');

// for jq plugin
window.jQuery = $;
window.$ = $;


var dom = require('./dom/index.js');

var _currentHtml = '';
var initHtml = function(defaultData, cb) {
    defaultData.forEach(function(item, index) {
        _currentHtml += '<m-main :index="' + index + '" :init-data="initData" :current-data="initData.defaultData['+ index +']" :loading.sync="loading"></m-main>\n';
    })
    $('#page-wrapper').html($('#page-wrapper').html() + _currentHtml);
    cb && cb();
}

if(window.initData){
    window.initData.defaultData === undefined ? window.initData.defaultData = [] : window.initData.defaultData = window.initData.defaultData;
    initHtml(window.initData.defaultData);

    var Loading = require('./component/loading.vue');
    var Main = require('./component/main.vue');
    var Alert = require('./component/alert.vue');

    var store = require('./store/store.js');

    var app = new Vue({
        el: '#page-wrapper',
        store,
        data: {
            loading: {
                show: true,
                noLoaded: 0
            },
            initData: window.initData
        },
        components: {
            'm-loading': Loading,
            'm-main': Main,
            'm-alert': Alert
        }
    });
}

