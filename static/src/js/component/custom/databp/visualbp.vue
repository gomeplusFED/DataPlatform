<template>
<div class='page-content'>
	<form class='form-inline'>
		<div class='form-group'>
			<label>埋点URL</label>
			<input type='text' class='form-control' placeholder='' v-model="bpConfig.pageUrl" @keydown.enter.stop.prevent="searchClick">
		</div>
		<div class='form-group'>
			<label>平台</label>
			<select class="form-control" v-model="bpConfig.platform">
				<option value='PC'>PC</option>
				<option value='H5'>H5</option>
			</select>
		 </div>
		<button id="search" @click='searchClick' type='button' class='btn ent-btn-blue search-btn btn-primary' data-toggle="popover"   data-content="请输入正确的url">检索页面</button>
	</form>
		<!-- nav -->
	<div id='container' class='main'>
		<div class='tabpanel_content' style='width: 100%; height: 1000px;'>
			<div class='html_content' style='z-index: 2;'>
				<iframe :class="{'pc-iframe': bpConfig.platform === 'PC', 'wap-iframe':  bpConfig.platform === 'H5'}" frameborder='no' border='0' marginwidth='0' marginheight='0' id='iframenode'  src='{{iframe_url}}' v-on:load="iframeload"></iframe>
			</div>
		</div>
	</div>
</div>
	<m-bpinfo  :loading.sync='loading' :bp-config.sync='bpConfig'></m-bpinfo>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');
	var getSelector = require('./lib/selector.js').getSelector;
	var api = require('./lib/api.js');
	var Alert = require('common/alert.vue');
	var bpInfo = require('./bpinfo.vue');
	
	var visualbp = Vue.extend({
		name: 'databp',
		components: {
			'm-alert': Alert,
			'm-bpinfo': bpInfo
		},
		props:['loading'],
		data: function() {
			return {
				iframe_url: '',
				iframe_node: null,
				bpConfig: {
					show: false,
					trigger: false,
					pointName: '',
					platform: 'PC',
					pageUrl: '',
					selector:'',
					type: 'point'
				}
			}
		},
		ready() {
			this.iframe_node = document.getElementById('iframenode');
		},
		route: {
	        activate: function (transition) {
	        	this.activate(this.$route.query);
				return Promise.resolve(true);
	        },
	        deactivate: function() {
	        	this.bpConfig.show = false;
	        	// actions.databp(store, {show: false});
	        }
    	},
    	events: {
    		'visual_url': function (config) {
		    	this.activate(config);
		    }
    	},
		methods: {
			activate(query) {
	        	this.loading.show = true;	
	        	let pageUrl = query.pageUrl;
				let platform = query.platform;
				if (pageUrl && platform) {
					if(query.selector) {
						this.bpConfig.selector = query.selector;
						this.bpConfig.type = query.type;
						this.bpConfig.pointName = query.pointName;
						this.trigger();
						// actions.databp(store, query);
					}
					this.bpConfig.pageUrl = pageUrl;
					this.bpConfig.platform = platform;
					this.search(true);
				} else if (this.iframe_url === '') {
					this.loading.show = false;
				}
			},
			trigger() {
				this.bpConfig.trigger = !this.bpConfig.trigger;
				this.bpConfig.show = true;
			},
			resetConfig() {
				this.bpConfig.pointName = '';
				this.bpConfig.selector = '';
				this.bpConfig.type = 'point';
			},
			iframeload() {
				// console.log('load');
				let _this = this;
				if (!_this.bpConfig.pageUrl) {
					return false;
				}
				_this.loading.show = false;
				let iframenode = this.iframe_node;
				let $iframe = $(iframenode).contents();



				// 修正重定向
				let $iframewin = iframenode.contentWindow;
				let _newurl= $iframewin.$pageUrl;
				// 修复最后无/
				if(_newurl.match(/^https:\/\/[^\/]+?\//)) {
					_this.bpConfig.pageUrl = _newurl;
				} else {
					_this.bpConfig.pageUrl = _newurl + '/';
				}
				_this.bpConfig.platform = $iframewin.$platform;


				_this.$dispatch('visualbp_loaded', _this.bpConfig);
				var $head = $iframe.find('head'); 
				var $body = $iframe.find('body');
				if(/visualbp/.test(this.$route.path)) {

					var hovered = [];
					var selected;
					$head.append('<style> .bphover {outline: 2px solid #0072ff !important;background-color: rgba(105, 210, 249, 0.4) !important;} .bphover-position-fix {position: relative !important;}</style>');
					let queryselected;
					if ((queryselected = _this.$route.query) && (queryselected = queryselected.selector)) {
						let $target = $iframe.find(queryselected);
						let $node;
						if ($node = $target.get(0)) {
							if (/static|inherit|initial/.test(window.getComputedStyle($node).position)) {
								$target.addClass('bphover-position-fix');
							}
							$target.addClass('bphover');
							hovered.push($target);
							let elemtop = $target.offset().top - 10;
							let maxtop = $iframe.height() - $($iframewin).height();
							if(elemtop >  maxtop) {
								$body.animate({
				                    scrollTop: maxtop
				                }, 2000);
								$('html body').animate({
				                    scrollTop: elemtop - maxtop
				                }, 2000);
							} else {
								$body.animate({
				                    scrollTop: elemtop
				                }, 2000);
								$('html body').animate({
				                    scrollTop: 0
				                }, 2000);
							}
						}
					}
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
						var selector = getSelector(e.target);
						if (/static|inherit|initial/.test(window.getComputedStyle(e.target).position)) {
							selected.addClass('bphover-position-fix');
						}
						selected.addClass('bphover');
						_this.resetConfig();
						_this.bpConfig.selector = selector;
						_this.trigger();
						// actions.databp(store, _this.bpConfig);
						e.preventDefault();
					});
					$body.bind('dragend', function(e){
						let $target = $(e.target);
						$target.parent().attr('draggable', 'true');
						$(e.target).css('visibility','hidden');
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
				}

				$body.click(function(e) {
					let $target = $(e.target);
					let href = $target.attr('href') || $target.parents('a').attr('href');
					if (href && href.indexOf('javascript') === -1) {
						_this.bpConfig.pageUrl = href;
						_this.searchClick();

					}
					return false;
				});

			},
			searchClick() {
				var url = this.bpConfig.pageUrl;

				if(!/https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(url)) {
					var $ele =  $('#search');
					$ele.popover('show');
					setTimeout(function () { $ele.popover("destroy"); }, 1000);
					return false;
				}
				this.$router.go({
					path: this.$route.path.split('?')[0],
					query: {pageUrl: url,
							platform: this.bpConfig.platform
					}
				});

				this.search();
			},
			search(forceloading = false) {
				this.loading.show = true;
				var newiframe_url = '/databp/html?m='+this.bpConfig.platform+'&url=' + this.bpConfig.pageUrl;
				if (newiframe_url === this.iframe_url && !forceloading) {
					this.loading.show = false;
					this.$dispatch('search_clicked', this.bpConfig);
					
				}
				this.iframe_url = newiframe_url;
				setTimeout(() => {
					if(this.loading.show) {
						if (window.stop) {
						    window.stop();
						} else {
						    document.execCommand('Stop'); // MSIE
						}
						this.iframeload();
						this.loading.show = false;
					}
			    }, 10000);
			}
		}
	});
	module.exports = visualbp;
</script>
<style scoped>
.form-inline {
	border-bottom: 1px solid #eee;
	padding-bottom: 10px;
}
.form-inline .form-group {
	margin-right: 20px;
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
/*	width:100%;
	height:100%;*/
	display: block;
	background-color: #efefef;
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
	overflow-y: scroll;
}

.wap-iframe{
	width: 375px;
	height: 667px;
	margin: 10px auto 0;
	display: block;
	background-color: #efefef;
}
</style>
