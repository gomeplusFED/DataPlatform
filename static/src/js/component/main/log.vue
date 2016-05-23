<template>

<div class="row">
	<div class="col-lg-12">
		<div class="panel panel-default">
			<div class="panel-heading">
				<strong>系统日志</strong>
			</div>
			<div class="panel-body">
				<div class="user_table_con">
					<table class="table table-bordered table-hover user_table">
						<thead>
							<tr>
								<th>时间</th>
								<th>操作帐号</th>
								<th>操作IP</th>
								<th>操作内容</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in logDate">
								<td>{{item.date | Date 'yyyy-MM-dd hh:mm:ss'}}</td>
								<td>{{item.username}}</td>
								<td>{{item.ip}}</td>
								<td>{{item.content}}</td>
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


<script>

var Vue = require('Vue');

var Pagination = require('../common/pagination.vue');

// fileter
require('../../filter/index.js');

var Log = Vue.extend({
	name: 'Log',
	data: function(){
		return {
			paginationConf: {
				currentPage: 1,     // 当前页
				totalItems: 0,     // 总条数
				itemsPerPage: 10,    // 每页条数
				pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {

				}
			},
			logDate: null
		}
	},
	created: function(){
		this.createdList();
	},
	ready: function(){
		this.paginationConf.onChange = this.createdList;
	},
	components: {
		'm-pagination': Pagination,
	},
	methods: {
		createdList: function(){
			var _this = this;
			$.ajax({
				url: '/log/find',
				type: 'get',
				data: {
					limit: _this.paginationConf.itemsPerPage,
					page: _this.paginationConf.currentPage
				},
				success: function(data){
					_this.logDate = data.data;
					_this.paginationConf.totalItems = data.count;
				}
			})
		}
	}
})

module.exports = Log;

</script>