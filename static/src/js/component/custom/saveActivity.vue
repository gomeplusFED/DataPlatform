<template>
	<div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<strong>添加活动</strong>
				<div class="head_group_con clearfix">
					<button class="btn btn-primary" @click="commit">提交</button>
					<button class="btn btn-default" v-link="{path: '/activity/list'}">
						取消
					</button>
				</div>
			</div>
			<div class="panel-body">
				<div class="activity-info">
					<form class="form-horizontal">
						<div class="form-group">
							<label for="activity_type"  class="col-sm-1 control-label">活动类型:</label>
							<div class="col-sm-4">
								<input v-model="model.activity_type" :disabled="$route.query.activity_id" type="text" class="form-control" placeholder="">
							</div>
						</div>
						<div class="form-group">
							<label for="activity_id"  class="col-sm-1 control-label">活动ID:</label>
							<div class="col-sm-4">
								<input v-model="model.activity_id" :disabled="$route.query.activity_id" type="text" class="form-control" placeholder="">
							</div>
						</div>
						<div class="form-group">
							<label for="activity_name"  class="col-sm-1 control-label">活动名称:</label>
							<div class="col-sm-4">
								<input v-model="model.activity_name" type="text" class="form-control" placeholder="">
							</div>
						</div>
						<div class="form-group">
							<label for=""  class="col-sm-1 control-label">活动起止时间:</label>
							<div class="col-sm-6">
								<m-date :index="dateConifg.index" :init-data="dateConifg.initData" :page-components-data="dateConifg.pageComponentsData" :component-type="'date_picker'" :argvs.sync='dateConifg.argvs'></m-date>
							</div>
						</div>
					</form>
				</div>
				<div class="channel">
					<h4>推广渠道:</h4>
					<table class="table table-bordered" style="width: 50%" v-if="model.activity_channel_relationship.length">
						<tr>
							<th>渠道名称</th>
							<th>渠道ID</th>
						</tr>
						<tr v-for="channel in model.activity_channel_relationship">
							<td>{{channel.channel_name}}</td>
							<td>{{channel.channel_id}}</td>
						</tr>
					</table>
					<div class="form-horizontal">
						<div class="form-group">
							<label for="channel_name"  class="col-sm-1 control-label">渠道名称:</label>
							<div class="col-sm-4">
								<input type="text" v-model="channel.channel_name" class="form-control" placeholder="">
							</div>
						</div>
						<div class="form-group">
							<label for="channel_id"  class="col-sm-1 control-label">渠道ID:</label>
							<div class="col-sm-4">
								<input type="text" v-model="channel.channel_id" class="form-control" placeholder="">
							</div>
						</div>
						<div class="form-group">
							<label for="channel_id"  class="col-sm-1 control-label"></label>
							<div class="col-sm-4">
								<button class='btn btn-primary' @click="addChannel">添加</button>
							</div>
						</div>
						
					</div>
				</div>
				<div class="remark">
					<label>备注：</label>
					<textarea rows="3" name="" v-model="model.desc" class="form-control" ></textarea>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');

	var DatePicker = require('../common/datePicker.vue');

	var vm = Vue.extend({
		name: 'saveActivity',
		components: {
			'm-date': DatePicker,
		},
		data: function() {
			return {
				model: {
					activity_type: "",
					activity_id: "",
					activity_name: "",
					activity_start_time: "",
					activity_end_time: "",
					// activity_info: "",
					activity_channel_relationship: []
				},
				channel: {
					channel_name: "",
					channel_id: ""
				},
				dateConifg: {
					index: 0,
					argvs: {
						// endTime: "2016-08-17",
						// startTime: "2016-08-11",
					},
					pageComponentsData: {

					},
					initData: window.allPageConfig
				}
			}
		},
		methods: {
			addChannel: function() {
				// validate
				if (!this.serError(this.channel)) {
					return false;
				}

				this.model.activity_channel_relationship.push({
					channel_name: this.channel.channel_name,
					channel_id: this.channel.channel_id
				});
				this.channel.channel_name = "";
				this.channel.channel_id = "";
			},
			commit: function() {
				this.model.activity_start_time = this.dateConifg.argvs.startTime;
				this.model.activity_end_time = this.dateConifg.argvs.endTime;
				// validate
				if (!this.serError(this.model)) {
					return false;
				}
				// post { activity : this.model }
				let activity_id = this.model.activity_id;
				this.model.activity_channel_relationship = this.model.activity_channel_relationship.filter(function(x) {
					return !x.id;
				})
				this.model.activity_channel_relationship.map(function(x) {
					// delete x.channel_name;
					x.activity_id = activity_id;
				})
				$.post('/custom/saveActivity', {
					data: JSON.stringify(this.model)
				}, function(res) {
					if (res.code === 200) {
						window.location.href = '/#!/activity/list';
					} else {
						alert(res.msg);
					}
				})
			},
			serError: function(obj) {
				// validate
				for (var key in obj) {
					if (!obj[key] && obj[key] != undefined) {
						$('label[for=' + key + ']').parent('.form-group').addClass('has-error').on('keyup', function() {
							$(this).removeClass('has-error');
							$(this).unbind('keyup');
						});
						if ($('label[for=' + key + ']').length) {
							return false;
						}
					}
				}
				return true;
			}
		},
		route: {
			data: function() {
				this.dateConifg.pageComponentsData = {
					date_picker: {
						show: true,
						defaultData: 7
					}
				};
				var _this = this;
				var id = this.$route.query.activity_id;
				if (id) {
					// get model by id /custom/saveActivity
					$.get('/custom/saveActivity?activity_id=' + id, function(res) {
						if(res.code === 200){
							_this.model = res.data;
							if (_this.model.activity_start_time && _this.model.activity_end_time) {
								_this.dateConifg.argvs.startTime = _this.model.activity_start_time;
								_this.dateConifg.argvs.endTime = _this.model.activity_end_time;
							}
							$('.date_picker>input').attr('disabled', 'disabled');
						}
					})
				}
			}
		}
	});

	module.exports = vm;
</script>
<style scoped>
	.head_group_con button {
		margin: 0 5px;
	}
	
	.panel-body {
		/*padding: 20px;*/
	}
	
	.panel-body>div {
		margin: 10px 0;
		border-bottom: 1px solid #eee;
	}

	.form-group label {
		min-width: 140px;
	}
</style>