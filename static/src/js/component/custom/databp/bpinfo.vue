<template>
<div class="mask" v-show="show"   v-on:dragover.stop.prevent="" v-on:drop="drop">
	<div class="infobox" draggable="true"  v-on:dragstart="dragstart" v-bind:style="infopos">
		<div class="closer" title="关闭" @click="show=false"></div>
		<div class="sider-nav ">
			<div class="tabs-container">
				<ul class="nav nav-tabs">
					<li role="presentation" class="active"><a href="#tab_baseinfo" data-toggle="tab" aria-expanded="true">基本信息</a></li> 
					<li role="presentation" class=""><a href="#tab_bpdata" data-toggle="tab" aria-expanded="false">埋点数据</a></li> 
				</ul> 
				<div class="tab-content tabs-content zbgxt-content">
					<div id="tab_baseinfo" class="tab-pane active in">
						<div class="extendinfo">
							<div>
								<label>埋点名称</label>
								<input type='text' class='form-control' placeholder='' v-model="bpConfig.name">
							</div>
							<div><label>选择器</label>{{bpConfig.selector}}</div>
							<div><label>事件类型</label>单击事件</div>
							<div><label>公共埋点Url</label>/shop/${id}.html</div>
							<div><label>公共埋点信息</label>{{publicBpStr}} <button @click="bpConfig.publicBp.push(['', ''])">+</button></div>
							<div>
								<div v-for="(i,item) in bpConfig.publicBp" class="pair">
									key
									<input type='text' class='form-control' placeholder='' v-model="item[0]">
									value
									<input type='text' class='form-control' placeholder='' v-model="item[1]">
									<button @click="bpConfig.publicBp.splice(i,1)">-</button>
								</div>
							</div>
							<div>
								<label>私有埋点信息</label>{{privateBpStr}}  <button @click="bpConfig.privateBp.push(['', ''])">+</button>
								<div v-for="(i,item) in bpConfig.privateBp" class="pair">
									key<input type='text' class='form-control' placeholder='' v-model="item[0]">
									value<input type='text' class='form-control' placeholder='' v-model="item[1]">
									<button  @click="bpConfig.privateBp.splice(i,1)">-</button>
								</div>
							</div>
						</div>
					</div> 
					<div id="tab_bpdata" class="tab-pane fade">

						<div class="extendinfo">
						TODO
						</div>
					</div> 
				</div>
				<button class="btn btn-success save">保存埋点</button>
			</div>
		</div>
	</div>
</div>

<!-- <div class="mask"> </div> -->
</template>

<script>
var Vue = require('Vue');
var databp = Vue.extend({
	data: function() {
		return {
			dragpos: {},
			mask: false,
			infopos: {
				top: '80px',
				left: 'inherit'
			}
		}
	},
	computed:  {
		publicBpStr() {
			return this.bpConfig.publicBp.filter(function(a) {
				return (a[0] && a[1]);
			}).map(function(a) {
				return a.join('=');
			}).join('&');
		},
		privateBpStr() {
			return this.bpConfig.privateBp.filter(function(a) {
				return (a[0] && a[1]);
			}).map(function(a) {
				return a.join('=');
			}).join('&');
		}
	},
	props:['show', 'bpConfig'],
	methods: {
		dragstart(e) {
			e.dataTransfer.effectAllowed = "move";  //移动效果
	        e.dataTransfer.setData("text", '');  //附加数据，　没有这一项，firefox中无法移动
	        this.dragpos.x = e.offsetX || ev.clientX - $(ev.target).offset().left;
    		this.dragpos.y = e.offsetY || ev.clientY - $(ev.target).offset().top;
    		this.mask = true;
		},
		drop(e) {
			this.infopos.left = (e.clientX - this.dragpos.x) + 'px';
	        this.infopos.top = (e.clientY - this.dragpos.y) + 'px';
	        this.mask = false;
	        e.preventDefault() || e.stopPropagation(); 
		}
	}

});
module.exports = databp;
</script>


<style scoped>
.mask {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
    z-index: 100;
}
.infobox {
	width: 350px;
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
	z-index: 9999;
}

.closer {
	transition: transform .3s;
	border-radius: 50%;
	position: absolute;
	right: 6px;
	top: 5px;
	display: block;
	width: 18px;
	height: 18px;
	border: 1px solid transparent;
	background: url(/dist/img/sprites.png) no-repeat;
	background-position: -36px 4px;
	overflow: hidden;
	cursor: pointer;
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
	min-width: 80px;
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
</style>