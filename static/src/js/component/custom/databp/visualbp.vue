<template>
<div class='page-content'>
	<form class='form-inline'>
		<div class='form-group'>
			<label>埋点URL</label>
			<input type='text' class='form-control' placeholder='' id="page-url" data-content="请输入网址" v-model="bpConfig.pageUrl" @keydown.enter.stop.prevent="searchClick">
		</div>
		<div class='form-group'>
			<label>平台</label>
			<select class="form-control" v-model="bpConfig.platform">
				<option value='PC'>PC</option>
				<option value='H5'>H5</option>
			</select>
		 </div>
		<slot name="extend-nav"></slot>
		<button id="search" @click='searchClick' type='button' class='btn btn-primary' data-toggle="popover"   data-content="请输入正确的url">检索页面</button>
	</form>
	<slot name="data-table"></slot>
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
    var api = require('./api');
    var Alert = require('common/alert.vue');
    var bpInfo = require('./bpinfo.vue');
    var visualbp = Vue.extend({
        name: 'databp',
        components: {
            'm-alert': Alert,
            'm-bpinfo': bpInfo
        },
        props: ['loading'],
        data: function() {
            return {
                iframe_url: '',
                deadtimer: null,
                iframe_node: null,
                bpConfig: {
                    show: false,
                    trigger: false,
                    pointName: '',
                    platform: 'PC',
                    pageUrl: '',
                    selector: '',
                    type: 'point'
                }
            }
        },
        ready() {
            this.iframe_node = document.getElementById('iframenode');
            window.onbeforeunload = (e) => true;
        },
        beforeDestroy() {
            window.onbeforeunload = null;
        },
        route: {
            activate: function(transition) {
                // 防止iframe脚本替换父窗口的地址
                window.onbeforeunload = (e) => true;
                this.activate(this.$route.query);
                return Promise.resolve(true);
            },
            deactivate: function() {
                this.bpConfig.show = false;
                window.onbeforeunload = null;
                // actions.databp(store, {show: false});
            }
        },
        events: {
            'visual_url': function(config) {
                this.activate(config);
            }
        },
        methods: {
            activate(query) {
                this.loading.show = true;
                let pageUrl = query.pageUrl;
                let platform = query.platform;
                if (pageUrl && platform) {
                    if (query.selector) {
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
                if (!iframenode) {
                    return false;
                }
                let $iframe = $(iframenode).contents();
                // 修正重定向
                let $iframewin = iframenode.contentWindow;
                
                // 修复最后无/
				let fullurl;
				if(_this.bpConfig.convertedUrl) {
					fullurl = _this.bpConfig.pageUrl;
				} else {
					fullurl = $iframewin.$pageUrl;
				}
				let host  = /^https?:\/\/[^\/]+?(\/|\.html|\?.+=.+)/.exec(fullurl);
				if (host) {
					host = host[0];
					_this.bpConfig.pageUrl = fullurl;
				} else {
					host = _this.bpConfig.pageUrl = fullurl + '/';
				}
                _this.bpConfig.platform = $iframewin.$platform;
                _this.$dispatch('visualbp_loaded', _this.bpConfig);
                var $head = $iframe.find('head');
                var $body = $iframe.find('body');
                if (/visualbp/.test(this.$route.path)) {
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
                            let elemtop = $target.offset().top - 30;
                            let maxtop = $iframe.height() - $($iframewin).height();
                            if (elemtop > maxtop) {
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
                    $body.bind('dragend', function(e) {
                        let $target = $(e.target);
                        $target.parent().attr('draggable', 'true');
                        $(e.target).css('visibility', 'hidden');
                    });
                    $body.mouseover(
                        function(e) {
                            for (var i in hovered) {
                                hovered[i].removeClass('bphover');
                                hovered[i].removeClass('bphover-position-fix');
                            }
                            hovered.length = 0;
                            var $target = $(e.target)
                            if (!($target.hasClass('bphover') || $target.is(selected))) {
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
                    if (href) {
                        if (/#/.test(href)) {
                            // 有锚点,防止跳转
                            return false;
                        } else if (/javascript/.test(href)) {
                            // 内联脚本 正常执行
                        } else if (/https?:\/\//.test(href)) {
                            // do noting
                            _this.bpConfig.pageUrl = href;
                            _this.searchClick();
                            return false;
                        } else {
                            if (href.startsWith('/')) {
                                if (href.startsWith('//')) {
                                    _this.bpConfig.pageUrl = host.match(/https?:/)[0] + href;
                                } else {
                                    _this.bpConfig.pageUrl = host + href.slice(1);
                                }
                            } else {
                                _this.bpConfig.pageUrl = _this.bpConfig.pageUrl.replace(/\/$/, '') + '/' + href;
                            }
                            _this.searchClick();
                            return false;
                        }
                    }
                });
            },
            searchClick() {
                var url = this.bpConfig.pageUrl;
                if (!/https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(url)) {
                    var $ele = $('#search');
                    $ele.popover('show');
                    setTimeout(function() { $ele.popover("destroy"); }, 1000);
                    return false;
                }
                this.$router.go({
                    path: this.$route.path.split('?')[0],
                    query: {
                        pageUrl: url,
                        platform: this.bpConfig.platform
                    }
                });
                this.search();
            },
            async search(forceloading = false) {
                this.bpConfig.stop = false;
                this.bpConfig.convertedUrl = '';
                this.$dispatch('will_search', this.bpConfig);
                if (await this.bpConfig.stop) {
                    return;
                }
                this.loading.show = true;
                this.deadtimer && clearTimeout(this.deadtimer);
                let rawurl = this.bpConfig.convertedUrl || this.bpConfig.pageUrl;
                var newiframe_url = '/databp/html?m=' + this.bpConfig.platform + '&url=' + encodeURIComponent(rawurl);
                let rawquery = rawurl.split('?')[1];
                rawquery && (newiframe_url += '&' + rawquery);
                if (newiframe_url === this.iframe_url && !forceloading) {
                    this.loading.show = false;
                    this.$dispatch('search_clicked', this.bpConfig);
                }
                this.iframe_url = newiframe_url;
                this.deadtimer = setTimeout(() => {
                    if (this.loading.show) {
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
	display: flex;
	flex-flow: row wrap;
  	align-content: flex-start;
}
.form-inline > * {
	margin-bottom: 10px;
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
