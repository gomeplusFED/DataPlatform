<template>
	<div class="modal" id="modal_table" v-show="modalTableData.show" transtion="fade">
	    <div class="modal-dialog modal-lg">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h4 class="modal-title">{{modalTableData.title}}</h4>
	            </div>
	            <div class="modal-body">
					<table class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info">
					    <thead>
					        <tr>
					            <th v-for="captionItem in modalTableData.data.cols">{{captionItem.caption}}</th>
					        </tr>
					    </thead>
					    <tbody v-if="modalTableData.data.data.length !== 0">
					        <tr v-for="tableBody in modalTableData.data.data">
					            <td v-for="(tableKey, tableCell) in modalTableData.data.rows"><span @click="tableOperation(tableBody[tableCell], tableBody, modalTableData.data.rows[1])">{{{tableBody[tableCell]}}}</span></td>
					        </tr>
					    </tbody>
					    <tbody v-else>
					        <tr>
					            <td :colspan="modalTableData.data.cols.length">暂无数据</td>
					        </tr>
					    </tbody>
					</table>
					<m-pagination :pagination-conf="paginationConf"></m-pagination>
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
var $ = require('jQuery');

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var Pagination = require('../common/pagination.vue');

var utils = require('utils');

var ModalTable = Vue.extend({
	name: 'ModalTable',
	data: function(){
		return {
			paginationConf: {
			    currentPage: 1,     // 当前页
			    totalItems: 20,     // 总条数
			    itemsPerPage: 10,    // 每页条数
			    pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
			    onChange: function() {

			    }
			}
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
	ready: function(){
		var _this = this;
		this.paginationConf.onChange = function(){
			var resultPrams = _this.modalTableData.query_parmas;

			utils.mixin(resultPrams, {
			    limit: _this.paginationConf.itemsPerPage,
			    page: _this.paginationConf.currentPage
			});

			$.ajax({
			    url: _this.modalTableData.query_api,
			    type: 'get',
			    data: resultPrams,
			    success: function(data) {
			    	actions.modalTable(store, {
			    	    show: true,
			    	    title: '帮助信息',
			    	    data: data.modelData,
			    	    query_api: _this.modalTableData.query_api,
			    	    query_parmas: _this.modalTableData.query_parmas
			    	});
			    	_this.paginationConf.totalItems = data.modelData[0].count || 0;
			    }
			})
		}
	},
	components: {
		'm-pagination': Pagination
	},
	watch: {
		'modalTableData.show': {
			handler: function(val){
				if(val){
					$('body').css('overflow', 'hidden');
				}else{
					$('body').css('overflow', 'auto');
				}
			}
		}
	}
})

module.exports = ModalTable;

</script>