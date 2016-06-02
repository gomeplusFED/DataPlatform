<template>
	<div class="panel panel-default" style="width: 500px;left: 50%;top: 40%;position: fixed;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);z-index: 999999;" v-show="exportConfirmConfig.show">
		<div class="panel-heading">
			<strong>{{exportConfirmConfig.title}}</strong>
		</div>
		<div class="panel-body">
			<ul class="export_ul">
				<li>
					<input type="radio" name="export" id="a" value="a" v-model="checkedRadio">
					<label for="a">当前页导出</label>
				</li>
				<li>
					<input type="radio" name="export" id="b" value="b" v-model="checkedRadio">
					<label for="b">选择数据导出（共{{exportConfirmConfig.len}}条数据）</label>
					<input type="number" v-model="from">－<input type="number" v-model="to" :value="exportConfirmConfig.len" :max="exportConfirmConfig.len">
					<div style="height: 28px;">
						<p style="color: #ff5151;line-height: 28px;" v-show="(parseInt(to) - parseInt(from)) > 1000 || (parseInt(from) - parseInt(to)) > 0">范围有误</p>					
					</div>
				</li>
			</ul>
		</div>
		<div class="panel-footer">
			<a href="javascript:void(0)" class="btn btn-default" @click="apply(),hide()">确认</a>
			<a href="javascript:void(0)" class="btn btn-default" @click="cancel(),hide()">取消</a>
		</div>
	</div>
</template>

<style scoped>
.export_ul{
	font-style: normal;
}

.export_ul input[type='number']{
	display: inline-block;
	width: 100px;
}
	
</style>


<script>

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

export default {
	name: 'exportConfirm',
	data() {
		return {
			checkedRadio: 'a',
			from: 0,
			to: 0
		}
	},
	vuex: {
		getters: {
			exportConfirmConfig() {
				return store.state.exportConfirmConfig;
			}
		}
	},
	methods: {
		apply() {
			this.exportConfirmConfig.apply && this.exportConfirmConfig.apply(this.checkedRadio, parseInt(this.from), parseInt(this.to));
		},
		cancel() {
			this.exportConfirmConfig.cancle && this.exportConfirmConfig.cancle();	
		},
		hide() {
			actions.exportConfirm(store, {
				show: false
			})
		}
	}
}

</script>