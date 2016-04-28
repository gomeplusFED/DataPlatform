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
        data: null // 表格数据
    },
    currentPageDefaultData: null
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
    if(params.title){
        state.modalTableData.title = params.title;
    }
    if(params.data){
        state.modalTableData.data = params.data;
    }
    state.modalTableData.show = params.show;
}

mutations.HIDEMODALTABLE = function(state) {
    state.modalTableData.show = false;
}

mutations.SETCURRENTPAGEDEFAULTDATA = function(state, data) {
    state.currentPageDefaultData = data;
}

module.exports = new Vuex.Store({
    state,
    mutations,
    actions,
    strict: true
})
