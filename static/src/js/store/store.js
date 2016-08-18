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
    },
    exportConfirmConfig: {
        show: false,
        title: '请选择导出数据范围（<1000）',
        len: 0,
        apply: 'func',
        cancle: 'func'
    },
    tabCheckboxConfig: {
        show: false,
        title: "筛选",
        max: 0,
        groups: [],
        apply: 'func'
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

mutations.MODALTABLE = function(state, params){
    if (params.title) {
        state.modalTableData.title = params.title;
    }
    if (params.data) {
        state.modalTableData.data = params.data;
    }
    state.modalTableData.show = params.show;
    if (params.query_api) {
        state.modalTableData.query_api = params.query_api;
    }
    if (params.query_parmas) {
        state.modalTableData.query_parmas = params.query_parmas;
    }
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

mutations.EXPORTCONFIRM = function(state, params){
    state.exportConfirmConfig.show = params.show;
    state.exportConfirmConfig.title = params.title || '弹窗';
    state.exportConfirmConfig.len = params.len || 0;
    state.exportConfirmConfig.apply = params.apply || function(){};
    state.exportConfirmConfig.cancle = params.cancle || function(){};
}

mutations.HIDECONFIRM = function(state){
    state.confirmConfig.show = false;
}

mutations.TABCHECKBOX = function(state, params) {
    state.tabCheckboxConfig = params;
}

module.exports = new Vuex.Store({
    state,
    mutations,
    actions,
    strict: true
})
