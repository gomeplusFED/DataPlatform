var Vue = require('Vue');
var Vuex = require('Vuex');

Vue.use(Vuex);



var state = {
    alertConfig: {
        show: false,
        msg: '提示信息',
        type: 'info'
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

module.exports = new Vuex.Store({
    state,
    mutations,
    actions,
    strict: true
})
