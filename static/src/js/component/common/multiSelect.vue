<template>
	<div class="btn_group level_select" v-show="pageComponentsData[componentType].show">
		<strong>选择类目：</strong>
		<em>{{showResult.length ? showResult.join('－') : '默认'}}</em>
		<ul>
			<li @click="showSelect = !showSelect">选择</li>
			<li @click="resetAll()">重置</li>
		</ul>
		<div class="select_con" v-show="showSelect" transition="fade">
			<div class="dialog_bg" @click="showSelect = !showSelect"></div>
			<div class="dialog_main all_center panel panel-default">
				<div class="panel-heading">
					<strong>选择类目</strong>
				</div>
				<div class="panel-body">
					<div class="select_group_con clearfix">
						<div class="select_group" v-for="(index,item) in level">
							<h2>{{numberMap[index] + '级目录'}}</h2>
							<ul>
								<li v-for="value in item" :key="value.id" track-by="$index" @click="createNext($event,index)">{{value.name}}</li>							
							</ul>
						</div>
					</div>
				</div>
				<div class="panel-footer clearfix">
					<button class="btn btn-default" style="margin-right: 10px;float: left;" @click="resetAll()">重置</button>
					<div class="checked_select">当前选择：{{showResult.length ? showResult.join('－') : '默认'}}</div>
					<button class="btn btn-default" style="margin-left: 10px;float: right;" @click="showSelect = !showSelect,resetAll()">取消</button>
					<button class="btn btn-default" style="margin-left: 10px;float: right;" @click="showSelect = !showSelect,submit()">确认</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.level_select{display: inline-block;font-size: 0;}
.level_select>strong{font-size: 12px;display: inline-block;vertical-align: middle;}
.level_select>em{font-size: 14px;color: #333;font-style: normal;display: inline-block;vertical-align: middle;}
.level_select>ul{display: inline-block;vertical-align: middle;font-size: 0;margin-bottom: 0;margin-left: 10px;}
.level_select>ul li{display: inline-block;vertical-align: middle;border: 1px solid #cacaca;color: #333;padding: 4px 12px;background: #fff;font-size: 12px;outline: none;margin-left: -1px;transition: all ease 0.2s;-webkit-transition: all ease 0.2s;cursor: pointer;}
.level_select>ul li:hover{background: #f5f5f5;}
.select_con{font-size: 14px;position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;}
.select_con .dialog_bg{position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.6);}
.select_con .dialog_main{width: 80%;height: 580px;background: #fff;}
.select_con .dialog_main.panel{display: flex;flex-direction: column;}
.select_con .dialog_main.panel button{outline: none;}
.select_con .dialog_main.panel .panel-body{flex: 1;width: 100%;overflow-x: auto;}
.select_con .dialog_main.panel .panel-body .select_group_con{}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group{float: left;width: 180px;height: 440px;margin: 0 0 0 15px;}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group:first-child{margin-left: 0;}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group h2{font-size: 18px;line-height: 32px;display: block;text-align: center;margin: 0;padding: 0;}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group ul{overflow-y: auto;border: 1px solid #ddd;border-radius: 10px;height: 408px;}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group li{cursor: pointer;background: #fff;transition: all ease 0.2s;-webkit-transition: all ease 0.2s;padding: 0 8px;line-height: 32px;}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group li:hover{background: rgba(0,0,0,0.1);}
.select_con .dialog_main.panel .panel-body .select_group_con .select_group li.active{background: #3389d4;color: #fff;}
.select_con .dialog_main.panel .panel-footer .checked_select{display: inline-block;vertical-align: middle;height: 32px;line-height: 32px;}
</style>

<script>

/*
 * 组件说明
 * 名称：选择类目（异步多级联动）
 * 数据来源：ajax
 * 详细：弹出层多级联动选择，数据较多，每选一层请求下一层的数据
 */

var Vue = require('Vue');
var $ = require('jQuery');

var MultiSelect = Vue.extend({
	name: 'MultiSelect',
	data: function(){
		return {
			showSelect: false,
			level: [],
			noop: function() {},
			showResult: [],
			result: [],
			numberMap: {
				'0': '一',
				'1': '二',
				'2': '三',
				'3': '四',
				'4': '五',
				'5': '六',
				'6': '七'
			},
			checkedId: null
		}
	},
	created: function(){


	},
	ready: function(){
		
	},
	props: ['index','pageComponentsData','componentType','argvs','initData'],
	methods: {
		createNext: function(ev,select_index) {
		    this.level.splice(select_index + 1);
		    $(ev.target).parent().find('li').removeClass('active');
		    $(ev.target).addClass('active');
		    this.showResult.$set(select_index,$(ev.target).text());
			this.showResult.splice(select_index + 1);
			this.checkedId = $(ev.target).attr('key');
			var _this = this;
			$.ajax({
				// url: '/api/categories',
				url: this.pageComponentsData[this.componentType].url,
				type: 'get',
				data: {
					pid: $(ev.target).attr('key')
				},
				success: function(data){
					if(data.length){
						_this.level.push(data);
					}	
				}
			})
		},
		resetAll: function() {
		    this.level.splice(1);
		    $('.select_group li').removeClass('active');
		    this.showResult = [];
		    if(this.argvs.category_id === undefined || this.argvs.category_id === 'all'){
		    	return;
		    }
		    this.$set('argvs.category_id', 'all');
		},
		submit: function(){
			// 设置参数
			this.$set('argvs.category_id',this.checkedId);
		}
	},
	watch: {
		'showSelect': {
			handler: function(val){
				var _this = this;
				if(val){
					$('body').css('overflow','hidden');
					$.ajax({
						url: '/api/categories',
						type: 'get',
						data: {
							pid: 0
						},
						success: function(data){
							_this.level.$set(0, data);
						}
					})
				}else{
					_this.level = [];
					$('body').css('overflow','auto');
				}
			}
		}
	}
})

module.exports = MultiSelect;

</script>