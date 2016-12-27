<template>
	<div class="limit_list">
		<h2>权限列表</h2>
		<a class="btn btn-default clear-all" href="javascript:void(0)" @click="clearAll">全部清空</a>
		<ul class="con">
			<li>
				<span>选择</span>
				<span>一级目录</span>
				<span>二级目录／页面</span>
				<span>三级目录／页面</span>
				<span>平台权限</span>
				<span>导出权限</span>
			</li>
			<li v-for="(k1,item1) in pageAll">
				<div @click.stop="showLevel($event, k1)">
					<span><input @click="checkFirst(k1, limitAll[k1])" type="checkbox" v-model="limitAll[k1]"></input></span>
					<span>{{item1.name}}</span>
					<span>&nbsp;</span>
					<span>&nbsp;</span>
					<span>
						<checkbox-list 
						:list="platformType" 
						level="1" 
						:obj="{k1: k1}" 
						:val.sync="platfromPermission1[k1]">
						</checkbox-list>
					</span>
					<span><label><input @click="checkFirstExport(k1, exportLimitAll[k1])" type="checkbox" v-model="exportLimitAll[k1]"/>数据导出</label></span>
				</div>
				<ul v-show="levelShow[k1].show">
					<li v-for="item2 of item1.path" >
						<div @click.stop="showSubLevel($event, levelShow[k1], item2.id)" class="second-level">
							<span><input @click="checkSecond(k1, item2.id, limitedObj[k1][item2.id])" type="checkbox" v-model="limitedObj[k1][item2.id]"></input></span>
							<span>&nbsp;</span>
							<span>{{item2.name}}</span>
							<span>&nbsp;</span>
							<span>
								<checkbox-list 
								:list="platformType" 
								level="2" 
								:obj="{k1: k1, id2: item2.id}" 
								:val.sync="platfromPermission2[k1][item2.id]">
								</checkbox-list>
							</span>
							<span><label><input @click="checkSecondExport(k1, item2.id, exportLimitObj[k1][item2.id])" type="checkbox" v-model="exportLimitObj[k1][item2.id]"/>数据导出</label></span>
						</div>
						<ul v-show="levelShow[k1].subs[item2.id]">
							<li v-for="item3 in item2.subPages">
								<span><input @click="checkThird(k1, item2.id, item3.id, subPagesObj[k1][item2.id][item3.id])" type="checkbox" v-model="subPagesObj[k1][item2.id][item3.id]"></input></span>
								<span>&nbsp;</span>
								<span>&nbsp;</span>
								<span>{{item3.name}}</span>
								<span>
									<checkbox-list 
									:list="platformType" 
									level="3" 
									:obj="{k1: k1, id2: item2.id, id3: item3.id}" 
									:val.sync="platfromPermission3[k1][item2.id][item3.id]">
									</checkbox-list>
								</span>
								<span>&nbsp;</span>
							</li>
						</ul>
					</li>

				</ul>
			</li>
		</ul>
	</div>
</template>
<script>
var Vue = require('Vue');
var $ = require('jQuery');

var utils = require('utils');
import checkboxList from './checkboxList.vue'

var LimitList = Vue.extend({
	name: 'LimitList',
	components: {checkboxList},
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
			exportLimitAll: {},
			platfromPermission1: {},
			platfromPermission2: {},
			platfromPermission3: {},
			platformType: ['IOS', 'Android', 'APP', 'PC', 'WAP站']
		};
	},
	props: ['id', 'limited', 'exportLimit', 'subPages', 'type'],
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
				// 没有id的不予显示
				if (id != null) {
					// id一定为字符串
					id = id.toString();
					// 回写id为字符串
					item.id = id;
					// 默认都打开三级目录折叠
					Vue.set(this.levelShow[key].subs, id, true);
					secIds.push(id);
					let thirds = item.subPages || [];
					let thirdIds = [];
					for(let third of thirds){
						let tid = third.id;
						// 三级页面也一定要有id
						if (tid != null) {
							tid = tid.toString();
							// 回写id为字符串
							third.id = tid;
							thirdIds.push(tid.toString());
						}
					}
					this.thirdAll[key][id] = thirdIds;
				}
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
		clear(obj){
			if (typeof obj === 'object') {
				for (let key in obj) {
					if(obj[key] === true) {
						obj[key] = false;
					} else {
						this.clear(obj[key]);
					}
				}
			}
		},
		clearAll(){
			this.clear(this.limitAll);
			this.clear(this.exportLimitAll);
			this.clear(this.limitedObj);
			this.clear(this.exportLimitObj);
			this.clear(this.subPagesObj);
		},
		checkFirst(firstid, val) {
			let valafter = !val;
			
			this.parseSubSecond(firstid, valafter);
			// 默认不勾选“数据导出”
			// this.parseSubSecondExport(firstid, valafter);
			// Vue.set(this.exportLimitAll, firstid, valafter);
		},
		checkFirstExport(firstid, val) {
			if (val) {
				// 由true 变为false，仅取消下级导出功能
				this.parseSubSecondExport(firstid, false);
			} else {
				// 由false 变为true，相当于全部选择
				Vue.set(this.limitAll, firstid, true);
				this.parseSubSecond(firstid, true);
				this.parseSubSecondExport(firstid, true);
			}
		},
		checkSecond(firstid, secondid, val) {
			let valafter = !val;

			// 检查一级页面是否全选的状态
			this.parseFirst(firstid, secondid, valafter);
			
			
			// 一级页面的导出全选状态
			// 默认不勾选“数据导出”
			// this.parseFirstExport(firstid, secondid, valafter);
			// Vue.set(this.exportLimitObj[firstid], secondid, valafter);
			// 下属三级页面全部选中/不选
			this.parseSubThird(firstid, secondid, valafter);
		},
		checkSecondExport(firstid, secondid, val) {
			if (val) {
				// 由true 变为false，仅取消下级导出功能
				// 然而三级页面并没有导出权限
				// 检查是否取消一级页面导出的选中
				this.parseFirstExport(firstid, secondid, false);
			} else {
				// 由false 变为true，相当于check了二级页面
				Vue.set(this.limitedObj[firstid], secondid, true);
				this.parseFirst(firstid, secondid, true);
			
				// 一级页面的导出全选状态
				this.parseFirstExport(firstid, secondid, true);
				
				// 下属三级页面全部选中/不选
				this.parseSubThird(firstid, secondid, true);
			}
		},
		checkThird(firstid, secondid, thirdid, val) {
			// 检查三级页面是否有构成全选和全不选
			let valafter = !val;
			// 仅在选中时判断 三级页面有选中的 二级页面一定需要被选中
			if (valafter) {
				Vue.set(this.limitedObj[firstid], secondid, true);
				// 默认不勾选“数据导出”
				// Vue.set(this.exportLimitObj[firstid], secondid, true);
				this.parseFirst(firstid, secondid, true);
				// 默认不勾选“数据导出”
				// this.parseFirstExport(firstid, secondid, true);
			}
		},
		parseFirst(firstid, secondid, valafter) {
			// 检查二级页面对应的一级页面是否全选的状态
			let secs = this.limitedObj[firstid];
			let firstChecked = valafter;
			for (let k in secs) {
				if ((k !== secondid) && (secs[k] != valafter)) {
					// 有不同的 一级页面肯定不予全选
					firstChecked = false;
					break;
				}
			}
			Vue.set(this.limitAll, firstid, firstChecked);
		},
		parseFirstExport(firstid, secondid, valafter) {
			// 检查二级导出页面对应的一级导出页面是否全选的状态
			let secs = this.exportLimitObj[firstid];
			let firstChecked = valafter;
			for (let k in secs) {
				if ((k !== secondid) && (secs[k] != valafter)) {
					// 有不同的 一级页面肯定不予全选
					firstChecked = false;
					break;
				}
			}
			Vue.set(this.exportLimitAll, firstid, firstChecked);
		},
		parseSubSecond(firstid, valafter) {
			// 下属二级页面全部全选或全不选
			let secPages = this.secondAll[firstid];
			for (let secid of secPages) {
				Vue.set(this.limitedObj[firstid], secid, valafter);
				// 连锁三级全部选中/全不选
				this.parseSubThird(firstid, secid, valafter);
			}
		},
		parseSubSecondExport(firstid, valafter) {
			// 下属二级导出页面全部全选或全不选
			let secPages = this.secondAll[firstid];
			for (let secid of secPages) {
				Vue.set(this.exportLimitObj[firstid], secid, valafter);
				// 暂无三级导出
				// this.parseSubThirdExport(firstid, secid, valafter);
			}
		},
		parseSubThird(firstid, secondid, valafter) {
			// 下属三级页面全部全选或全不选
			let subPagesCheckObj = this.subPagesObj[firstid][secondid];
			// 保证subPagesCheckObj已包含全部三级页面的id
			for (let id in subPagesCheckObj) {
				Vue.set(subPagesCheckObj, id, valafter);
			}
		}
	},
	watch: {
		limited: {
			handler: function(val) {
				let limitedObj = {};
				let limitAll = {};
				for (let f in this.pageAll) {
					let userLimtited = this.limited[f];
					limitedObj[f] = {};
					limitAll[f] = !!userLimtited;
					let secAll = this.secondAll[f];
					for (let s of secAll) {
						limitedObj[f][s] = userLimtited && userLimtited.includes(s);
					}
				}
				this.limitedObj = limitedObj;
				this.limitAll = limitAll;
			},
			deep: true
		},
		type: {
			handler: function(val) {
				for (let key of Object.keys(this.platfromPermission2)) {
					for (let key2 of Object.keys(this.platfromPermission2[key])) {
						this.platfromPermission2[key][key2] = (val && val[key2]) || '00000'
					}
				}
				for (let key of Object.keys(this.platfromPermission3)) {
					for (let key2 of Object.keys(this.platfromPermission3[key])) {
						for (let key3 of Object.keys(this.platfromPermission3[key][key2])) {
							this.platfromPermission3[key][key2][key3] = (val && val[key3]) || '00000'
						}
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
					let secs = this.subPages ? this.subPages[f] : {};
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
			},
			deep: true
		},
		exportLimit: {
			handler: function(val) {
				let exportLimitObj = {};
				let exportLimitAll = {};
				for (let f in this.pageAll) {
					let userExportLimtited = this.exportLimit[f];
					exportLimitObj[f] = {};
					exportLimitAll[f] = !!userExportLimtited;
					let secAll = this.secondAll[f];
					for (let s of secAll) {
						exportLimitObj[f][s] = userExportLimtited && userExportLimtited.includes(s);
					}
				}
				this.exportLimitObj = exportLimitObj;
				this.exportLimitAll = exportLimitAll;
			},
			deep: true
		},
		limitedObj: {
			handler: function() {
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
				var realLimit = this.parseObjectToLimitObj(this.exportLimitObj);
				this.$dispatch('borcastExportLimit', realLimit);
			},
			deep: true
		}
	},
	events: {
		checkboxChange1(obj, val) {
			// 更改2级目录
			let k1 = obj.k1;
			let permission2 = this.platfromPermission2[k1];
			if (permission2) {
				for (let item in permission2) {
					permission2[item] = val
				}
			}
		},
		checkboxChange2(obj, val) {
			// 改为不更改3级目录
			// let permission3 = this.platfromPermission3[obj.k1];
			// if (permission3) {
			// 	permission3 = permission3[obj.id2]
			// 	if (permission3) {
			// 		for (let item in permission3) {
			// 			permission3[item] = val
			// 		}
			// 	}
			// }
			// 判断2级目录
			let permission2 = this.platfromPermission2[obj.k1];
			if (permission2) {
				let all = ['1', '1', '1', '1', '1']
				for (let key of Object.keys(permission2)) {
					if (permission2[key]) {
						permission2[key].split('').forEach((x, index) => {
							if (x !== '1') {
								all[index] = '0'
							}
						})
					} else {
						all = ['0', '0', '0', '0', '0']
					}
				}
				// 赋值1级目录
				this.platfromPermission1[obj.k1] = all.join('');
			}
		},
		checkboxChange3(obj, val) {
			// 改为不判断二级目录
			// let permission3 = this.platfromPermission3[obj.k1][obj.id2];
			// if (permission3) {
			// 	let all = ['1', '1', '1', '1', '1']
			// 	for (let key of Object.keys(permission3)) {
			// 		permission3[key].split('').forEach((x, index) => {
			// 			if (x !== '1') {
			// 				all[index] = '0'
			// 			}
			// 		})
			// 	}	
			// 	// 赋值2级目录
			// 	this.platfromPermission2[obj.k1][obj.id2] = all.join('');
			// }
		}
	}
});

module.exports = LimitList;
</script>


<style scoped>
label {
	margin: 0;
}

label input {
	margin: 0 5px 0 0;
}

.limit_list .clear-all {
    float: right;
    margin-top: 25px;
}

.limit_list h2 {
	display: inline-block;
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
	width: 6%;
}

.con>li span:nth-child(2) {
	width: 12%;
}

.con>li span:nth-child(3) {
	width: 18%;
}
.con>li span:nth-child(4) {
	width: 16%;
}

.con>li span:nth-child(5) {
	width: 34%;
}

.con>li span:nth-child(6) {
	width: 14%;
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