<template>
	<div class="btn_group control_table_col" v-show="pageComponentsData[componentType].show">
		<strong>控制表格列：</strong>
		<button class="btn btn-default btn-sm" @click="showModal = !showModal">选择</button>
		<div class="select_con multi_option_show" v-show="showModal">
			<div class="dialog_bg"></div>
			<div class="dialog_main all_center panel panel-default" style="width: 450px;">
				<div class="panel-heading">
					<strong>控制表格列</strong>
				</div>
				<div class="panel-body">
					<ul>
						<li v-for="(index, item) in tableData.rows" @click="check(item, index)" :class="{'active': multiCheckedOption[index]}">{{tableData.cols[index].caption}}</li>
					</ul>
				</div>
				<div class="panel-footer clearfix">
					<button class="btn btn-default" style="margin-left: 10px;" @click="checkAll()">全选</button>
					<button class="btn btn-default" style="margin-left: 10px;float: right;" @click="hideMultiCon()">取消</button>
					<button class="btn btn-default" style="margin-left: 10px;float: right;" @click="applyMulti()">确认</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.control_table_col {
	display: inline-block;
	font-size: 0;
	margin: 0 25px 12px 0;
}

.control_table_col>strong {
	font-size: 12px;
	display: inline-block;
	vertical-align: middle;
}

.control_table_col>button {
	font-size: 12px;
}
</style>
<script>
var Vue = require('Vue');
var eventBus = require('../support/event-bus.vue');

module.exports = Vue.extend({
	name: 'control-table-col',
	data: function() {
		return {
			showModal: false,
			tableData: null,
			multiCheckedOption: {}
		};
	},
	props: ['index', 'pageComponentsData', 'componentType', 'initData', 'currentData'],
	ready: function() {
		var _this = this;
		eventBus.$on('tableGenerate' + this.index, function(tableData) {
			_this.tableData = tableData[0];
			_this.checkAll();
		});
	},
	methods: {
		check: function(item, index) {
			if (this.multiCheckedOption[index]) {
				this.multiCheckedOption[index] = false;
			} else {
				Vue.set(this.multiCheckedOption, index, true);
			}
		},
		hideMultiCon: function() {
			this.showModal = false;
		},
		applyMulti: function() {
			eventBus.$emit('controlTableCol' + this.index, this.multiCheckedOption);
			this.showModal = false;
		},
		checkAll: function() {
			var _this = this;
			this.tableData.cols.forEach(function(item, index) {
				Vue.set(_this.multiCheckedOption, index, true);
			});
		}
	}
});
</script>
