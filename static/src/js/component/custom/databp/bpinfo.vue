<template>
<div class="mask" v-show="bpConfig.show"   v-on:dragover.stop.prevent="" v-on:drop.stop.prevent="drop" @click="warning">
	<div class="infobox" :draggable="draggable"  v-on:dragstart="dragstart" v-on:drag.stop.prevent="draging" v-bind:style="infopos">
		<div class="closer" title="关闭" @click="hide">&times;</div>
		<div class="sider-nav ">
			<div class="tabs-container">
				<ul class="nav nav-tabs">
					<li role="presentation" class="active"><a href="#tab_baseinfo" data-toggle="tab" aria-expanded="true">基本信息</a></li> 
					<li role="presentation" class=""><a href="#tab_bpdata" data-toggle="tab" aria-expanded="false">埋点数据</a></li> 
				</ul> 
				<div class="tab-content tabs-content zbgxt-content">
					<div id="tab_baseinfo" class="tab-pane active in">
						<div class="extendinfo" @focusin="setDraggable(false)" @focusout="unfocus">
							<div>
								<label>埋点名称</label>
								<input type='text' class='form-control' placeholder='' v-model="config.pointName">
							</div>
							<div><label>选择器</label>{{config.selector}}</div>
							<div><label>事件类型</label>单击事件</div>
							<div><label>匹配模式</label>{{config.pattern}}</div>
							<div class="type-filter"><label>是否模块</label>
								<button @click="config.type = 'block'" :class="{'active': (config.type === 'block')}">是</button>
								<button @click="config.type = 'point'" :class="{'active': (config.type !== 'block')}">否</button></div>
							<div><label>全局埋点信息</label>{{publicBpStr}} <button @click="publicBp.push(['', ''])">+</button></div>
							<div>
								<div v-for="(i,item) in publicBp" class="pair">
									key
									<input type='text' class='form-control' placeholder='' v-model="item[0]">
									value
									<input type='text' class='form-control' placeholder='' v-model="item[1]" @click="showDropDown(item, $event)">
									<button @click="publicBp.splice(i,1)">-</button>
								</div>
							</div>
							<div>
								<label>独立埋点信息</label>{{privateBpStr}}  <button @click="privateBp.push(['', ''])">+</button>
								<div v-for="(i,item) in privateBp" class="pair">
									key<input type='text' class='form-control' placeholder='' v-model="item[0]" >
									value
									<input type='text' class='form-control' placeholder='' v-model="item[1]">

									<button  @click="privateBp.splice(i,1)">-</button>
								</div>
							</div>
						</div>
						<div class="value-list" v-show="selectpos.show" v-bind:style="selectpos">
							<ul>
								<li @click="selectVal('${id}')">${id}</li>
							</ul>
						</div>
					</div> 
					<div id="tab_bpdata" class="tab-pane fade">

						<div class="extendinfo">
						TODO
						</div>
					</div> 
				</div>
				<button class="btn btn-success save" @click="save" data-toggle="popover">{{config.pointId ? '更新埋点' : '保存埋点'}}</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
var Vue = require('Vue');
var api = require('./lib/api.js');
var bpinfo = Vue.extend({
	data: function() {
		return {
			dragpos: {},
			draggable: true,
			userInfo: null,
			config: {
				pointId: null,
				pointName: '',
				pattern: '',
				platform: 'PC',
				type: '',
				pageUrl: '',
				selector:'',
				privateParam: '',
				publicParam: ''
			},
			mask: false,
			infopos: {
				top: '80px',
				left: 'inherit'
			},
			selectpos: {
				show: false,
				top: '0',
				left: 'inherit'
			},
			selected: {
				input: null,
				item: null
			},
			publicBp: [['','']],
			privateBp: [['','']]
		}
	},
	computed:  {
		publicBpStr: {
			get() {
				return this.publicBp.filter(function(a) {
					return (a[0] && a[1]);
				}).map(function(a) {
					return a.join('=');
				}).join('&');
			},
			set(newValue) {
				if (!newValue) {
					this.publicBp = [['','']];
					return;
				}
				var _this = this;
				_this.publicBp.length = 0;
				var pairs = newValue.split('&');
				pairs.forEach(function(p) {
					var pa = p.split('=');
					if( pa.length === 2 ){
						_this.publicBp.push([pa[0], pa[1]]);
					}
				});
			}
		},
		privateBpStr: {
			get() {
				return this.privateBp.filter(function(a) {
					return (a[0] && a[1]);
				}).map(function(a) {
					return a.join('=');
				}).join('&');
			},
			set(newValue) {
				if (!newValue) {
					this.privateBp = [['','']];
					return;
				}
				var _this = this;
				_this.privateBp.length = 0;
				var pairs = newValue.split('&');
				pairs.forEach(function(p) {
					var pa = p.split('=');
					if( pa.length === 2 ){
						_this.privateBp.push([pa[0], pa[1]]);
					}
				});
			}
		}
	},
	props:['loading', 'bpConfig'],
	created() {
		this.$watch('bpConfig.trigger', function (val) {
			if (this.bpConfig.show) {
				this.init();
			}
		});
		let {name, username, email, department} = window.allPageConfig.userInfo;
		this.userInfo = {name, username, email, department};
	},
	methods: {
		setDraggable(val) {
			this.draggable = val;
		},
		unfocus() {
			this.setDraggable(true);
			setTimeout(() => {
				this.selectpos.show = false;
			}, 100);
		},
		init() {
			this.loading.show = true;
			var _this = this;
			api.getBp(_this.bpConfig).then(function(data) {
				let keys = Object.keys(data);
				for (let key of keys) {
					if(data[key] === '') {
						_this.config[key] = _this.bpConfig[key];
					} else {
						_this.config[key] = data[key];
					}
				}
				// show the config window
				_this.publicBpStr = data.publicParam;			
				_this.privateBpStr = data.privateParam;
				_this.loading.show = false;
			}).catch(function(err) {
				console.log(err);
				_this.loading.show = false;
			});
		},
		hide() {
			this.bpConfig.show = false;
		},
		showDropDown(item, e) {

			this.selected.item = item;
			if (this.selectpos.show === false || (e.target && this.selected.input !== e.target)) {
				let offset = $(e.target).position();
				this.selectpos.top = `calc(${offset.top}px + ${this.infopos.top} + 30px)`;
				if(this.infopos.left === 'inherit') {
					this.selectpos.right = `120px`;
				} else {
					this.selectpos.left = `calc(${offset.left}px + ${this.infopos.left})`;
					this.selectpos.right = `inherit`;
				}
				this.selectpos.show = true;
				this.selected.input = e.target;
			} else {
				this.selectpos.show = false;
			}
		},
		selectVal(val) {
			this.selected.item.$set(1, val);
			this.selectpos.show = false;
		},
		dragstart(e) {
			e.dataTransfer.effectAllowed = "move";  //移动效果
			e.dataTransfer.setData("text", '');  //附加数据，　没有这一项，firefox中无法移动
			this.dragpos.x = e.offsetX || e.clientX - $(e.target).offset().left;
			this.dragpos.y = e.offsetY || e.clientY - $(e.target).offset().top;
			this.mask = true;
		},
		draging(e) {
			let newx = e.clientX - this.dragpos.x;
			let newy = e.clientY - this.dragpos.y;
			if(newx > 0 && newy > 0) {
				this.infopos.left = newx + 'px';
				this.infopos.top = newy + 'px';
			}
		},
		drop(e) {
			e.preventDefault() || e.stopPropagation(); 
		},
		warning(e){
			if(e.path[0].className === 'mask') {
				actions.alert(store, {
					show: true,
					msg: '请关闭埋点窗口后操作',
					type: 'warning'
				});
			}
		},
		save(ev) {
			let $save = $(ev.target);
			if(this.config.pointName === '' || this.config.pointName == null) {
				$save.popover({
					content: '请输入名称'
				});
				setTimeout(function () { $save.popover("destroy"); }, 1000);
				$save.popover('show');
				return false;
			}
			var _this = this;
			var existKeys = {};
			var allbps = [..._this.publicBp, ..._this.privateBp];
			let illegal = /[=&]/;
			for(let a of allbps) {
				if (existKeys[a[0]]) {
					$save.popover({
						content: '请检查重复key'
					});
					$save.popover('show');
					setTimeout(function () { $save.popover("destroy"); }, 1000);
					return false;
				} else {
					if(illegal.test(a[0]) || illegal.test(a[1])) {
						$save.popover({
							content: '含有非法字符，请检查'
						});
						$save.popover('show');
						setTimeout(function () { $save.popover("destroy"); }, 1000);
						return false;
					}
					existKeys[a[0]] = 1;
				}
			}
			_this.config.publicParam = _this.publicBpStr;
			_this.config.privateParam = _this.privateBpStr;
			_this.config.userInfo = JSON.stringify(_this.userInfo);
			if (_this.config.pointId) {
				api.updateBp(_this.config).then(function(res) {
					// 更新成功刷新传入的数据
					_this.bpConfig.show = false;
					// _this.bpConfig = _this.config;
					// actions.databp(store, _this.config);
				});
			} else {
				api.saveBp(_this.config).then(function() {
					_this.bpConfig.show = false;
					// _this.bpConfig = _this.config;
					// actions.databp(store, _this.config);
				});
			}
		}
	}

});
module.exports = bpinfo;
</script>


<style scoped>
::-webkit-scrollbar {
	width: 8px;
	height: 10px;
	background: #eee;
}
::-webkit-scrollbar-thumb {
	height: 50px;
	background-color: #ccc !important;
	-webkit-border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
}
::-webkit-scrollbar-track-piece {
	-webkit-border-radius: 0;
}
.mask {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	z-index: 100;
	cursor: auto;
}
.infobox {
	cursor: auto;
	width: 360px;
	height: 550px;
	float: left;
	background-color: #fff;
	border: 1px solid #ccc;
	box-shadow: 1px 1px 8px 1px rgba(0,0,0,.2);
	position: fixed;
	right: 50px;
	font-size: 12px;
	color: rgb(100, 100, 100);
	line-height: 1.5;
	word-break: break-all;
	z-index: 200;
}
.popover {
	z-index: 300
}
.closer {
    position: absolute;
    right: 8px;
    cursor: pointer;
    font-size: 17px;
}

.type-filter button {
	display: inline-block;
    vertical-align: middle;
    border: 1px solid #cacaca;
    color: #333;
    padding: 2px 12px;
    background: #fff;
    font-size: 12px;
    outline: none;
    margin-left: -3px;
    transition: all ease 0.2s;
    -webkit-transition: all ease 0.2s;
}

.type-filter button.active {
    background: #3389d4;
    border: 1px solid #3389d4;
    color: #fff;
}
#tab_baseinfo input[type='text'] {
	max-width: 180px;
	display: inline-block;
	max-height: 30px;
}
#tab_baseinfo .pair {
	margin-top: 10px;
}
#tab_baseinfo .pair input {
	max-width: 80px;
	margin-right: 20px;
	margin-left: 10px;
}
#tab_baseinfo div > label{
	font-weight: normal;
	margin-right: 10px;
}
#tab_baseinfo div > label:first-child {
	font-weight: bold; 
	min-width: 50px;
}

#tab_baseinfo > .extendinfo > div {
	margin-bottom: 5px;
}

.sider-nav {
	width: 100%;
	height: 100%;
	background: #fff;
	padding: 10px;
}

.nav-tabs {
	width: 100%;
}

.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {
	color: #555;
	cursor: default;
	background-color: #fff;
	border-bottom-color: transparent;
}
.nav>li>a:focus, .nav>li>a:hover {
	text-decoration: none;
	background-color: #eee;
}
.nav-tabs>li>a {
	margin-right: 2px;
	line-height: 1.42857143;
	border: 1px solid transparent;
	border-radius: 4px 4px 0 0;
	min-width: 80px;
	text-align: center;
	color:#555;
	background:#f2f2f2;
	border: 1px solid #ddd;
}
.nav>li{
	width: 33.3333%;
}
.nav>li>a {
	position: relative;
	display: block;
	padding: 10px 0;
}
.tabs-container{
	width: 100%;
	height: 100%;
}
.tabs-content {
	border: 1px solid #ccc;
	border-top: 0;
	padding: 20px 0 0 0;
	height: calc(100% - 90px);
}
.extendinfo {
	max-height: 400px;
	overflow-y: auto;
	margin-left: 20px;
	margin-bottom: 20px;
}
button.save {
	margin: 8px auto;
	display: block;
}
.closed{
   background-color: #ccc !important;
}

.zbgxt-content .content {
	padding: 10px;
}
.zbgxt-content .title2 {
	font-size: 15px;
	line-height: 20px;
	height: 20px;
	margin-bottom: 10px;
	margin-left: 10px;
	border-left: 2px solid #d40902;
}
.value-list {
	position: fixed;
	margin-left: 10px;
	min-width: 80px;
	border: 1px solid #ccc;
	background-color: #fff;
	border-radius: 4px;
}
.value-list ul {
	margin-bottom: 0;
}
.value-list li {
	padding-left: 10px;
	font-size: 14px;
}
.value-list li:hover {
	background-color: #eee;
}
</style>
