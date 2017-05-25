<template>
	<div class="modal" id="modal_table" v-show="tabCheckboxConfig.show" transtion="fade">
		<div class="modal-dialog modal-lg" style="width: 700px">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">{{tabCheckboxConfig.title}}</h4>
				</div>
				<div class="modal-body"> 
					<ul class="nav nav-tabs">
						<li v-for="(index, item) in list" role="presentation" :class="{ 'active':  tabindex === index }"><a href="javascript:void(0);" @click="tabindex=index">{{item.text}}</a></li>
					</ul>
					<div class="checkbox">
						<div v-for="(index, item) in list" v-show="tabindex === index">
							<label v-for="option in item.options">
								<input type="checkbox" :value="option.value" v-model="checkList" name=""> {{option.text}}
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<a href="javascript:void(0)" class="btn btn-default" @click="apply">确认</a>
					<a href="javascript:void(0)" class="btn btn-default" @click="tabCheckboxConfig.cancel()">取消</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	var store = require('../../store/store.js');
	var actions = require('../../store/actions.js');

	export default {
		vuex: {
			getters: {
				tabCheckboxConfig: function() {
					return store.state.tabCheckboxConfig;
				}
			},
			actions: actions
		},
		computed: {
			list() {
				return JSON.parse(JSON.stringify(this.tabCheckboxConfig.groups));
			}
		},
		data() {
			return {
				tabindex: 0,
				checkList: []
			}
		},
		methods: {
			apply: function(){
				var arr = this.checkList;
				var max = this.tabCheckboxConfig.max;
				var length = arr.length;
				if (length > max){
					actions.alert(store, {
						show: true,
						msg: '最多只能选中'+ max + "个选项,当前选中" + length,
						type: 'warning'
					});
				}else{
					let path = this.$route.path;
					if (path.indexOf('?') > -1) {
						let query = path.split('?')[1]
						if (query) {
							let params = query.split('&');
							params.forEach(x => {
								let result = x.split('=')
								let key = result[0]
								let val = result[1];
								if (key.indexOf('filter') === -1 && arr.indexOf(val) === -1){
									arr.push(val);
								}
							})
						}
					}
					this.tabCheckboxConfig.apply(arr);
				}
			}
		}
	}
</script>
<style scoped>
	.checkbox {
		padding: 10px;
	}
	.checkbox label {
		margin: 0 5px;
	}
</style>