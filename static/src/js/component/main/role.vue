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
								<tr v-for="item in userListData">
									<td>{{item.id}}</td>
									<td>{{item.name}}</td>
									<td>{{item.username}}</td>
									<td>{{item.email}}</td>
									<td>{{item.department}}</td>
									<td>
										<span style="width: 160px;display: inline-block;">{{item.role === null ? '无' : item.role}}</span>
										<a href="javascript:;" class="btn btn-default" data-role="0">修改<i class="fa fa-pencil-square-o"></i></a>
									</td>
									<td style="width: 300px;">
										<span style="width: 300px;display: inline-block;">{{item.remark === null ? '无' : item.remark}}</span>
										<form class="form-inline remark" @submit.prevent="editRemark(item.id,item.remark)">
											<input type="text" class="form-control" id="remark" v-model="item.remark">
											<a @click="showRemark($event,item.id,item.remark)" href="javascript:void(0);" class="btn btn-default">修改<i class="fa fa-pencil-square-o"></i></a>
										</form>
									</td>
									<td>
										<ul>
											<li v-show="item.status"><a class="btn btn-default" href="javascript:void(0)">权限修改<i class="fa fa-pencil-square-o"></i></a></li>
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