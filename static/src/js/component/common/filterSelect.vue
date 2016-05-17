<template>
	<div class="filter_select" v-show="pageComponentsData[componentType].length > 0">
		<div class="filter_group" :id="'filter_group_' + index + '_' + $index" v-for="( pageComponentsDataIndex, item) in pageComponentsData[componentType]" track-by="$index">
			<div class="group">
				<strong>{{item.title}}{{item.title === '' ? '' : '：'}}</strong>
				<div class="btn_group" v-if="!isCell">
					<div v-if="item.groups.length < 5">
						<button v-for="group in item.groups" @click="getArgv(item.filter_key,group.key,$event)" track-by="$index">{{group.value}}</button>						
					</div>
					<div v-else>
						<select @change="getArgvSelect(item.filter_key, $event)">
							<option v-for="group in item.groups" :value="group.key">{{group.value}}</option>
						</select>
					</div>
				</div>
				<div class="btn_group" v-else>
					<select @change="extraSelect($event,pageComponentsDataIndex)">
						<option v-for="group in item.groups" :value="group.key">{{group.value}}</option>
					</select>
					<div class="cell_select" v-for="cell in cellData" :index="$index" v-show="checkedOption === $index">
						<strong>{{cell.title}}{{cell.title === '' ? '' : '：'}}</strong>
						<select @change="cellSelectChange($event,pageComponentsDataIndex)">
							<option v-for="cellOption in cell.groups" :value="cellOption.key">{{cellOption.value}}</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.filter_select{font-size: 0;margin: 0 0 12px 0;display: inline-block;}
.filter_select .filter_group{display: inline-block;vertical-align: middle;margin-right: 25px;}
.filter_select .filter_group .group{display: inline-block;vertical-align: middle;margin-left: 25px;}
.filter_select .filter_group .group:first-child{margin-left: 0;}
.filter_select .filter_group .group strong{font-size: 12px;display: inline-block;vertical-align: middle;}
.filter_select .filter_group .group .btn_group{font-size: 0;display: inline-block;vertical-align: middle;}
.filter_select .filter_group .group .btn_group:hover button{border-color: #bbb;}
.filter_select .filter_group .group .btn_group button{display: inline-block;vertical-align: middle;border: 1px solid #cacaca;color: #333;padding: 4px 12px;background: #fff;font-size: 12px;outline: none;margin-left: -1px;transition: all ease 0.2s;-webkit-transition: all ease 0.2s;}
.filter_select .filter_group .group .btn_group button:hover{background: #f5f5f5;}
.filter_select .filter_group .group .btn_group button:first-child{border-radius: 2px 0 0 2px;margin-left: 0;}
.filter_select .filter_group .group .btn_group button:last-child{border-radius: 0 2px 2px 0;}
.filter_select .filter_group .group .btn_group button.active{background: #3389d4;border: 1px solid #3389d4;color: #fff;}
.filter_select .filter_group .group .btn_group select{font-size: 12px;outline: none;padding: 0;margin: 0;display: inline-block;vertical-align: middle;height: 27px;line-height: 27px;color: #555;background-color: #fff;    border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);}
.filter_select .filter_group .group .btn_group select option{font-size: 12px;}
.filter_select .filter_group .group .btn_group .cell_select{display: inline-block;vertical-align: middle;margin-left: 25px;}
.filter_select .filter_group .group .btn_group .cell_select:first-child{margin-left: 0;}
</style>

<script>

/*
 * 组件说明
 * 名称：条件过滤组件
 * 数据来源：filter_select
 * 详细：可以分为单选和联动选择，位置在head的下面，图表的上面
 */

var Vue = require('Vue');
var $ = require('jQuery');

var FilterSelect = Vue.extend({
	name: 'FilterSelect',
	data: function(){
		return {
			targetParentGroup: null,
			isCell: false,
			cellData: [],
			isFirstHandler: true,
			checkedOption: 0,
			cellCheckedOption: 0
		}
	},
	props: ['index','pageComponentsData','componentType','argvs','initData'],
	ready: function(){
		
	},
	methods: {
		getArgv: function(key,value,ev){
			Vue.set(this.argvs, key, value);
		},
		getArgvSelect: function(key, ev){
			var value = $(ev.target).find('option:selected').val();
			Vue.set(this.argvs, key, value);
		},
		extraSelect: function(ev,pageComponentsDataIndex){
			this.checkedOption = $(ev.target).find('option:selected').index();
			// 嵌套层级较深，从原始属性里慢慢分析吧。。。心累
			Vue.set(this.argvs, this.pageComponentsData[this.componentType][pageComponentsDataIndex].filter_key, this.pageComponentsData[this.componentType][pageComponentsDataIndex].groups[this.checkedOption].key);
			Vue.set(this.argvs, this.pageComponentsData[this.componentType][pageComponentsDataIndex].groups[this.checkedOption].cell.filter_key, this.pageComponentsData[this.componentType][pageComponentsDataIndex].groups[this.checkedOption].cell.groups[0].key);
		},
		cellSelectChange: function(ev,pageComponentsDataIndex){
			this.cellCheckedOption = $(ev.target).find('option:selected').index();
			Vue.set(this.argvs, this.pageComponentsData[this.componentType][pageComponentsDataIndex].groups[this.checkedOption].cell.filter_key, this.pageComponentsData[this.componentType][pageComponentsDataIndex].groups[this.checkedOption].cell.groups[this.cellCheckedOption].key);
		},
		checkHasCell: function(){
			for(var item of this.pageComponentsData[this.componentType]){
				var _count = 0;
				for(var group of item.groups){
					if(group.cell && group.cell.groups.length){
						_count ++;
						this.cellData.push(group.cell);
						if(_count === item.groups.length){
							this.isCell = true;
						}
					}
				}
			}
		}
	},
	watch: {
		'pageComponentsData': {
			handler: function(val){
				var _this = this;
				// 异步请求组件参数，watch到变化之后初始化，其它组件类似
				if(val === null || !this.pageComponentsData[this.componentType].length > 0){
					return;
				}
				// 检测filter是否是级联选择
				this.checkHasCell();

				// 纯按钮事件处理
				if(this.isFirstHandler && !this.isCell){
					// if(){}

					for(var i = 0;i < this.pageComponentsData[this.componentType].length;i++){
						var _curr = this.pageComponentsData[this.componentType][i];
						if(_curr.groups.length > 5){
							Vue.set(this.argvs, this.pageComponentsData[this.componentType][0].filter_key, _curr.groups[0].key);
						}else{
							(function(filterIndex){
								$('#filter_group_' + _this.index + '_' + filterIndex).find('button').bind('click',function(){
									$('#filter_group_' + _this.index + '_' + filterIndex).find('button').removeClass('active');
									$(this).addClass('active');
								})
							})(i)
							$('#filter_group_' + this.index + '_' + i).find('button').eq(0).trigger('click');
						}
					}
				}
				// 级联菜单事件处理
				if(this.isFirstHandler && this.isCell){
					Vue.set(this.argvs, this.pageComponentsData[this.componentType][0].filter_key, this.pageComponentsData[this.componentType][0].groups[0].key);
					Vue.set(this.argvs, this.pageComponentsData[this.componentType][0].groups[0].cell.filter_key, this.pageComponentsData[this.componentType][0].groups[0].cell.groups[0].key);
				}

			},
			deep: true
		}
	}
})
module.exports = FilterSelect;

</script>