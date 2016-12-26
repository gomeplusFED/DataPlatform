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
							<th>一级渠道名称</th>
							<th>一级渠道编号</th>
							<th>二级渠道名称</th>
							<th>二级渠道编号</th>
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
								<input v-model="model.channel_ex_name" class="form-control" type="text" name="">
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
						<th>一级渠道</th>
						<th>一级渠道编号</th>
						<th>二级渠道</th>
						<th>二级渠道编号</th>
						<th>渠道ID</th>
						<th>操作</th>
					</tr>
					<tr v-for="(index,item) in list">
						<td>{{index+1}}</td>
						<template v-if="index !== updateIndex">
							<td>
								{{item.channel_type}}
							</td>
							<td>
								{{item.channel_type_code}}
							</td>
							<td>
								{{item.channel_name}}
							</td>
							<td>
								{{item.channel_code}}
							</td>
							<td>
								{{item.channel_ex_name}}
							</td>
							<td>
								{{item.channel_ex}}
							</td>
						</template>
						<template v-else>
							<td>
								<input type="text" class="form-control" v-model="item.channel_type">
							</td>
							<td>
								<input type="text" class="form-control" v-model="item.channel_type_code">
							</td>
							<td>
								<input type="text" class="form-control" v-model="item.channel_name">
							</td>
							<td>
								<input type="text" class="form-control" v-model="item.channel_code">
							</td>
							<td>
								<input type="text" class="form-control" v-model="item.channel_ex_name">
							</td>
							<td>
								<input type="text" class="form-control" v-model="item.channel_ex">
							</td>
						</template>
						<td>
							{{item.channel_id}}
						</td>
						<td>
							<button class="btn btn-primary" v-if="updateIndex === -1" @click="updateIndex = index">修改</button>
							<button class="btn btn-success" v-else @click="save(index, item)">保存</button>
							<button class="btn btn-danger" @click="delete(index, item.channel_id)">删除</button>
						</td>
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
					channel_ex_name: '',
					channel_ex: ''
				},
				list: [],
				updateIndex: -1
			}
		},
		methods: {
			addChannel: function() {
				let _this = this;
				for(let key in this.model) {
					if(!this.model[key]) {
						alert('所有字段都为必填选项');
						return false;
					}
				}
				$.post('/custom/channel', {data: JSON.stringify(this.model)}, function(res) {
					if(res.code===200) {
						_this.list.push(res.data);
					} else {
						alert(res.msg);
					}
				})
			},
			delete: function(index, channel_id) {
				if (!channel_id) {
					return;
				}
				if (confirm('是否确认删除')) {
					var _this = this;
					$.get('/custom/deleteChannel?channel_id=' + channel_id, function(res) {
						if(res.code===200) {
							_this.list.splice(index, 1);
						}else {
							alert(res.msg);
						}
					})
				}
			},
			save: function(index, item) {
				var _this = this;
				$.post('/custom/updateChannel', {data: JSON.stringify(item)}, function(res) {
					if(res.code === 200) {
						_this.updateIndex = -1;
						item.channel_id = res.result.channel_id;
					} else {
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
