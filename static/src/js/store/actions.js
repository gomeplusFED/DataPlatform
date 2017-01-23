var actions = {};

actions.alert = function(store, params) {
    store.dispatch('ALERT', params);
    setTimeout(function() {
        store.dispatch('HIDEALERT');
    }, 2500);
}

<<<<<<< .merge_file_t6ktLC
=======
actions.databp = function(store, params) {
    store.dispatch('DATABP', params);
}

>>>>>>> .merge_file_mwt8uk
actions.modalTable = function(store, params) {
    store.dispatch('MODALTABLE', params);
}

actions.hideModalTable = function(store) {
    store.dispatch('HIDEMODALTABLE');
}

actions.setCurrentPageDefaultData = function(store, data) {
    store.dispatch('SETCURRENTPAGEDEFAULTDATA', data);
}

actions.updateCurrentPageDefaultData = function(store, query_api, type) {
    store.dispatch('UPDATECURRENTPAGEDEFAULTDATA', query_api, type);
}

actions.confirm = function(store, params) {
	store.dispatch('CONFIRM', params);
}

actions.exportConfirm = function(store, params) {
	store.dispatch('EXPORTCONFIRM', params);
}

actions.tabCheckbox = function(store, params) {
	store.dispatch('TABCHECKBOX', params);
}

module.exports = actions;
