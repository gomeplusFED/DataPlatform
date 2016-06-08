var actions = {};

actions.alert = function(store, params) {
    store.dispatch('ALERT', params);
    setTimeout(function() {
        store.dispatch('HIDEALERT');
    }, 2500);
}

actions.modalTable = function(store, params) {
    store.dispatch('MODALTABLE', params);
}

actions.hideModalTable = function(store) {
    store.dispatch('HIDEMODALTABLE');
}

actions.setCurrentPageDefaultData = function(store, data) {
    store.dispatch('SETCURRENTPAGEDEFAULTDATA', data);
}

actions.confirm = function(store, params) {
	store.dispatch('CONFIRM', params);
}

actions.exportConfirm = function(store, params) {
	store.dispatch('EXPORTCONFIRM', params);
}

module.exports = actions;
