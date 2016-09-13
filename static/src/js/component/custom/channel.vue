<template>
	<div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<strong>渠道列表</strong>
			</div>
			<div class="panel-body">
				<div class="add-channel">
					<table class="table table-bordered">
						<tr>
							<th>渠道类型</th>
							<th>类型编号</th>
							<th>渠道名称</th>
							<th>渠道编号</th>
							<th>渠道预留位</th>
						</tr>
						<tr>
							<td>
								<input v-model="model.channel_type" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="model.channel_type_code" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="model.channel_name" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="model.channel_code" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="model.channel_ex" class="form-control" type="text" name="">
							</td>
						</tr>
					</table>
					<button class="btn btn-primary" @click="addChannel">增加渠道</button>
				</div>
				<table class="table table-bordered">
					<tr>
						<th>序号</th>
						<th>渠道类型</th>
						<th>类型编号</th>
						<th>渠道名称</th>
						<th>渠道编号</th>
						<th>渠道预留位</th>
						<th>渠道ID</th>
					</tr>
					<tr v-for="(index,item) in list">
						<td>{{index+1}}</td>
						<td>{{item.channel_type}}</td>
						<td>{{item.channel_type_code}}</td>
						<td>{{item.channel_name}}</td>
						<td>{{item.channel_code}}</td>
						<td>{{item.channel_ex}}</td>
						<td>{{item.channel_id}}</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<m-loading :loading.sync="loading"></m-loading>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');

	var Loading = require('../common/loading.vue');
	
	var channel = Vue.extend({
		name: 'channel',
		components: {
			'm-loading': Loading
		},
		data: function() {
			return {
				loading: {
					show: true,
					noLoaded: 0
				},
				model: {
					channel_type: '',
					channel_type_code:'',
					channel_name: '',
					channel_type: '',
					channel_ex: ''
				},
				list: []
			}
		},
		methods: {
			addChannel: function() {
				let _this = this;
				for(let key in this.model) {
					if(!this.model[key]) {
						alert('所有字段都为必填选项!');
						return false;
					}
				}
				$.post('/custom/channel', {data: JSON.stringify(this.model)}, function(res) {
					if(res.code===200) {
						_this.list.push(res.data);
					}else {
						alert(res.msg);
					}
				})
			}
		},
		route: {
			data: function() {
				let _this = this;
				$.get('/custom/channel', function(res) {
					_this.list= res.data;
					_this.loading.show = false;
				})
			}
		}
	});

	module.exports = channel;
</script>
<style scoped>
	.add-channel {
		margin-bottom: 20px;
	}
</style>
