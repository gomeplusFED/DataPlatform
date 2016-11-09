<template>
<div class='page-content'>
	<form class='form-inline'>
		<div class='form-group'>
			<label>埋点URL</label>
			<input type='text' class='form-control' placeholder='' v-model="bpConfig.pageUrl" @keyup.enter.stop.prevent="search">
		</div>
		<div class='form-group'>
			<label>平台</label>
			<select v-model="bpConfig.platform">
				<option value='PC'>PC</option>
				<option value='H5'>H5</option>
			</select>
		 </div>
		<button id="search" @click='search' type='button' class='btn ent-btn-blue search-btn' data-toggle="popover"   data-content="请输入正确的url">检索页面</button>
	</form>
		<!-- nav -->
	<div id='container' class='main'>
		<div class='tabpanel_content' style='width: 100%; height: 1000px;'>
			<div class='html_content' style='z-index: 2;'>
				<iframe  frameborder='no' border='0' marginwidth='0' marginheight='0' id='tab_baseQuery'  src='{{iframe_url}}'></iframe>
			</div>
		</div>
	</div>
</div>
	<m-bpinfo :show.sync = "showConfig" :bp-config = "bpConfig" :loading.sync='loading'></m-bpinfo>
	<m-loading :loading.sync='loading'></m-loading>
	<m-alert></m-alert>
</template>
<script>
	var Vue = require('Vue');
	Vue.config.debug = true;
	var $ = require('jQuery');
	var utils = require('utils');
	var api = require('./api');
	var Loading = require('../../common/loading.vue');
	var Alert = require('../../common/alert.vue');
	var bpInfo = require('./bpinfo.vue');
	var store = require('../../../store/store.js');
	var actions = require('../../../store/actions.js');
	
	var databp = Vue.extend({
		name: 'databp',
		components: {
			'm-loading': Loading,
			'm-alert': Alert,
			'm-bpinfo': bpInfo
		},
		store: store,
		data: function() {
			return {
				iframe_url: '',
				loading: {
					show: false,
					noLoaded: 0
				},
				bpConfig: {
					pointName: '',
					platform: 'PC',
					pageUrl: '',
					selector:'',
					privateParam: '',
					publicParam: ''
				},
				showConfig: false
			}
		},
		ready() {

		},
		methods: {
			search(ev) {
				var _this = this;
				var url = this.bpConfig.pageUrl;
				if(!/https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(url)) {
					var $ele =  $('#search');
					$ele.popover('show');
					setTimeout(function () { $ele.popover("destroy"); }, 1000);
					return false;
				}
				_this.loading.show = true;
				var newiframe_url = '/databp/html?m='+this.platform+'&url=' + this.bpConfig.pageUrl;
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
					var selected;
					$head.append('<style> .bphover {outline: 5px solid #0072ff; !important}</style>');
					$body.bind('contextmenu', function(e) {

						if (selected) {
							selected.removeClass('bphover');
						}
						selected = $(e.target);
						selected.removeClass('bphover');
						// 去除css类防止选择器中被加入该类
						var selector = utils.getSelector(e.target);
						selected.addClass('bphover');
						_this.bpConfig.selector = selector;
						_this.showConfig = true;
						e.preventDefault();
					});
					$body.mouseover(
						function(e) {
							for (var i in hovered) {
								hovered[i].removeClass('bphover');
							}
							hovered.length = 0;
							var $target = $(e.target)
							if(!($target.hasClass('bphover')  || $target.is(selected))) {
								$target.addClass('bphover');
								hovered.push($target);
							}
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


</style>
