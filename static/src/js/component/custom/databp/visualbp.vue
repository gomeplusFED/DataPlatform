<template>
   <div class='page-content'>
	<form class='form-inline'>
		<div class='form-group'>
			<label>埋点URL</label>
			<input type='text' class='form-control' placeholder='' v-model="input_url">
		</div>
		<div class='form-group'>
			<label>平台</label>
			<select v-model="platform">
				<option value=0>PC</option>
				<option value=1>H5</option>
			</select>
		 </div>
		<button @click='search' type='button' class='btn ent-btn-blue search-btn '>检索页面</button>
	</form>
		<!-- nav -->
		<div class="infobox" v-show="showConfig">
			<div class="closer" title="关闭" @click="showConfig=false"></div>
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
									<input type='text' class='form-control' placeholder='' value=''>
								</div>
								<div><label>URL信息</label>http://www.gomeplus.com/shop</div>
								<div><label>事件类型</label>单击事件</div>
								<div><label>公共埋点Url</label>/shop/${id}.html</div>
								<div><label>公共埋点信息</label>name=123&shopid=${id} <button>+</button></div>
								<div>
									<label>公共埋点方式</label><label><input type="radio" name="sex" value="male" checked>追加</label> <label><input type="radio" name="sex" value="male" checked>覆盖</label>
									<div class="pair">key<input type='text' class='form-control' placeholder='' value=''>value<input type='text' class='form-control' placeholder='' value=''><button>+</button></div>
								</div>
								<div>
									<label>私有埋点信息</label>rm=ok&flag=true <button>+</button>
									<div class="pair">key<input type='text' class='form-control' placeholder='' value=''>value<input type='text' class='form-control' placeholder='' value=''><button>+</button></div>
								</div>
							</div>
						</div> 
						<div id="tab_bpdata" class="tab-pane fade">

							<div class="extendinfo">
							TODO
							</div>
						</div> 
					</div>
				</div>
			</div>
		</div>
		<div id='container' class='main'>
			<div class='tabpanel_content' style='width: 100%; height: 1000px;'>
				<div class='html_content' style='z-index: 2;'>
					<iframe frameborder='no' border='0' marginwidth='0' marginheight='0' id='tab_baseQuery'  src='{{iframe_url}}'></iframe>
				</div>
			</div>
		</div>
		
	</div>
	<m-loading :loading.sync='loading'></m-loading>
</template>
<script>
	var Vue = require('Vue');
	Vue.config.debug = true;
	var $ = require('jQuery');

	var Loading = require('../../common/loading.vue');
	var DatePicker = require('../../common/datePicker.vue');
	var FilterSelect = require('../../common/filterSelect.vue');
	
	var databp = Vue.extend({
		name: 'databp',
		components: {
			'm-loading': Loading,
			'm-filter-select': FilterSelect,
			'm-date': DatePicker
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
				bpConfig: {

				},
				showConfig: false

			}
		},
		ready() {

		},
		methods: {
			search() {
				var _this = this;
				_this.loading.show = true;
				this.iframe_url = '/databp/html?m='+this.platform+'&url=' + this.input_url;
				console.log(this.iframe_url);
				$('iframe').load(function(){
					_this.loading.show = false;
					var $iframe = $(this).contents();
					var $head = $iframe.find('head'); 
					var $body = $iframe.find('body');
					var hovered = [];
					$head.append('<style> .bphover {outline: 5px solid #0072ff;}</style>');
					$body.bind('contextmenu', function(e) {
						// console.log(e.target);
						_this.showConfig = true;
						e.preventDefault();

					});
					$body.mouseover(
						function(e) {
							for (var i in hovered) {
								hovered[i].removeClass('bphover');
							}
							var $target = $(e.target)
							$target.addClass('bphover');
							hovered.push($target);
						});
				});

			}

		}
	});
	module.exports = databp;
</script>
<style scoped>
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
	top: 80px;
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
	height: calc(100% - 40px);
}

.extendtitle {
	margin-left: 10px;
}
.extendtitle h4 {
	border-left: 3px solid #d40902;
	padding-left: 10px;
	margin-bottom: 0px;
	margin-top: 0px;
}
.extendtitle > em {
	background: #fd8609;
	border-radius: 7.5px;
	position: relative;
	left: -20px;
	top: -15px;
	min-width: 45px;
	height: 18px;
	font-size: 12px;
	line-height: 18px;
	float: right;
}
.extendinfo {
	max-height: 400px;
	overflow-y: auto;
	margin-left: 20px;
	margin-bottom: 20px;
}
.mergedinfo {
	margin-bottom: 0 !important;
}
.reginfo{
	background-color: #f2f2f2;
	width: 212px;
	overflow: hidden;
	margin-bottom:10px;
}
.reginfo div{
	margin: 18px 10px 18px 20px;
}
.reginfo div p{
	margin-bottom:12px;
}

.mergedinfo:hover{
	background:#f8f8f8;
	border:1px solid #e2e2e2;
}
.blueItem{
	border-left: 3px solid #0072ff;
	margin-left:-10px;
	padding-left: 10px;
}
.clickItem{
	color:#0072ff;
	cursor:pointer;
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
