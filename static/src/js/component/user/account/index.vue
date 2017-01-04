<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<strong>帐号列表</strong>
					<div class="search">
						<span class="fa fa-search"></span>
						<input style="width: 250px;" type="text" class="form-control" placeholder="输入帐号查询" v-model="searchStr" debounce="500">
					</div>
				</div>
				<div class="panel-body">
					<div class="user_table_con">
						<table class="table table-bordered table-hover user_table">
							<thead>
								<tr>
									<th>ID</th>
									<th>姓名</th>
									<th>帐号名</th>
									<th>邮箱</th>
									<th>部门</th>
									<th>角色</th>
									<th>备注</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in userListData" :class="{active: !item.status}">
									<td>{{item.id}}</td>
									<td>{{item.name}}</td>
									<td>{{item.username}}</td>
									<td>{{item.email}}</td>
									<td>{{item.department}}</td>
									<td style="min-width: 300px;">
										<span style="padding-right: 100px;">{{item.role ? item.role : '无'}}</span>
										<a v-show="item.status" @click="showRoleList(item.role, item.id, item.limited, item.export, $index)" href="javascript:;" class="btn btn-default" data-role="0">修改<i class="fa fa-pencil-square-o"></i></a>
									</td>
									<td style="min-width: 350px;">
										<span style="padding-right: 100px;">{{item.remark ? item.remark : '无'}}</span>
										<form v-show="item.status" class="form-inline remark" @submit.prevent="editRemark(item.id,item.remark)">
											<input type="text" maxlength="20" class="form-control" id="remark" v-model="item.remark">
											<span v-show="showRemarkLen" style="font-size: 12px;">{{item.remark | length}}/20</span>
											<a @click="showRemark($event, item.id, item.remark)" href="javascript:void(0);" class="btn btn-default">修改<i class="fa fa-pencil-square-o"></i></a>
										</form>
									</td>
									<td>
										<ul>
											<li v-show="item.status"><a @click="showLimitList(item.id, item.limited, item.export, item.sub_pages, item.type)" class="btn btn-default" href="javascript:void(0)">权限修改<i class="fa fa-pencil-square-o"></i></a></li>
											<li v-show="item.status"><a @click="forbidden(item.id, item.email)" class="btn btn-default" href="javascript:void(0)">禁用<i class="fa fa-ban"></i></a></li>
											<li v-show="!item.status"><a @click="startUsing(item.id, item.email)" class="btn btn-default" href="javascript:void(0)">启用<i class="fa fa-check-square-o"></i></a></li>
											<li><a @click="deleteUser(item.id, item.email)" class="btn btn-danger" href="javascript:void(0)">删除<i class="fa fa-trash"></i></a></li>
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
					<table v-if="modal.type === 'roleList'" class="table table-striped table-bordered table-hover">
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
							<tr v-for="item in roleList">
								<th><span><input type="checkbox" :value="item.name" v-model="item.checked"></input></span></th>
								<th><span>{{item.id}}</span></th>
								<th><span>{{item.name}}</span></th>
								<th><span>{{item.date | Date 'yyyy-MM-dd hh:mm:ss'}}</span></th>
								<th><span>{{item.remark}}</span></th>
							</tr>
						</tbody>
					</table>
					<m-limit-list v-ref:limitlist v-show="modal.type === 'limitList'" :id="id" :limited="limited" :sub-pages="subPages" :type="type" :export-limit="exportLimit"></m-limit-list>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal" @click="apply()">确定</button>
					<button type="button" class="btn default" data-dismiss="modal" @click="modal.show = false">取消</button>
				</div>
			</div>
		</div>
	</div>
	<m-confirm></m-confirm>
</template>
<style scoped>
.search {
	position: absolute;
	right: 20px;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	width: 250px;
}

.search span {
	position: absolute;
	position: absolute;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	z-index: 7;
}

.fa {
	margin-left: 3px;
}

.user_table_con {
	width: 100%;
	overflow-x: auto;
}

.user_table {}

.user_table td {
	min-width: 120px;
}

.user_table td:nth-child(5) {
	min-width: 180px;
}

.user_table th {
	min-width: 120px;
}

.user_table td {
	position: relative;
	line-height: 34px!important;
}

.user_table td .btn {}

.user_table td>a {
	display: inline-block;
	vertical-align: middle;
	right: 8px;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
}

.user_table td ul {
	font-size: 0;
	text-align: center;
	width: 300px;
	margin: 0 auto;
}

.user_table td ul li {
	display: inline-block;
	vertical-align: middle;
	margin: 0 4px;
	font-size: 14px;
}

.user_table td .remark {
	display: inline-block;
	vertical-align: middle;
	position: absolute;
	right: 8px;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
}

.user_table td .remark input {
	display: none;
	margin-right: 5px;
}

.user_table td i {
	display: inline-block;
	vertical-align: middle;
	width: 22px;
}
</style>
<script>
var Vue = require('Vue');

var $ = require('jQuery');

var Pagination = require('common/pagination.vue');

var UserVm = null;

var store = require('store');
var actions = require('actions');

var Loading = require('common/loading.vue');
var Alert = require('common/alert.vue');
var ModalTable = require('common/modalTable.vue');
var Confirm = require('common/confirm.vue');

var LimitList = require('common/limitList.vue');

var utils = require('utils');

// fileter
require('filter');

var User = Vue.extend({
	name: 'User',
	data: function() {
		return {
			paginationConf: {
				currentPage: 1, // 当前页
				totalItems: 0, // 总条数
				itemsPerPage: 10, // 每页条数
				pagesLength: 5, // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {
					// 回调
					UserVm.createTableBySearchStr();
				}
			},
			searchStr: '',
			userListData: null,
			loading: {
				show: true,
				noLoaded: 0
			},
			modal: {
				show: false,
				title: '弹出层',
				type: 'roleList'
			},
			id: null,
			limited: {},
			subPages: {},
			type: {},
			exportLimit: {},
			roleList: [],
			currentID: null,
			currentCheckRoleName: null,
			currentUserRoleName: null,
			// curretnLimited: null,
			// currentExportLimited: null,
			modifyLimited: {},
			modifySubPages: {},
			modifyExportLimited: {},
			showRemarkLen: false
		};
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
		'm-confirm': Confirm
	},
	init: function() {
		UserVm = this;
	},
	created: function() {
		this.createTableBySearchStr();
	},
	methods: {
		showRemark: function(ev, id, remark) {
			var _this = this;
			$(document).bind('click', function(ev) {
				var obj = $(ev.target);
				if (obj.parents('.remark').length === 0) {
					$('.remark').find('input').css('display', 'none');
					_this.showRemarkLen = false;
				}
			});

			if ($(ev.target).parents('.remark').find('input').css('display') === 'inline-block') {
				$(ev.target).parents('.remark').find('input').css('display', 'none');
				this.showRemarkLen = false;
				this.editRemark(id, remark);
			} else {
				$(ev.target).parents('.remark').find('input').css('display', 'inline-block');
				this.showRemarkLen = true;
			}
		},
		editRemark: function(id, remark) {
			var _this = this;
			$.ajax({
				url: '/users/update',
				type: 'post',
				data: {
					id: id,
					remark: remark
				},
				success: function(data) {
					if (!data.success) {
						actions.alert(store, {
							show: true,
							msg: data.msg,
							type: 'danger'
						});
						return;
					}
					actions.alert(store, {
						show: true,
						msg: '修改成功',
						type: 'success'
					});
					$('.remark').find('input').css('display', 'none');
				}
			});
		},
		createTableBySearchStr: function() {
			var search = this.searchStr;
			var _this = this;
			$.ajax({
				url: '/users/find',
				type: 'get',
				data: {
					username: search,
					limit: 10,
					page: _this.paginationConf.currentPage
				},
				success: function(data) {
					// mock data 
					// for (let p of data.data) {
					// 	p.sub_pages = JSON.stringify({"0": {"1": ["test1","test2"]}, "3": {"1": ["test1"]}});
					// }
					// console.log(JSON.stringify(data,null,4));
					_this.paginationConf.totalItems = data.count;
					_this.userListData = data.data;
					_this.loading.show = false;
				}
			});
		},
		showRoleList: function(role, id, limited, exportLimited, index) {
			var _this = this;
			_this.modal.show = true;
			_this.modal.title = '修改角色';
			_this.modal.type = 'roleList';
			_this.currentUserRoleName = role;
			_this.currentID = id;
			// _this.curretnLimited = limited;
			// _this.currentExportLimited = exportLimited;
			$.ajax({
				url: '/role/find',
				type: 'get',
				data: {
					status: 1
				},
				success: function(data) {
					_this.roleList = data.data;
					var currentUserRoleNameArr = _this.currentUserRoleName ? _this.currentUserRoleName.split(';') : [];
					for (var item in _this.roleList) {
						Vue.set(_this.roleList[item], 'checked', false);
						if (currentUserRoleNameArr.filter(function(v, index) {
								return _this.roleList[item].name === v;
							}).length > 0) {
							Vue.set(_this.roleList[item], 'checked', true);
						}
					}
					_this.limited = JSON.parse(_this.userListData[index].limited);
					_this.subPages = JSON.parse(_this.userListData[index].sub_pages || '{}');
					_this.exportLimit = JSON.parse(_this.userListData[index].export);
					_this.type = JSON.parse(_this.userListData[index].type || '{}');
				}
			});
		},
		showLimitList: function(id, limited, exportLimit, subPages, type) {
			var _this = this;
			_this.currentID = id;
			_this.modal.show = true;
			_this.modal.title = '修改权限';
			_this.modal.type = 'limitList';
			_this.id = id;
			_this.exportLimit = JSON.parse(exportLimit);
			_this.limited = JSON.parse(limited);
			_this.subPages = JSON.parse(subPages);
			_this.type = JSON.parse(type || '{}');
		},
		apply: function() {
			var _this = this;
			if (this.modal.type === 'roleList') {
				var currentUserRoleNameArr = _this.currentUserRoleName ? _this.currentUserRoleName.split(';') : [];

				var resultLimited = utils.mixin(_this.limited, {});
				var resultSubPages = utils.mixin(_this.subPages, {});
				var resultExportLimited = utils.mixin(_this.exportLimit, {});

				for (var item in _this.roleList) {
					if (_this.roleList[item]['checked'] && !utils.isInArry(_this.roleList[item]['name'], currentUserRoleNameArr)) {
						let roleObj = _this.roleList[item];
						let obj1 = roleObj['limited'] ? JSON.parse(roleObj['limited']) : {};
						let roleSubPages = roleObj['sub_pages'] ? JSON.parse(roleObj['sub_pages']) : {};
						for (let k in obj1) {
							if (!resultLimited[k]) {
								resultLimited[k] = obj1[k];
							}
							let _currentArr = resultLimited[k].concat(obj1[k]);
							resultLimited[k] = utils.uniqueArray(_currentArr);
							resultLimited[k].sort(function(a, b) {
								return a - b;
							});
							// 处理三级页面
							let roleSubs = roleSubPages[k];
							let userSubs = resultSubPages[k];
							let limiteds = resultLimited[k];
							if (!userSubs) {
								resultSubPages[k] = roleSubs;
							} else {
								for(let l of limiteds) {
									let _current = userSubs[l].concat(roleSubs[l]);
									userSubs[l] = utils.uniqueArray(_current);
								}
							}

						}

						var obj2 = JSON.parse(_this.roleList[item]['export']);
						for (let k in obj2) {
							if (!resultExportLimited[k]) {
								resultExportLimited[k] = obj2[k];
							}
							let _currentArr = resultExportLimited[k].concat(obj2[k]);
							resultExportLimited[k] = utils.uniqueArray(_currentArr);
							resultExportLimited[k].sort(function(a, b) {
								return a - b;
							});
						}
					}
				}

				var roleName = [];
				for (let item in _this.roleList) {
					if (_this.roleList[item]['checked']) {
						roleName.push(_this.roleList[item].name);
					}
				}

				for (let item in resultLimited) {
					if (resultLimited[item] === undefined || resultLimited[item].length === 0) {
						delete resultLimited[item];
						delete resultSubPages[item];
					}
				}

				for (let item in resultExportLimited) {
					if (resultExportLimited[item] === undefined || resultExportLimited[item].length === 0) {
						delete resultExportLimited[item];
					}
				}

				// 平台权限合并
				let roleCheckedList = _this.roleList.filter(r => r.checked)
				if (roleCheckedList) {
					roleCheckedList.forEach(x => {
						let roleType = JSON.parse(x.type || '{}')
						for(let key in roleType) {
							if (roleType[key] !== '00000') {
								let arrRole =  roleType[key].split('').filter(x => x === '1')
								let arrTemp = (_this.type[key] || '00000').split('')
								roleType[key].split('').forEach((x, index) => {
									if (x === '1') {
										arrTemp[index] = '1'
									}
								})
								_this.$set(`type[${key}]`, arrTemp.join(''))
							}
						}
					})
				}

				$.ajax({
					url: '/users/update',
					type: 'post',
					data: {
						id: _this.currentID,
						limited: JSON.stringify(resultLimited),
						sub_pages: JSON.stringify(resultSubPages),
						export: JSON.stringify(resultExportLimited),
						role: roleName.join(';'),
						type: JSON.stringify(_this.type)
					},
					success: function(data) {
						if (!data.success) {
							actions.alert(store, {
								show: true,
								msg: data.msg,
								type: 'danger'
							});
							return;
						}
						actions.alert(store, {
							show: true,
							msg: '修改成功',
							type: 'success'
						});
						_this.modal.show = false;
						_this.createTableBySearchStr();
					}
				});
			} else if (this.modal.type === 'limitList') {
				let _this = this;
				for (let item in _this.modifyLimited) {
					if (_this.modifyLimited[item] === undefined || _this.modifyLimited[item].length === 0) {
						delete _this.modifyLimited[item];
						delete _this.modifySubPages[item];
					}
				}

				for (let item in _this.modifyExportLimited) {
					if (_this.modifyExportLimited[item] === undefined || _this.modifyExportLimited[item].length === 0) {
						delete _this.modifyExportLimited[item];
					}
				}
				
				// 平台权限
				let limitlist = this.$refs.limitlist
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
				_this.$set('type', config)

				$.ajax({
					url: '/users/update',
					type: 'post',
					data: {
						id: _this.currentID,
						limited: JSON.stringify(_this.modifyLimited),
						sub_pages: JSON.stringify(_this.modifySubPages),
						export: JSON.stringify(_this.modifyExportLimited),
						type: JSON.stringify(_this.type)
					},
					success: function(data) {
						if (!data.success) {
							actions.alert(store, {
								show: true,
								msg: data.msg,
								type: 'danger'
							});
							return;
						}
						actions.alert(store, {
							show: true,
							msg: '修改成功',
							type: 'success'
						});
						_this.modal.show = false;
						_this.createTableBySearchStr();
					}
				});
			}
		},
		forbidden: function(id, email) {
			var _this = this;
			actions.confirm(store, {
				show: true,
				msg: '是否禁用账户 ' + email + '？',
				apply: function() {
					$.ajax({
						url: '/users/update',
						type: 'post',
						data: {
							id: id,
							status: 0
						},
						success: function(data) {
							if (!data.success) {
								actions.alert(store, {
									show: true,
									msg: data.msg,
									type: 'danger'
								});
								return;
							}
							actions.alert(store, {
								show: true,
								msg: '禁用成功',
								type: 'success'
							});
							_this.createTableBySearchStr();
							_this.modal.show = false;
						}
					});
				}
			});
		},
		startUsing: function(id, email) {
			var _this = this;
			actions.confirm(store, {
				show: true,
				msg: '是否启用账户 ' + email + '？',
				apply: function() {
					$.ajax({
						url: '/users/update',
						type: 'post',
						data: {
							id: id,
							status: 1
						},
						success: function(data) {
							if (!data.success) {
								actions.alert(store, {
									show: true,
									msg: data.msg,
									type: 'danger'
								});
								return;
							}
							actions.alert(store, {
								show: true,
								msg: '启用成功',
								type: 'success'
							});
							_this.createTableBySearchStr();
							_this.modal.show = false;
						}
					});
				}
			});
		},
		deleteUser: function(id, email) {
			var _this = this;
			actions.confirm(store, {
				show: true,
				msg: '是否删除账户 ' + email + '？',
				apply: function() {
					$.ajax({
						url: '/users/delete?id=' + id,
						type: 'get',
						success: function(data) {
							if (!data.success) {
								actions.alert(store, {
									show: true,
									msg: data.msg,
									type: 'danger'
								});
								return;
							}
							actions.alert(store, {
								show: true,
								msg: '删除成功',
								type: 'success'
							});
							_this.createTableBySearchStr();
							_this.modal.show = false;
						}
					});
				}
			});
		},
	},
	watch: {
		searchStr: {
			handler: function(val) {
				this.createTableBySearchStr();
			}
		}
	},
	events: {
		borcastLimit: function(limit) {
			this.modifyLimited = limit;
		},
		borcastSubPages: function(subPages) {
			this.modifySubPages = subPages;
		},
		borcastExportLimit: function(limit) {
			this.modifyExportLimited = limit;
		}
	}
});

module.exports = User;
</script>
