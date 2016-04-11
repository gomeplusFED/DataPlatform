<template>
	<div class="btn-group level_select">
		<p @click="showSelect = !showSelect">选择类目</p>
		<div class="select_con" v-show="showSelect" transition="fade">
			<div class="dialog_bg"></div>
			<div class="dialog_main all_center">
				<select @change="createNext($event,$index)" v-for="item in level">
			       	<option value="null">请选择...</option>
			        <option v-for="value in item" :value="$key" track-by="$index">{{value.name}}</option>
				</select>
				<button @click="resetAll()">重置</button>					
			</div>
		</div>
	</div>
</template>

<style>

.level_select{}
.level_select p{font-size: 14px;display: inline-block;vertical-align: middle;margin: 0;cursor: pointer;color: #3389d4;}
.level_select p:hover{text-decoration: underline;}
.select_con{font-size: 12px;position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;}
.select_con .dialog_bg{position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.6);}
.select_con .dialog_main{}

</style>

<script>

var Vue = require('Vue');
var $ = require('jQuery');

var MultiSelect = Vue.extend({
	name: 'MultiSelect',
	data: function(){
		return {
			showSelect: false,
			level: [],
			noop: function() {}
		}
	},
	created: function(){
		this.level[0] = this.initData.level_selevt;
	},
	props: ['index','pageComponentsData','componentType','argvs','initData'],
	methods: {
		createNext: function(ev, index) {
		    this.level.length = index + 1;
		    var cell = this.level[index][ev.target.value].cell;
		    if (cell) {
		        this.level.push(cell);
		    }
		    // this.configData.result.push({ 'key': ev.target.value, 'value': this.level[index][ev.target.value].name });
		    // this.configData.onChange({ 'key': ev.target.value, 'value': this.level[index][ev.target.value].name }, this.configData.result);
		},
		resetAll: function() {
		    this.level = [this.initData.level_selevt];
		    // this.configData.result = [];
		    $('.level_select').find('select').eq(0).value = null;
		    console.log($('.level_select').find('select').eq(0));
		}
	},

})

module.exports = MultiSelect;

</script>