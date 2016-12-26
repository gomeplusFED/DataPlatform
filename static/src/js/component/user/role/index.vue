<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<strong>角色列表</strong>
					<div class="add_role">
						<span class="fa fa-plus"></span>
						<input type="button" class="btn btn-default" value="新增角色" @click="addRole()">
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
								<tr v-for="item in roleListData" :class="{active: !item.status}">
									<td>{{item.id}}</td>
									<td>{{item.name}}</td>
									<td>{{item.date | Date 'yyyy-MM-dd hh:mm:ss'}}</td>
									<td>{{item.remark}}</td>
									<td style="width: 270px">
										<ul>
											<li v-show="item.status"><a @click="modifyRole(item.id, item.limited, item.export, item.name, item.remark, item.sub_pages)" class="btn btn-default" href="javascript:void(0)">修改<i class="fa fa-pencil-square-o"></i></a></li>
											<li v-show="item.status"><a @click="forbidden(item.id, item.name)" class="btn btn-default" href="javascript:void(0)">禁用<i class="fa fa-remove"></i></a></li>
											<li v-show="!item.status"><a @click="startUsing(item.id, item.name)" class="btn btn-default" href="javascript:void(0)">启用<i class="fa fa-check-square-o"></i></a></li>
											<li v-show="item.status"><a @click="modifyUser(item.name, item.limited, item.export, item.sub_pages)" class="btn btn-default" href="javascript:void(0)">更新账户<i class="fa fa-pencil-square-o"></i></a></li>
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
					<form class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label" for="juese_name">角色名称</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="juese_name" placeholder="请输入角色名称" v-model="modifyName">
							</div>
						</div>
						<div class="form-group">
							<label for="juese_remark" class="col-sm-2 control-label">角色备注</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="juese_remark" maxlength="128" placeholder="请输入角色备注" v-model="modifyRemark">
								<span>{{modifyRemark | length}}/128</span>
							</div>
						</div>
					</form>
	            	<m-limit-list v-ref:limitlist :id="id" :limited="limited" :sub-pages="subPages" :type="type" :export-limit="exportLimit"></m-limit-list>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn default" data-dismiss="modal" @click="apply()">确定</button>
	                <button type="button" class="btn default" data-dismiss="modal" @click="hideModal()">取消</button>
	            </div>
	        </div>
	    </div>
	</div>
	<m-account :modal.sync="account" :loading.sync="loading"></m-account>
	<m-confirm></m-confirm>
</template>

<style scoped>
.user_table ul>li{
	display: inline-block;
}
.user_table td, .user_table th {
	min-width: 120px;
}
.user_table td:nth-child(1),.user_table th:nth-child(1) {
	max-width: 40px;
}
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

var Pagination = require('../../common/pagination.vue');

var store = require('store');
var actions = require('actions');

var Loading = require('common/loading.vue');
var Alert = require('common/alert.vue');

var LimitList = require('common/limitList.vue');

var Confirm = require('common/confirm.vue');

var Account = require('./updateAccount.vue');


var Role = Vue.extend({
	name: 'Role',
	data: function(){
		return {
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 30,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: () => {
					// 回调
					this.createTableBySearchStr();
				}
			},
			roleListData: null,
			account: {
				show: false,
				title: '更新账户',
				rolename: null,
				limited: null,
				exportLimit: null,
				subPages: null
			},
			loading: {
				show: true,
                noLoaded: 0
			},
			modal: {
				show: false,
				title: '弹出层'
			},
			id: null,
			limited: {},
			subPages: {},
			type: {},
			exportLimit: {},
			modifyName: '',
			modifyRemark: '',
			modifyType: null,
			modifyLimited: {},
			modifySubPages: {},
			modifyExportLimited: {}
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
		'm-limit-list': LimitList,
		'm-confirm': Confirm,
		'm-account': Account
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
			this.exportLimit = {};
			this.limited = {};
			this.subPages = {};
			this.modal.show = true;
			this.modal.title = '新增角色';
			this.modifyRemark = '';
			this.modifyName = '';
			this.modifyType = 'add';
		},
		modifyRole: function(id, limited, exportLimit, name, remark, subPages){
			this.id = id;
			this.exportLimit = JSON.parse(exportLimit);
			this.limited = JSON.parse(limited);
			this.subPages = JSON.parse(subPages || '{}');
			this.modal.show = true;
			this.modal.title = '修改角色';
			this.modifyRemark = remark;
			this.modifyName = name;
			this.modifyType = 'modify';
		},
		modifyUser(name, limited, exportLimit, subPages) {
			this.account.rolename = name;
			this.account.exportLimit = exportLimit;
			this.account.limited = limited;
			this.account.subPages = subPages;
			this.account.show = true;
		},
		apply: function(){
			var _this = this;
			if(_this.modifyName === '' || _this.modifyRemark === ''){
				actions.alert(store, {
					show: true,
					msg: '角色名或备注不能为空',
					type: 'danger'
				})
				return;
			}
			for(var item in _this.modifyLimited){
				if(_this.modifyLimited[item].length === 0){
					Vue.delete(_this.modifyLimited, item);
					Vue.delete(_this.modifySubPages, item);
				}
			}
			for(var item in _this.modifyExportLimited){
				if(_this.modifyExportLimited[item].length === 0){
					Vue.delete(_this.modifyExportLimited, item);
				}
			}

			// 平台权限
			let limitlist = this.$refs.limitlist;
			let config = {}
			function parseObject(obj) {
				for (let key of Object.keys(obj)) {
						let item = obj[key]
						if (typeof item === 'object') {
							parseObject(item)
						} else if (key && key !== 'undefined' && item && item !== 'undefined') {
							config[key] = item
						}
					}
			}
			
			if (limitlist.platformPermission3) {
				parseObject(limitlist.platformPermission3)
			}
			// 相同页面的情况下，二级目录覆盖三级目录
			if (limitlist.platformPermission2) {
				parseObject(limitlist.platformPermission2)
			}

			if(this.modifyType === 'modify'){

				$.ajax({
					url: '/role/update',
					type: 'post',
					data: {
						id: _this.id,
						name: _this.modifyName,
						remark: _this.modifyRemark,
						limited: JSON.stringify(_this.modifyLimited),
						sub_pages: JSON.stringify(_this.modifySubPages),
						export: JSON.stringify(_this.modifyExportLimited),
						type: JSON.stringify(config)
					},
					success: function(data){
						if(!data.success){
							actions.alert(store, {
								show: true,
								msg: data.msg,
								type: 'danger'
							})
							return;
						}
						actions.alert(store, {
							show: true,
							msg: '修改成功',
							type: 'success'
						})
						_this.createTableBySearchStr();
						_this.modal.show = false;
					}
				})
			}else if(this.modifyType === 'add'){
				$.ajax({
					url: '/role/add',
					type: 'post',
					data: {
						name: _this.modifyName,
						remark: _this.modifyRemark,
						limited: JSON.stringify(_this.modifyLimited),
						sub_pages: JSON.stringify(_this.modifySubPages),
						export: JSON.stringify(_this.modifyExportLimited),
						type: JSON.stringify(config)
					},
					success: function(data){
						if(!data.success){
							actions.alert(store, {
								show: true,
								msg: data.msg,
								type: 'danger'
							})
							return;
						}
						actions.alert(store, {
							show: true,
							msg: '新增成功',
							type: 'success'
						})
						_this.createTableBySearchStr();
						_this.modal.show = false;
					}
				})
			}
		},
		forbidden: function(id, name){
			var _this = this;
			actions.confirm(store, {
				show: true,
				msg: '是否禁用角色 ' + name + '？',
				apply: function(){
					$.ajax({
						url: '/role/update',
						type: 'post',
						data: {
							id: id,
							status: 0
						},
						success: function(data){
							actions.alert(store, {
								show: true,
								msg: '禁用成功',
								type: 'success'
							})
							_this.createTableBySearchStr();
							_this.modal.show = false;
						}
					})
				}
			})
		},
		startUsing: function(id, name){
			var _this = this;
			actions.confirm(store, {
				show: true,
				msg: '是否启用角色 ' + name + '？',
				apply: function(){
					$.ajax({
						url: '/role/update',
						type: 'post',
						data: {
							id: id,
							status: 1
						},
						success: function(data){
							actions.alert(store, {
								show: true,
								msg: '启用成功',
								type: 'success'
							})
							_this.createTableBySearchStr();
							_this.modal.show = false;
						}
					})
				}
			})
		},
		hideModal: function(){
			// 隐藏弹窗，初始化数据
			this.modal.show = false;
			this.id = null;
			this.limited = {};
			this.subPages = {};
			this.exportLimit = {};
			this.modifyName = '';
			this.modifyRemark = '';
			this.modifyType = null;
			this.modifyLimited = {};
			this.modifyExportLimited = {};
		}
	},
	events: {
		borcastLimit: function(limit){
			this.modifyLimited = limit
		},
		borcastSubPages: function(subPages) {
			this.modifySubPages = subPages;
		},
		borcastExportLimit: function(limit){
			this.modifyExportLimited = limit;
		}
	}
})

module.exports = Role;

</script>