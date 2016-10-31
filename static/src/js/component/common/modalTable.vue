<template>
	<div class="modal" id="modal_table" v-show="modalTableData.show" transtion="fade">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">{{modalTableData.title}}</h4>
				</div>
				<div class="modal-body">
					<m-toggle style="margin-bottom: 10px;" :show="type === 'toggle'" :page-components-data="pageComponentsData" component-type="toggle" :fun="toggle"></m-toggle>
					<table v-if="showType === 'table'" class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info">
						<thead>
							<tr>
								<th v-for="captionItem in modalTableData.data[0].cols">{{captionItem.caption}}</th>
							</tr>
						</thead>
						<tbody v-if="modalTableData.data[0].data.length !== 0">
							<tr v-for="tableBody in modalTableData.data[0].data">
								<td v-for="(tableKey, tableCell) in modalTableData.data[0].rows"><span @click="tableOperation(tableBody[tableCell], tableBody, modalTableData.data.rows[1])">{{{tableBody[tableCell]}}}</span></td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td :colspan="modalTableData.data[0].cols.length">暂无数据</td>
							</tr>
						</tbody>
					</table>

					<m-pagination v-if="showType === 'table'" :pagination-conf="paginationConf"></m-pagination>
					<m-chart v-show="showType === 'chart'" :default-data="{modelData: [modalTableData.data[1]]}" :index="-1" :result-argvs="resultArgvs" :init-data="initData" :page-components-data="pageComponentsData" :current-data="currentData" :loading.sync="loading"></m-chart>
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
var Chart = require('../main/chart.vue');
var Toggle = require('./toggle.vue');

var utils = require('utils');

var ModalTable = Vue.extend({
	name: 'ModalTable',
	data: function() {
		return {
			resultArgvs: {
				day_type: 1,
				endTime: "2016-10-27",
				filter_key: "value",
				key_type: "terminal_model",
				startTime: "2016-10-21"
			},
			initData: {},
			pageComponentsData: {},
			currentData: {
				query_api: "/terminal/modelOne",
				title: "TOP 10",
				type: ""
			},
			loading: {
				show: false
			},
			showType: 'table',
			type: '',
			paginationConf: {
				currentPage: 1, // 当前页
				totalItems: 0, // 总条数
				itemsPerPage: 10, // 每页条数
				pagesLength: 5, // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {

				}
			}
		};
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
		hideModal: function() {
			actions.hideModalTable(store);
			this.paginationConf.currentPage = 1;
		},
		toggle: function(val) {
			this.showType = val;
		}
	},
	ready: function() {
		var _this = this;
		this.paginationConf.onChange = function() {
			if (!_this.modalTableData.show) {
				return;
			}
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
						data: data.modelData[0],
						query_api: _this.modalTableData.query_api,
						query_parmas: _this.modalTableData.query_parmas
					});
					_this.paginationConf.totalItems = data.modelData[0].count || 0;
				}
			});
		};
	},
	components: {
		'm-pagination': Pagination,
		'm-chart': Chart,
		'm-toggle': Toggle
	},
	watch: {
		'modalTableData.show': {
			handler: function(val) {
				if (val) {
					$('body').css('overflow', 'hidden');
				} else {
					$('body').css('overflow', 'auto');
				}
			}
		},
		'modalTableData.data': {
			handler: function(val) {
				if (val) {
					if (val.length > 1 && val[0].count ) {
						if (val[1].type) {
							this.type = 'toggle';
						}
						this.showType = 'table';
						this.paginationConf.totalItems = this.modalTableData.data[0].count ? this.modalTableData.data[0].count : 0;
					} else {
						this.type = '';
						this.showType = 'chart';
					}
					
					this.resultArgvs.day_type = 2;
				}
			}
		},
		'showType': {
			handler: function(val) {
				this.currentData.type = val;
				if (val === 'chart') {
					this.resultArgvs.day_type++;
				}
			}
		}
	}
});

module.exports = ModalTable;
</script>
