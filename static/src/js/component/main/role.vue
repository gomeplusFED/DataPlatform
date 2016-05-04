<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<strong>角色列表</strong>
					<div class="add_role">
						<span class="fa fa-plus"></span>
						<input type="button" class="btn btn-default" value="增加角色">
					</div>
				</div>
				<div class="panel-body">
					<div class="user_table_con">
						<table class="table table-bordered table-hover user_table">
							<thead>
								<tr>
									<th>ID</th>
									<th>角色名称</th>
									<th>创建时间</th>
									<th>备注</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in roleListData">
									<td>{{item.id}}</td>
									<td>{{item.name}}</td>
									<td>{{item.date}}</td>
									<td>{{item.remark}}</td>
									<td>
										<ul>
											<li v-show="item.status"><a @click="modifyRole(item.id, item.limited, item.export)" class="btn btn-default" href="javascript:void(0)">修改<i class="fa fa-pencil-square-o"></i></a></li>
											<li v-show="item.status"><a class="btn btn-default" href="javascript:void(0)">禁用<i class="fa fa-remove"></i></a></li>
											<li v-show="!item.status"><a class="btn btn-default" href="javascript:void(0)">启用<i class="fa fa-check-square-o"></i></a></li>
										</ul>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="panel-footer">
					<m-pagination :pagination-conf="paginationConf"></m-pagination>
				</div>
			</div>
		</div>
	</div>
	<m-loading :loading.sync="loading"></m-loading>
	<m-alert></m-alert>
	<div class="modal" id="modal_table" v-show="modal.show" transtion="fade">
	    <div class="modal-dialog modal-lg">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h4 class="modal-title">{{modal.title}}</h4>
	            </div>
	            <div class="modal-body">
	            	<m-limit-list :id="id" :limited="limited" :export-limit="exportLimit"></m-limit-list>
	                <table class="table table-striped table-bordered table-hover">
	                	<thead>
	                		<tr>
	                			<th></th>
	                			<th>序号</th>
	                			<th>角色名称</th>
	                			<th>创建时间</th>
	                			<th>备注</th>
	                		</tr>
	                	</thead>
	                	<tbody>
	                		<!-- <tr v-for="item in userListData"> -->

	                		<!-- </tr> -->
	                	</tbody>
	                </table>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn default" data-dismiss="modal" @click="apply()">确定</button>
	                <button type="button" class="btn default" data-dismiss="modal" @click="modal.show = false">取消</button>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<style>
.add_role{
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	width: 120px;
}
.add_role span{
	position: absolute;
	top: 50%;
	left: 5px;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	z-index: 7;
	color: #666;
}
.add_role input{
	padding-left: 23px!important;
}
</style>

<script>
var Vue = require('Vue');

var $ = require('jQuery');

var Pagination = require('../common/pagination.vue');

var UserVm = null;

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var Loading = require('../common/loading.vue');
var Alert = require('../common/alert.vue');

var LimitList = require('../common/limitList.vue');

var Role = Vue.extend({
	name: 'Role',
	data: function(){
		return {
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 30,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {
					// 回调
					UserVm.createTableBySearchStr();
				}
			},
			roleListData: null,
			loading: {
				show: true,
                noLoaded: 0
			},
			modal: {
				show: false,
				title: '弹出层'
			},
			id: null,
			limited: null,
			exportLimit: null
		}
	},
	store: store,
	vuex: {
	    getters: {
	        alertConfig: function() {
	            return store.state.alertConfig;
	        }
	    },
	    actions: actions
	},
	components: {
		'm-pagination': Pagination,
		'm-loading': Loading,
		'm-alert': Alert,
		'm-limit-list': LimitList
	},
	created: function(){
		this.createTableBySearchStr();
	},
	methods: {
		createTableBySearchStr: function(){
			var _this = this;
			$.ajax({
				url: '/role/find',
				type: 'get',
				data: {
					limit: 10,
					page: _this.paginationConf.currentPage
				},
				success: function(data){
					_this.paginationConf.totalItems = data.count;
					_this.roleListData = data.data;
					_this.loading.show = false;
				}
			})
		},
		addRole: function(){

		},
		modifyRole: function(id, limited, exportLimit){
			this.id = id;
			this.exportLimit = eval('(' + exportLimit + ')');
			this.limited = eval('(' + limited + ')');
			this.modal.show = true;
			this.modal.title = '修改角色';
		},
		showModal: function(){

		}
	},
})

module.exports = Role;

</script>