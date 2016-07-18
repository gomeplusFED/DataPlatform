<template>
	<div class="search_con" v-show="pageComponentsData[componentType].show">
		<strong class="title">{{pageComponentsData[componentType].title}}</strong>
		<div class="from-con">
			<div class="input-group input-group-sm">
				<input type="text" class="form-control" v-model="searchStr" @keyDown.enter="applySearch()">
				<span class="input-group-btn">
					<button class="btn btn-default" type="button" @click="applySearch()">搜索</button>
				</span>
			</div>
		</div>
	</div>
</template>
<style scoped>
.search_con {
	font-size: 0;
	margin: 0 0 12px;
	display: inline-block;
}

.search_con .title {
	font-size: 12px;
	display: inline-block;
	vertical-align: middle;
}

.search_con .from-con {
	display: inline-block;
	width: 250px;
	vertical-align: middle;
}

.search_con .input-group {}

.search_con .input-group input {}
</style>
<script>
import Vue from 'vue';
export default {
	name: 'search',
	data: function() {
		return {
			searchStr: ''
		};
	},
	props: ['index', 'pageComponentsData', 'componentType', 'argvs', 'initData'],
	methods: {
		applySearch: function() {
			this.setArgv(this.pageComponentsData[this.componentType].key, this.searchStr);
		},
		setArgv: function(key, value) {
			Vue.set(this.argvs, key, value);
		}
	}
};
</script>
