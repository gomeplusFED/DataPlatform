<template>
<div class="extendNav">
	<div class='form-group data-type'>
		<label>数据</label>
		<select v-model="datatype">
			<option v-for="type of dataTypes" value="{{type.name}}">{{type.name}}</option>
		</select>
	 </div>
	<label><input type="checkbox" v-model="show"></input>显示热力图</label>

</div>

<div class="mask"> </div>
<visualbp> </visualbp>
</template>
<script>
	let Vue = require('Vue');
	let $ = require('jQuery');
	let utils = require('utils');
	let api = require('./api');
	let Loading = require('../../common/loading.vue');
	let visualbp = require('./visualbp.vue');
	var Heatmap = require('./heatmap.js');

	let heatmap = Vue.extend({
		name: 'databp',
		components: {
			'visualbp': visualbp
		},
		data: function() {
			return {
				mask: true,
				show: true,
				// 防止热力图无限扩大设置的最大值
				// 最大不透明度为1
				maxVal: 1,
				dataTypes: [
				{
					name: 'pv',
					p: 1

				}, {
					name: 'uv',
					p: 1
				}],
				datatype: 'pv',
				heatData: {
					pv: [],
					uv: []
				},
				canvas: {
					pv: null,
					uv: null
				},
				option: {
		            type : 'heatmap',
		            hoverable : false,
		            minAlpha: 0.2,
		            valueScale: 1,
		            opacity: 1
		        }

			}
		},
		route: {
			activate: function (transition) {
				let query = this.$route.query;   	
				let pageUrl = query.pageUrl;
				if (pageUrl) {
					this.$broadcast('visual_url', query);
				}
				return Promise.resolve(true);
			}
		},
		events: {
			'visualbp_loaded': function (config) {
				this.init(config);
			}
		},
		methods: {
			init(config) {
				let data =[{
					"pageUrl": "https://www-pre.gomeplus.com/",
					"selector": "body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li:first-child > a",
					"pv": 5336,
					"uv": 824
				}, {
					"pageUrl": "https://www-pre.gomeplus.com/",
					"selector": "body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li:first-child + li > a",
					"pv": 15336,
					"uv": 1824
				}, {
					"pageUrl": "https://www-pre.gomeplus.com/",
					"selector": "body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li:first-child + li +li > a",
					"pv": 19336,
					"uv": 1924
				}];
				this.generateCanvas(data);
				// api.getHeatData(config).then((data) => {
				// 	this.generateCanvas(data);
				// });
			},
			generateCanvas(data) {
				let _this = this;
				var $iframe = $('iframe').contents();
				var $body = $iframe.find('body');

				let heatdiv = document.createElement("div");

				let docheight = $iframe.height();
				let docwidth = $iframe.width();
				heatdiv.style = `z-index:900;position:absolute;height:${docheight}px;width:${docwidth}px;top:0;left:0;`;
				$body.append(heatdiv);
				for(let type of _this.dataTypes) {
					let name = type.name;
					let vals = data.map(x => x[name]);
					let max = Math.max(...vals);
					if (max > this.maxVal) {
						type.p = this.maxVal/max;
					}
					// 处理数据
					this.heatData[name] = data.map((x) => {
						let $elem = $iframe.find(x.selector);
						let _offset = $elem.offset();
						let _width = $elem.outerWidth();
						let _height = $elem.outerHeight();
						let _centerX = _offset.left + _width / 2;
						let _centerY = _offset.top + _height / 2;
						return [_centerX, _centerY, x[name] * type.p];
					});
					_this.canvas[name] = new Heatmap(_this.option).getCanvas(_this.heatData[name],
                        docwidth, docheight);
					_this.canvas[name].style.display = 'none';
					heatdiv.appendChild(_this.canvas[name]);
				}
				_this.switchCanvas();
			},
			switchCanvas(type = this.dataTypes[0].name) {
				for(let t in this.canvas) {
					if (t === type) {
						this.canvas[type].style.display = 'block';
					} else {
						this.canvas[t].style.display = 'none';
					}
				}
			}
		},
		watch: {
			'show': {
				handler(val) {
					if(val) {
						this.switchCanvas(this.datatype);
					} else {
						for(let t in this.canvas) {
								this.canvas[t].style.display = 'none';
						}
						
					}
				}   
			},
			'datatype': {
				handler(val) {
					this.switchCanvas(val);
				}
			}
		}
	});
	module.exports = heatmap;
</script>
<style scoped>
.mask {
	position: absolute;
	margin-top: 60px;
	width: 100%;
	height: 100%;
	top: 0;
	z-index: 100;
	cursor: auto;
/*	background: rgba(255,255,255,0.1);*/
}
.extendNav {
	position: absolute;
	right: 50px;
}
.data-type {
	display: inline-block;
	margin-right: 20px;
}

</style>
