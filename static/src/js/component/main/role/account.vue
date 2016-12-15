<template>
	<div class="modal" id="modal_table" v-show="modal.show" transtion="fade">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" @click="modal.show=false">
						&times;
					</button>
					<h4 class="modal-title">{{modal.title}}</h4>
				</div>
				<div class="modal-body">
					<div class="col-lg-12">
						<div class="panel panel-default">
							<div class="panel-heading">
								<strong>帐号列表</strong>
							</div>
							<div class="panel-body">
								<div class="user_table_con">
									<table class="table table-bordered table-hover user_table">
										<thead>
											<tr>
                                    			<th style="text-align: center;">选择</th>
                                    			<th>序号</th>
												<th>ID</th>
												<th>姓名</th>
												<th>帐号名</th>
												<th>邮箱</th>
												<th>部门</th>
												<th>角色</th>
												<th>备注</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(i,item) in userListData" :class="{active: !item.status}">
				                                <td>
				                                    <input
				                                        type    = "checkbox"
				                                        name    = "checkedRecords"
				                                        class   = "ckbox"
				                                        value   = "{{item.id}}"
				                                        v-model = "checkedRecords"
				                                        @change = "checkedRecords_listener">
				                                </td>
				                                <td>{{i + baseIndex}}</td>
												<td>{{item.id}}</td>
												<td>{{item.name}}</td>
												<td>{{item.username}}</td>
												<td>{{item.email}}</td>
												<td>{{item.department}}</td>
												<td>
													{{item.role ? item.role : '无'}}
												</td>
												<td>
													{{item.remark ? item.remark : '无'}}
												</td>
											</tr>
										</tbody>

				                        <tfoot>
				                            <td colspan="20">
				                                <input
				                                    type        = "checkbox"
				                                    id          = "checkedall"
				                                    style       = "width: auto;margin-left: 15px;"
				                                    :checked    = "checkedAllRecords_status"
				                                    v-on:change = "checkedAllRecords_listener"> 全选/全不选
				                                <button
				                                    class    = "btn btn-success"
				                                    style    = "margin-left: 10px;"
				                                    type     = "button"
				                                    @click = "confirmConfig.show = true"
				                                    disabled = "{{ opBtnDisable }}">更新权限&amp;邮件</button>
				                                <button
				                                    class    = "btn btn-success"
				                                    style    = "margin-left: 15px;"
				                                    type     = "button"
				                                    @click = "updateLimited()"
				                                    disabled = "{{ opBtnDisable }}">更新权限</button>
				                            </td>
				                        </tfoot>
									</table>
								</div>
							</div>
							<div class="panel-footer">
								<m-pagination :pagination-conf="paginationConf"></m-pagination>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="confirm transition" transition="fade" v-show="confirmConfig.show">
			<div class="title">邮箱设置</div>
			<form class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-3 control-label">邮箱名称</label>
							<div class="col-sm-9">
								<input type="text" class="form-control" 
								placeholder="请输入邮箱名称" 
								v-model="confirmConfig.emailname">
							</div>
						</div>
						<div class="form-group">
							<label  class="col-sm-3 control-label">邮箱用户名</label>
							<div class="col-sm-9">
								<input type="text" class="form-control" maxlength="128" 
								placeholder="请输入邮箱用户名"
								v-model="confirmConfig.username">
							</div>
						</div>
						<div class="form-group">
							<label  class="col-sm-3 control-label">邮箱密码</label>
							<div class="col-sm-9">
								<input type="password" class="form-control"  maxlength="128" 
								placeholder="请输入邮箱密码"
								v-model="confirmConfig.password">
							</div>
						</div>
			</form>
			<div class="btn_con">
				<a href="javascript:void(0)" class="btn btn-default" @click="emailapply()">确认</a>
				<a href="javascript:void(0)" class="btn btn-default" @click="emailhide()">取消</a>
			</div>
		</div>
	</div>
</template>
<style scoped>
.confirm{
	width: 500px;
	background-color: rgba(255,255,255,1);
	position: fixed;
	left: 50%;
	top: 200px;
	border-radius: 4px;
	transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);z-index: 999999;box-shadow: 1px 1px 10px rgba(0,0,0,0.4);

}
.emalinput {
	width: 150px;
	display: inline-block;
}

.confirm .title {
	   text-align: center;
    font-size: 20px;
    margin-top: 10px;
}
.confirm form{
    margin-top: 20px;
    width: 90%;
}

.confirm .btn_con{
	font-size: 0;
	text-align: right;
	box-sizing: border-box;
	border-top: 2px solid #fff;
	padding: 10px 15px;
}
.confirm .btn_con a{
	display: inline-block;
	vertical-align: middle;
	margin: 0 5px;
}
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

.user_table {
	border-collapse: inherit;
	border: 1px solid #ddd;
}

.user_table>thead>tr>td, .user_table>thead>tr>th {
	border-bottom-width: 1px;
}

.user_table tfoot td{
	border-collapse: collapse;
	border: 0;
    border-top: 1px solid #ddd;
}


.user_table td, .user_table th {
	min-width: 50px;
}

.user_table td:nth-child(2),.user_table th:nth-child(2) {
	min-width: 45px;
}

.user_table td:nth-child(8),.user_table th:nth-child(8) {
	max-width: 150px;
}

.user_table thead th {
	text-align: center;
}

.user_table tbody td {
    position: relative;
    vertical-align: middle;
    padding: 5px;
    text-align: center;
}

.user_table td .btn {}

.user_table .ckbox {
    display: block;
    margin: 10px auto;
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

var Pagination = require('../../common/pagination.vue');


var store = require('../../../store/store.js');
var actions = require('../../../store/actions.js');

var Account = Vue.extend({
	name: 'Account',
	data: function(){
		return {
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 30,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: () => {
					this.createTableBySearchStr();
				}
			},
			userListData: [],
            checkedRecords: [],
            checkedAllRecords_status : false,
            opBtnDisable: true,
            confirmConfig: {
            	show: false,
            	emailname: allPageConfig.userInfo.email,
            	username: allPageConfig.userInfo.username,
            	password: ''
            },
			id: null,
			limited: {},
			exportLimit: {},
			modifyName: '',
			modifyRemark: '',
			modifyType: null,
			modifyLimited: {},
			modifyExportLimited: {}
		}
	},
	props: ['modal', 'loading'],
	components: {
		'm-pagination': Pagination
	},
	computed: {
		baseIndex: function () {
			return (this.paginationConf.currentPage - 1) * this.paginationConf.itemsPerPage + 1;
		}
	},
	watch: {
		'modal.show': {
			handler(val, oldval) {
				if (val) {
					this.createTableBySearchStr();
					this.checkedAllRecords_status = false;
					this.opBtnDisable = true;
					this.checkedRecords = [];
					
				}
			}
		}
	},
	methods: {
		createTableBySearchStr: function(){
			var _this = this;
			_this.loading.show = true;
			$.ajax({
				url: '/users/find',
				type: 'get',
				data: {
					limit: 10,
					page: _this.paginationConf.currentPage,
					username: _this.modal.rolename
				},
				success: function(data){
					_this.paginationConf.totalItems = data.count;
					_this.userListData = data.data;
					_this.loading.show = false;
				}
			})
		},
        checkedRecords_listener () {
            this.opBtnDisable          = this.checkedRecords.length > 0 ? false : true;
            this.checkedAllRecords_status = this.checkedRecords.length === this.userListData.length ? true : false;
        },
        checkedAllRecords_listener () {
            this.opBtnDisable          = this.checkedAllRecords_status;
            this.checkedAllRecords_status = !this.checkedAllRecords_status;
            $('.ckbox').prop('checked', this.checkedAllRecords_status);
            if(this.checkedAllRecords_status) {
                this.checkedRecords = this.userListData.map(function(item){
                    return item.id.toString();
                });
            } else {
                this.checkedRecords = [];
            }

        },
        updateLimited(email = false) {
        	let _this = this;
        	//比较权限
        	let rolelimited = _this.modal.limited ? Object.entries(JSON.parse(_this.modal.limited)) : [];
        	let updateTasks = [];
        	for(let userid of _this.checkedRecords) {
        		let useritem = _this.userListData.find(x => x.id.toString() === userid);

        		let userlimited = (useritem && useritem.limited) ? JSON.parse(useritem.limited) : {};
        		let ismodified = false;
	        	for (let limit of rolelimited) {
	        		let key = limit[0];
	        		let ul = userlimited[key] || [];
	        		let rl = limit[1];
	        		if ((ul.length === 0) || (ul && rl.some(x => !ul.includes(x)))) {
	        			// 合并&去重
	        			userlimited[key] = Array.from(new Set([...ul,...rl]));
	        			ismodified = true;
	        		}
	        	}
	        	if(ismodified) {
	        		let modifyLimited = JSON.stringify(userlimited);
	        		// console.log(`更新${useritem.name}权限为${modifyLimited}`);
	        		_this.loading.show = true;
	        		
	        		updateTasks.push(new Promise((resolve, reject) => {
			        	$.ajax({
							url: '/users/update',
							type: 'post',
							data: {
								id: useritem.id,
								limited: modifyLimited
							},
							success: function(data){
								if(!data.success){
									reject({
										name: useritem.name,
										msg: data.msg});
								}
								resolve(useritem);
							}
						});
	        		}));
	        	}
        	}
        	if (updateTasks.length > 0) {
        		Promise.all(updateTasks).then((items) => {
        			if (email) {
        				let host = window.location.host;
	        			let maildata = items.map((item) => {
	        				console.log(item);
	        				return {
								to: host.includes('gomeplus.com') ? item.email : 'lizhongning@gomeplus.com',
								subject: '权限修改通知',
								text: `${item.name}你好，\n    您的数据平台权限已修改，请查看${host}。`
	        				}
						});
						$.ajax({
							url: '/email/send',
							type: 'post',
							data: {
								mails: JSON.stringify(maildata),
								username: _this.confirmConfig.username,
								email: _this.confirmConfig.emailname,
								password: _this.confirmConfig.password
							},
							success: function(data){
								_this.loading.show = false;
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
									msg: '修改成功并已邮件通知',
									type: 'success'
								});
							}
						});
					} else {
						_this.loading.show = false;
						actions.alert(store, {
							show: true,
							msg: '修改成功',
							type: 'success'
						});
					}
					return true;
        		}).catch((errs) => {
        			let msg = '更新失败:' + errs.map(x => `${x.name}---${x.msg}`).join(';');
					actions.alert(store, {
						show: true,
						msg,
						type: 'danger'
					});
        		});
        	} else {
				actions.alert(store, {
					show: true,
					msg: '无需更新',
					type: 'success'
				});
        	}
        },
        emailapply() {
        	if (/^(.+)@gomeplus\.com$/.test(this.confirmConfig.emailname) && this.confirmConfig.username !== '' && this.confirmConfig.password !=='') {
        		this.updateLimited(true);
        		this.confirmConfig.show = false;
        	} else {
				actions.alert(store, {
					show: true,
					msg: '输入有误, 请核对邮箱信息',
					type: 'danger'
				});
        	}
        },
        emailhide() {
        	this.confirmConfig.show = false;
        }
	}
})

module.exports = Account;

</script>