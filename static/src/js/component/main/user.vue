<template>
	<div class="row">
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
								<tr>
									<td>0001</td>
									<td>骆也</td>
									<td>luoye</td>
									<td>luoye@gomeplus.com</td>
									<td>美信技术部</td>
									<td width="200">
										<span>研发</span>
										<a href="javascript:;" class="btn btn-default" data-role="0">修改<i class="fa fa-pencil-square-o"></i></a>
									</td>
									<td width="300">
										<span>备注信息</span>
										<form class="form-inline remark" @submit.prevent="editRemark()">
											<a @click="showRemark($event)" href="javascript:void(0);" class="btn btn-default">修改<i class="fa fa-pencil-square-o"></i></a>
											<input type="text" class="form-control" id="remark">
										</form>
									</td>
									<td width="280">
										<ul>
											<li><a class="btn btn-default" href="javascript:void(0)">权限修改<i class="fa fa-pencil-square-o"></i></a></li>
											<li><a class="btn btn-default" href="javascript:void(0)">禁用<i class="fa fa-remove"></i></a></li>
											<li><a class="btn btn-default" href="javascript:void(0)">启用<i class="fa fa-check-square-o"></i></a></li>
										</ul>
									</td>
								</tr>
								<tr>
									<td>0001</td>
									<td>骆也</td>
									<td>luoye</td>
									<td>luoye@gomeplus.com</td>
									<td>美信技术部</td>
									<td>研发</td>
									<td>备注信息</td>
									<td>操作</td>
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
</template>

<style scoped>
.fa{
	margin-left: 3px;
}
.user_table_con {
	width: 100%;
	overflow-x: auto;
}
.user_table {
	
}
.user_table td ,.user_table th {
	width: 180px;
}
.user_table td {
	position: relative;
	line-height: 34px!important;
}
.user_table td .btn{

}
.user_table td ul{
	font-size: 0;
	text-align: center;
	width: 280px;
	margin: 0 auto;
}
.user_table td ul li{
	display: inline-block;
	vertical-align: middle;
	margin: 0 4px;
	font-size: 14px;
}

.user_table td .remark{
	display: inline-block;
	vertical-align: middle;
	position: absolute;
	right: 8px;
}
.user_table td .remark input{
	display: none;
	margin-right: 5px;
}

.user_table td .remark label i{
	display: inline-block;vertical-align: middle;
	font-size: 22px;
	line-height: 22px;
}
</style>

<script>
var Vue = require('Vue');

var $ = require('jQuery');

var Pagination = require('../common/pagination.vue');

var User = Vue.extend({
	name: 'User',
	data: function(){
		return {
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 30,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {
					// 回调
				}
			}
		}
	},
	components: {
		'm-pagination': Pagination
	},
	methods: {
		showRemark: function(ev){
			if($(ev.target).parents('.remark').find('input').css('display') === 'inline-block'){
				$(ev.target).parents('.remark').find('input').css('display','none');
			}else{
				$(ev.target).parents('.remark').find('input').css('display','inline-block');
			}
		},
		editRemark: function(){
			console.info(111);
		}
	}
})

module.exports = User;
</script>