<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<strong>帐号列表</strong>
				</div>
				<div class="panel-body">
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
								<td>研发</td>
								<td>
									<span>备注信息</span>
									<!-- <div class="comment"> -->
										<input type="text"></input>
										<i class="fa fa-edit fa-3x"></i>
									<!-- </div> -->
								</td>
								<td>
									<ul>
										<li><a href="javascript:void(0)">权限修改</a></li>
										<li><a href="javascript:void(0)">禁用</a></li>
										<li><a href="javascript:void(0)">启用</a></li>
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
				<div class="panel-footer">
					<m-pagination :pagination-conf="paginationConf"></m-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.user_table td ul{
	font-size: 0;
	text-align: center;
	margin: 0!important;
}
.user_table td ul li{
	display: inline-block;
	vertical-align: middle;
	margin: 0 4px;
	font-size: 14px;
}
</style>

<script>
var Vue = require('Vue');

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
	}
})

module.exports = User;
</script>