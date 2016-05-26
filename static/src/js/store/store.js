var Vue = require('Vue');
var Vuex = require('Vuex');

Vue.use(Vuex);

var state = {
    alertConfig: {
        show: false,
        msg: '提示信息',
        type: 'info'
    },
    modalTableData: {
        show: false,
        title: '弹窗表格',
        data: null, // 表格数据
        query_api: null,
        query_parmas: null
    },
    currentPageDefaultData: null,
    confirmConfig: {
        show: false,
        title: '弹出对话框',
        msg: '提示信息',
        apply: 'func',
        cancle: 'func'
    }
}

var actions = require('./actions.js');

var mutations = {};

mutations.ALERT = function(state, params) {
    state.alertConfig.show = params.show;
    state.alertConfig.msg = params.msg || '提示信息';
    state.alertConfig.type = params.type || 'info';  // info/warning/success/danger
}

mutations.HIDEALERT = function(state) {
    state.alertConfig.show = false;
}

mutations.MODALTABLE = function(state, params) {
    state.modalTableData.title = params.title || '';
    state.modalTableData.data = params.data || null;
    state.modalTableData.show = params.show || false;
    state.modalTableData.query_api = params.query_api || null;
    state.modalTableData.query_parmas = params.query_parmas || null;
}

mutations.HIDEMODALTABLE = function(state) {
    state.modalTableData.show = false;
}

mutations.SETCURRENTPAGEDEFAULTDATA = function(state, data) {
    state.currentPageDefaultData = data;
}

mutations.CONFIRM = function(state, params){
    state.confirmConfig.show = params.show;
    state.confirmConfig.title = params.title || '弹窗';
    state.confirmConfig.msg = params.msg || '';
    state.confirmConfig.apply = params.apply || function(){};
    state.confirmConfig.cancle = params.cancle || function(){};
}

mutations.HIDECONFIRM = function(state){
    state.confirmConfig.show = false;
}

module.exports = new Vuex.Store({
    state,
    mutations,
    actions,
    strict: true
})
