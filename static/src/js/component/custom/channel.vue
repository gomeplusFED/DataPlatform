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
								<input v-model="channel_type" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="channel_type_code" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="channel_name" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="channel_code" class="form-control" type="text" name="">
							</td>
							<td>
								<input v-model="channel_ex" class="form-control" type="text" name="">
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
						<td>{{channel_type}}</td>
						<td>{{channel_type_code}}</td>
						<td>{{channel_name}}</td>
						<td>{{channel_code}}</td>
						<td>{{channel_ex}}</td>
						<td>{{channel_id}}</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');

	var channel = Vue.extend({
		name: 'channel',
		data: function() {
			return {
				model: {},
				list: []
			}
		},
		methods: {
			addChannel: function() {
				var temp = JSON.parse(JSON.stringify(this.model));
				this.list.push(temp);
			}
		},

	});

	module.exports = channel;
</script>
<style scoped>
	.add-channel {
		margin-bottom: 20px;
	}
</style>