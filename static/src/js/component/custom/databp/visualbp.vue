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
		<button id="search" @click='search' type='button' class='btn ent-btn-blue search-btn btn-primary' data-toggle="popover"   data-content="请输入正确的url">检索页面</button>
	</form>
		<!-- nav -->
	<div id='container' class='main'>
		<div class='tabpanel_content' style='width: 100%; height: 1000px;'>
			<div class='html_content' style='z-index: 2;'>
				<iframe :class="{'pc-iframe': bpConfig.platform === 'PC', 'wap-iframe':  bpConfig.platform === 'H5'}" frameborder='no' border='0' marginwidth='0' marginheight='0' id='tab_baseQuery'  src='{{iframe_url}}' v-on:load="iframeload"></iframe>
			</div>
		</div>
	</div>
</div>
	<m-bpinfo  :loading.sync='loading'></m-bpinfo>
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
					show: false,
					pointName: '',
					platform: 'PC',
					pageUrl: '',
					selector:'',
					privateParam: '',
					publicParam: ''
				}
			}
		},
		ready() {
		},
		route: {
	        activate: function (transition) {
				let query = this.$route.query;   	
	        	let pageUrl = query.pageUrl;
				let platform = query.platform;
				if (pageUrl && platform) {
					this.bpConfig.pageUrl = pageUrl;
					this.bpConfig.platform = platform;
					this.search();
					query.show = true;
					actions.databp(store, query);
				}
				return Promise.resolve(true);
	        }
    	},
		methods: {
			iframeload(ev) {
				// console.log('load');
				let _this = this;
				if (!_this.bpConfig.pageUrl) {
					return false;
				}
				_this.loading.show = false;
				var $iframe = $(ev.path[0]).contents();
				try {
					// 当使用历史前进后退时，修正信息
					let url = $iframe.get(0).location.href;
					let info = url.match(/.+?html\?m=(.+?)&url=(.+?)$/);
					_this.bpConfig.pageUrl = info[2];
					_this.bpConfig.platform = info[1];
				} catch (err) {
					console.log(err);
				}

				var $head = $iframe.find('head'); 
				var $body = $iframe.find('body');
				var hovered = [];
				var selected;
				$head.append('<style> .bphover {outline: 2px solid #0072ff !important;background-color: rgba(105, 210, 249, 0.4) !important;} .bphover-position-fix {position: relative !important;}</style>');
				$body.bind('contextmenu', function(e) {

					if (selected) {
						selected.removeClass('bphover');
					}
					selected = $(e.target);
					selected.removeClass('bphover');
					if (selected.hasClass('bphover-position-fix')) {
						selected.removeClass('bphover-position-fix');
					}
					// 去除css类防止选择器中被加入该类
					var selector = utils.getSelector(e.target);
					if (/static|inherit|initial/.test(window.getComputedStyle(e.target).position)) {
						selected.addClass('bphover-position-fix');
					}
					selected.addClass('bphover');
					_this.bpConfig.selector = selector;
					_this.bpConfig.show = true;
					actions.databp(store, _this.bpConfig);
					e.preventDefault();
				});
				$body.mouseover(
					function(e) {
						for (var i in hovered) {
							hovered[i].removeClass('bphover');
							hovered[i].removeClass('bphover-position-fix');
						}
						hovered.length = 0;
						var $target = $(e.target)
						if(!($target.hasClass('bphover')  || $target.is(selected))) {
							if (/static|inherit|initial/.test(window.getComputedStyle(e.target).position)) {
								$target.addClass('bphover-position-fix');
							}
							$target.addClass('bphover');
							hovered.push($target);
						}
				});
				$body.click(function(e) {
					let $target = $(e.target);
					let href = $target.attr('href') || $target.parents('a').attr('href');
					if (href && href.indexOf('javascript') === -1) {
						_this.bpConfig.pageUrl = href;
						_this.search();
					}
					return false;
				});
			},
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
				var newiframe_url = '/databp/html?m='+this.bpConfig.platform+'&url=' + this.bpConfig.pageUrl;
				if (newiframe_url === _this.iframe_url) {
					_this.loading.show = false;
				}
				_this.iframe_url = newiframe_url;

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
	overflow: hidden;
}
.tabpanel_content .html_content {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
}

.pc-iframe {
	width:100%;
	height:100%;
	display: block;
	background-color: #efefef;
}

.wap-iframe{
	width: 375px;
	height: 667px;
	margin: 10px auto 0;
	display: block;
	background-color: #efefef;
}
</style>
