<template>
	<div class="limit_list">
		<h2>权限列表</h2>
		<ul class="con">
			<li>
				<span>选择</span>
				<span>一级目录</span>
				<span>二级目录／页面</span>
				<span>三级目录／页面</span>
				<span>导出权限</span>
			</li>
			<li v-for="(k1,item1) in pageAll">
				<div @click.stop="showLevel($event, k1)">
					<span><input @click="checkFirst('limit', k1)" type="checkbox" v-model="limitAll[k1]"></input></span>
					<span>{{item1.name}}</span>
					<span>&nbsp;</span>
					<span>&nbsp;</span>
					<span><label><input @click="checkFirst('exportLimit', k1)" type="checkbox" v-model="exportLimitAll[k1]"/>数据导出</label></span>
				</div>
				<ul v-show="levelShow[k1].show">
					<li v-for="item2 of item1.path" >
						<div @click.stop="showSubLevel($event, levelShow[k1], item2.id)" class="second-level">
							<span><input @click="checkSecond(k1, item2.id, limitedObj[k1][item2.id])" type="checkbox" v-model="limitedObj[k1][item2.id]"></input></span>
							<span>&nbsp;</span>
							<span>{{item2.name}}</span>
							<span>&nbsp;</span>
							<span><label><input type="checkbox" v-model="exportLimitObj[k1][item2.id]"/>数据导出</label></span>
						</div>
						<ul v-show="levelShow[k1].subs[item2.id]">
							<li v-for="item3 in item2.subPages">
								<span><input @click="checkThird(k1, item2.id, item3.id, subPagesObj[k1][item2.id][item3.id])" type="checkbox" v-model="subPagesObj[k1][item2.id][item3.id]"></input></span>
								<span>&nbsp;</span>
								<span>&nbsp;</span>
								<span>{{item3.name}}</span>
								<span>&nbsp;</span>
							</li>
						</ul>
					</li>

				</ul>
			</li>
		</ul>
	</div>
</template>
<style scoped>
label {
	margin: 0;
}

label input {
	margin: 0 5px 0 0;
}

.con {
	width: 100%;
	border: 1px solid #333;
	box-sizing: border-box;
}

.con>li {
	width: 100%;
	font-size: 0;
}

.con>li span {
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	font-size: 14px;
	line-height: 32px;
	border-right: 1px solid #333;
	border-bottom: 1px solid #333;
	box-sizing: border-box;
}

.con>li span:nth-child(1) {
	width: 10%;
}

.con>li span:nth-child(2) {
	width: 20%;
}

.con>li span:nth-child(3) {
	width: 24%;
}
.con>li span:nth-child(4) {
	width: 24%;
}

.con>li span:nth-child(5) {
	width: 22%;
	border-right: none;
}

.con>li>div {
	font-size: 0;
	background-color: rgb(204, 204, 255);
	cursor: pointer;
}

.second-level {
	background: rgba(204,204,255,0.2);
	cursor: pointer;
}

.con>li:last-child span {
	border-bottom: none;
}

.con>li>ul {
	font-size: 0;
	width: 100%;
}

.con>li>ul>li {
	font-size: 0px;
}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');

var utils = require('utils');

var LimitList = Vue.extend({
	name: 'LimitList',
	data: function() {
		return {
			pageAll: window.allPageConfig.pageAll,
			// 记录所有二级页面列表
			secondAll: {},
			thirdAll: {},
			levelShow: {},
			limitedObj: {},
			exportLimitObj: {},
			subPagesObj: {},
			limitAll: {},
			exportLimitAll: {}
		};
	},
	props: ['id', 'limited', 'exportLimit', 'subPages'],
	created: function() {
		var count = 0;
		for (let key in this.pageAll) {
			if (count === 0) {
				Vue.set(this.levelShow, key, {show: true, subs: {}});
			} else {
				Vue.set(this.levelShow, key, {show: false, subs: {}});
			}
			let subs = this.pageAll[key].path || [];
			this.thirdAll[key] = {};
			let secIds = [];
			// mock subPages and ID 
			// delete after API finished
			// for(let index in subs) {
				// let id = index.toString();
				// Vue.set(subs[index], 'id', id);
				// Vue.set(subs[index], 'subPages', [{id: "test1",name: 'mock1', url: 'mock1url'}, {id: "test2",name: 'mock2', url: 'mock2url'}]);
			// }
			for(let item of subs) {
				let id = item.id;
				// 默认都打开三级目录折叠
				Vue.set(this.levelShow[key].subs, id, true);
				secIds.push(item.id);
				let thirds = item.subPages || [];
				let thirdIds = [];
				for(let third of thirds){
					thirdIds.push(third.id);
				}
				this.thirdAll[key][id] = thirdIds;
			}
			this.secondAll[key] = secIds;
			count += 1;
		}
	},
	methods: {
		showLevel: function(ev, index) {
			if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'LABEL') {
				return;
			}
			this.levelShow[index].show = !this.levelShow[index].show;
		},
		showSubLevel(ev, config, index) {
			if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'LABEL') {
				return;
			}
			config.subs[index] = !config.subs[index];
		},
		parseLimitAll: function(type) {
			// 判断是否已全部选中
			if (type === 'limit') {
				for (let item in this.limitedObj) {
					let _count1 = 0;
					for (let k in this.limitedObj[item]) {
						if (this.limitedObj[item][k]) {
							_count1 += 1;
						}
					}
					if (_count1 === this.pageAll[item].path.length) {
						Vue.set(this.limitAll, item, true);
					} else {
						Vue.set(this.limitAll, item, false);
					}
				}
			} else if (type === 'exportLimit') {
				for (let item in this.exportLimitObj) {
					let _count1 = 0;
					for (let k in this.exportLimitObj[item]) {
						if (this.exportLimitObj[item][k]) {
							_count1 += 1;
						}
					}
					if (_count1 === this.pageAll[item].path.length) {
						Vue.set(this.exportLimitAll, item, true);
					} else {
						Vue.set(this.exportLimitAll, item, false);
					}
				}
			}
		},
		parseArrayToObject: function(array) {
			var result = {};
			for (var i = 0; i < array.length; i++) {
				result[array[i]] = true;
			}
			return result;
		},
		parseObjectToLimitObj: function(obj) {
			var result = {};
			for (var item in obj) {
				var _current = [];
				for (var k in obj[item]) {
					if (obj[item][k]) {
						_current.push(k);
					}
				}
				result[item] = _current;
			}
			return result;
		},
		parseObjectToSubPagesObj(obj) {
			let result = {};
			// 遍历第一层
			for (let f in obj) {
				let secs = obj[f];
				result[f] = {};
				// 遍历第二层
				for (let s in secs) {
					let thirds = secs[s];
					// 遍历第三层 
					let _current = [];
					for (let t in thirds) {
						if (thirds[t]) {
							_current.push(t);
						}
					}
					result[f][s] = _current;
				}
			}
			return result;
		},
		checkFirst: function(type, key, ev) {
			if (type === 'limit') {
				Vue.set(this.limitedObj, key, {});
				let secPages = this.secondAll[key];
				if (!this.limitAll[key]) {
					for (let secid of secPages) {
						if (this.limitedObj[key] === undefined) {
							Vue.set(this.limitedObj, key, {});
						}
						Vue.set(this.limitedObj[key], secid, true);
						this.checkSecond(key, secid, false);
					}
				} else {
					for (let secid of secPages) {
						if (this.limitedObj[key] === undefined) {
							Vue.set(this.limitedObj, key, {});
						}
						Vue.set(this.limitedObj[key], secid, false);
						this.checkSecond(key, secid, true);
					}
				}
			} else if (type === 'exportLimit') {
				Vue.set(this.exportLimitObj, key, {});
				if (!this.exportLimitAll[key]) {
					for (let item in this.pageAll[key]['path']) {
						if (this.exportLimitObj[key] === undefined) {
							Vue.set(this.exportLimitObj, key, {});
						}
						Vue.set(this.exportLimitObj[key], item, true);
					}
				} else {
					for (let item in this.pageAll[key]['path']) {
						if (this.exportLimitObj[key] === undefined) {
							Vue.set(this.exportLimitObj, key, {});
						}
						Vue.set(this.exportLimitObj[key], item, false);
					}
				}
			}
		},
		checkSecond(firstid, secondid, val) {
			let subPagesCheckObj = this.subPagesObj[firstid][secondid];
			// 保证subPagesCheckObj已包含全部三级页面的id
			if(!val) {
				for (let id in subPagesCheckObj) {
					Vue.set(subPagesCheckObj, id, true);
				}
			} else {
				for (let id in subPagesCheckObj) {
					Vue.set(subPagesCheckObj, id, false);
				}
			}
		},
		checkThird(firstid, secondid, thirdid, val) {
			// 检查三级页面是否有构成全选和全不选
			let valafter = !val;
			// 仅在选中时判断 三级页面有选中的 二级页面一定需要被选中
			if (valafter) {
				Vue.set(this.limitedObj[firstid], secondid, true);
			}
		}
	},
	watch: {
		limited: {
			handler: function(val) {
				this.limitedObj = {};
				this.limitAll = {};
				for (var item in this.limited) {
					var _curretnObj = this.parseArrayToObject(this.limited[item]);
					if (window.allPageConfig.pageAll[item]) {
						Vue.set(this.limitedObj, item, _curretnObj);
					}
				}
			},
			deep: true
		},
		subPages: {
			handler: function(val) {
				this.subPagesObj = {};
				// 筛选掉limit中不能存在
				for (let f in this.pageAll) {
					// this.subPagesObj
					Vue.set(this.subPagesObj, f, {});
					let secs = this.subPages[f];
					let secAll = this.secondAll[f];
					for (let s of secAll) {
						Vue.set(this.subPagesObj[f], s, {});
						let secIncluded = secs ? Object.keys(secs).includes(s) : false;
						let thirdsAll = this.thirdAll[f][s];
						let thirds = secIncluded ? secs[s] : [];
						for(let tid of thirdsAll) {
							let ischecked = secIncluded && thirds.includes(tid);
							Vue.set(this.subPagesObj[f][s], tid, ischecked);
						}
					}
				}
				// console.log('subPagesObj handler');
				// console.log(this.subPagesObj);
			},
			deep: true
		},
		exportLimit: {
			handler: function(val) {
				this.exportLimitObj = {};
				this.exportLimitAll = {};
				for (var item in this.exportLimit) {
					var _curretnObj = this.parseArrayToObject(this.exportLimit[item]);
					if (window.allPageConfig.pageAll[item]) {
						Vue.set(this.exportLimitObj, item, _curretnObj);
					}
				}
			},
			deep: true
		},
		limitedObj: {
			handler: function() {
				this.parseLimitAll('limit');
				var realLimit = this.parseObjectToLimitObj(this.limitedObj);
				this.$dispatch('borcastLimit', realLimit);
			},
			deep: true
		},
		subPagesObj: {
			handler: function() {
				var realSubPages = this.parseObjectToSubPagesObj(this.subPagesObj);
				this.$dispatch('borcastSubPages', realSubPages);
			},
			deep: true
		},
		exportLimitObj: {
			handler: function() {
				this.parseLimitAll('exportLimit');
				var realLimit = this.parseObjectToLimitObj(this.exportLimitObj);
				this.$dispatch('borcastExportLimit', realLimit);
			},
			deep: true
		}
	}
});

module.exports = LimitList;
</script>
