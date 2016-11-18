<template>
<div class='page-content'>
	<form class='form-inline'>
		<div class='form-group'>
			<label>热点URL</label>
			<input type='text' class='form-control' placeholder='' v-model="input_url">
		</div>
		<div class='form-group'>
			<label>平台</label>
			<select v-model="platform">
				<option value=0>PC</option>
				<option value=1>H5</option>
			</select>
		 </div>
		<button @click='search' type='button' class='btn ent-btn-blue search-btn '>查询</button>
	</form>
		<!-- nav -->
	<div id='container' class='main'>
		<div class='tabpanel_content' style='width: 100%; height: 1000px;'>
			<div class='html_content' style='z-index: 2;'>
				<iframe  frameborder='no' border='0' marginwidth='0' marginheight='0' id='tab_baseQuery'  src='{{iframe_url}}'></iframe>
			</div>
		</div>
	</div>
	<div class="mask" v-show="mask"> </div>
</div>
	<m-loading :loading.sync='loading'></m-loading>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');
	var utils = require('utils');
	var api = require('./api');
	var Loading = require('../../common/loading.vue');
	
	var databp = Vue.extend({
		name: 'databp',
		components: {
			'm-loading': Loading
		},
		data: function() {
			return {
				iframe_url: '',
				input_url: '',
				platform: 0,
				loading: {
					show: false,
					noLoaded: 0
				},
				publicBp: [['','']],
				privateBp: [['','']],
				bpConfig: {
					name: '',
					selector:''
				},
				showConfig: false,
				dragpos: {},
				mask: false,
				infopos: {
					top: '80px',
					left: 'inherit'
				}
			}
		},
		ready() {
			// delete after completed
			this.input_url = 'https://www.gomeplus.com/others/storeType.html';
			this.search();
		},
		methods: {
			search() {
				var _this = this;
				_this.loading.show = true;
				var newiframe_url = '/databp/html?m='+this.platform+'&url=' + this.input_url;
				if (newiframe_url === _this.iframe_url) {
					_this.loading.show = false;
				}
				_this.iframe_url = newiframe_url;
				
				$('iframe').load(function(){
					_this.loading.show = false;
					var $iframe = $(this).contents();
					var $head = $iframe.find('head'); 
					var $body = $iframe.find('body');
					var hovered = [];
					var selected = 'html > body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li:first-child+li+li+li+li+li+li > a';
					var $elem = $iframe.find(selected);
					var offset = $elem.offset();
					var width = $elem.width();
					var height = $elem.height();
					var centerX = offset.left + width / 2;
					var centerY = offset.top + height / 2;
					// var svghtml = `<svg style="z-index:9999;position:absolute;top:${centerY}px;left:${centerX}px;">
					// 		<defs id='defs'>
					// 			<radialGradient id="glow" cx="50%" cy="50%" r="50%"
					// 			fx="50%" fy="50%">
					// 				<stop offset="0%" style="stop-color:rgb(0,0,255);
					// 				stop-opacity:1"/>
					// 				<stop offset="80%" style="stop-color:rgb(0,255,0);
					// 				stop-opacity:1"/>
					// 				<stop offset="100%" style="stop-color:rgb(255,255,255);
					// 				stop-opacity:0"/>
					// 			</radialGradient>
					// 		</defs>
					// 		<g id="point" class="point" style="fill:url(#glow)">
					// 			<circle x="15" y="15"  r="30"></circle>
					// 		</g>
					// 	</svg>`
					var value = 100;
					var html = `<div id= "bpmask" style ="z-index:9999;height:${value}px;width:${value}px; position:absolute;top:${centerY-value/2}px;left:${centerX-value/2}px;background: radial-gradient(red, yellow 20%, #1E90FF 30%, rgba(255,255,255,0) 50%);"> </div>` 
					$body.append(html);

				});
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
    left: 0;
    z-index: 100;
}
.form-inline {
	border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}
.form-inline .form-group {
    margin-right: 40px;
}
.form-inline input {
	width: 350px;
}
.tabpanel_content {
	position: relative;
	z-index: 2;
	background-color: #efefef;
	overflow: hidden;
}
.tabpanel_content .html_content {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	background-color: #efefef;
}
iframe {
	width:125%;
	height:125%;
	border:none;
	-ms-zoom: 0.8;
	-moz-transform: scale(0.8);
	-moz-transform-origin: 0 0;
	-o-transform: scale(0.8);
	-o-transform-origin: 0 0;
	-webkit-transform: scale(0.8);
	-webkit-transform-origin: 0 0;
}

/*弹出层*/

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

.companyItem > em {
	background-color: #e80000;
	border-radius: 3px;
	width: 45px;
	height: 25px;
	font-size: 14px;
	line-height: 25px;
	float: right;
	margin: -3px 0 0 10px;
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
.ul-list04 {
	font-size: 12px;
	text-align: left;
}
.ul-list04 li {
	background: #f2f2f2;
	margin-bottom: 4px;
	padding: 10px;
	border-radius: 6px;
}
.ul-list04 li p {
	margin-left: 10px;
	line-height: 20px;
	color: #6e6e6e;
}


</style>
