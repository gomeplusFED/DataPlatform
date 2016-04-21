<template>
	<div class="modal" id="modal_table" v-show="modalTableData.show" transtion="fade">
	    <div class="modal-dialog modal-lg">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h4 class="modal-title">帮助信息</h4>
	            </div>
	            <div class="modal-body">
	                <table class="table table-striped table-bordered table-hover"></table>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn default" data-dismiss="modal" @click="hideModal()">确定</button>
	            </div>
	        </div>
	    </div>
	</div>
</template>



<script>

var Vue = require('Vue');

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var ModalTable = Vue.extend({
	name: 'ModalTable',
	data: function(){
		return {

		}
	},
	vuex: {
	    getters: {
	        modalTableData: function() {
	            return store.state.modalTableData;
	        }
	    },
	    actions: actions
	},
	methods: {
		hideModal: function(){
			actions.hideModalTable(store);
		}
	},
	watch: {
		'modalTableData.data': {
			handler: function(data){
				$('#modal_table .modal-body').html('<table class="table table-striped table-bordered table-hover"></table>');
				$('#modal_table table').DataTable(data);
			},
			deep: true
		}
	}
})

module.exports = ModalTable;

</script>