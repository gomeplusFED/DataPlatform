'use strict';
var Vue = require('Vue');
var $ = require('jQuery');

var dom = require('./dom/index.js');

// 之后改为ejs渲染
var initHtml = function(defaultData, cb) {
    var _currentHtml = '';
    defaultData.forEach(function(item, index) {
        _currentHtml += '<m-main :index="' + index + '" :init-data="initData" :current-data="initData.defaultData['+ index +']" :loading.sync="loading"></m-main>\n';
    })
    $('#page-wrapper').html($('#page-wrapper').html() + _currentHtml);
    cb && cb();
}

window.initData.defaultData === undefined ? window.initData.defaultData = [] : window.initData.defaultData = window.initData.defaultData;
initHtml(window.initData.defaultData);

var Loading = require('./component/loading.vue');
var Main = require('./component/main.vue');
var Table = require('./component/table.vue');
var Chart = require('./component/chart.vue');

var app = new Vue({
    el: '#page-wrapper',
    data: {
        loading: false,
        initData: window.initData,
    },
    components: {
        'm-loading': Loading,
        'm-main': Main,
        'm-table': Table,
        'm-chart': Chart
    }
});
