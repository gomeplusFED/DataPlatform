<template>
<div>
	<div class="extendNav">
		<div class='form-group data-type'>
			<label>数据</label>
			<select v-model="datatype" :disabled="!show">
				<option v-for="type of dataTypes" value="{{type.name}}">{{type.name}}</option>
			</select>
		 </div>
		<label><input type="checkbox" v-model="show"></input>显示热力图</label>
	</div>
	<!-- <div class="mask" v-show="show"> </div> -->
	<visualbp :loading.sync='loading'> </visualbp>
</div>
</template>
<script>
	const Vue = require('Vue');
	const $ = require('jQuery');
	const utils = require('utils');
	const api = require('./api');
	const visualbp = require('./visualbp.vue');
	const Heatmap = require('./heatmap.js');

	let heatmap = Vue.extend({
		name: 'heatmap',
		components: {
			'visualbp': visualbp
		},
		props:['loading'],
		data: function() {
			return {
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
				dom: {
					iframe: null,
					body: null,
					heatdiv: null
				},
				data: [],
				canvas: {
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
				this.$broadcast('visual_url', this.$route.query);
				return Promise.resolve(true);
			}
		},
		events: {
			'visualbp_loaded': function (config) {
				this.init(config).then(() => {
					let body = this.dom.body[0];
					utils.observeDOMInserted(body, (mutations) => {
						if(mutations[0].target !== body && mutations[0].target.id !== 'heatmaptip') {
							this.dom.heatdiv.remove();
							// 延迟一下，使浏览器先render完毕
							setTimeout(() => {
								this.generateCanvas(this.data);
							}, 10);
						}
					});
				});


			}
		},
		methods: {
			init(config) {
				// let data =[{
				// 	"pageUrl": "https://www-pre.gomeplus.com/",
				// 	"selector": "body > div.wrap-box > div.circle-index-list.clearfix > div:nth-child(2) > div:nth-child(1) > div > div.list-img > a > img",
				// 	"pv": 5336,
				// 	"uv": 824
				// }, {
				// 	"pageUrl": "https://www-pre.gomeplus.com/",
				// 	"selector": "body > div.wrap-box > div.circle-index-list.clearfix > div:nth-child(3) > div:nth-child(1) > div > div.list-title > p > a",
				// 	"pv": 15336,
				// 	"uv": 1824
				// }, {
				// 	"pageUrl": "https://www-pre.gomeplus.com/",
				// 	"selector": "body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li:first-child + li +li > a",
				// 	"pv": 19336,
				// 	"uv": 1924
				// }];
				// this.data = data;
				// this.generateCanvas(data);
				// return Promise.resolve();
				return api.getHeatData(config).then((data) => {
					this.data = data;
					this.generateCanvas(data);
				});
			},
			generateCanvas(data) {
				let _this = this;
				var $iframe = $('iframe').contents();
				var $body = $iframe.find('body');
				let heatdiv = document.createElement("div");
				heatdiv.id = 'heatdiv';
				let $heatdiv = $(heatdiv);
				_this.dom.iframe = $iframe;
				_this.dom.body = $body;
				_this.dom.heatdiv = $heatdiv;

				data = data.map(x => {return {$elem: $iframe.find(x.selector), ...x}}).filter(x => x.$elem.length);

				if (data.length === 0) {
					this.show = false;
					return;
				}


				let docheight = $iframe.height();
				let docwidth = $iframe.width();
				heatdiv.style = `overflow:hidden;z-index:900;position:absolute;height:${docheight}px;width:${docwidth}px;top:0;left:0;`;
				$body.append(heatdiv);

					// inject popover
				let $tip = $('<p id="heatmaptip" style="text-align: left"></p>');
				let $popover = $(`<div style="z-index:1200;overflow:hidden;display:none;position:absolute;border:0px solid rgb(51,51,51);transition:left 0.4s,top 0.4s;border-radius:4px;color:rgb(255,255,255);padding:5px;background-color:rgba(0,0,0,0.7);width: 500px">
				    </div>`);
				$popover.append($tip);
				$heatdiv.append($popover);
				
				for(let type of _this.dataTypes) {
					let name = type.name;
					let vals = data.map(x => x[name]);
					let max = Math.max(...vals);
					if (max > this.maxVal) {
						type.p = this.maxVal/max;
					}
					// 处理数据
					let canvasData = [];
					let eventData = [];
					for (let x of data) {
						let $elem = x.$elem;
						let _offset = $elem.offset();
						let _width = $elem.outerWidth();
						let _height = $elem.outerHeight();
						let _centerX = _offset.left + _width / 2;
						let _centerY = _offset.top + _height / 2;
						canvasData.push([_centerX, _centerY, x[name] * type.p]);
						eventData.push({_centerX, _centerY, ...x});
					}
					let _canvas = new Heatmap(_this.option).getCanvas(canvasData,
                        docwidth, docheight);
					_canvas.style.display = 'none';
					heatdiv.appendChild(_canvas);



					let lastres;
					// bind event
					$(_canvas).mousemove((e) => {
						let _x = e.pageX + 12;
						let _y = e.pageY + 12;
						let res = eventData.filter(p => {
							return Math.abs(p._centerX - _x) <= 26 && Math.abs(p._centerY - _y) <= 26;
 						});
 						if (res.length > 0) {
 							let item = res[0];
 							if(lastres !== item) {
 								$tip.html(`名称：${item.pointName || '--'}<br>选择器：${item.selector || '--'}<br>${name}：${item[name]}`);
 							}
 							$popover.css('left', _x);
 							$popover.css('top', _y);
 							$popover.show();
 						} else {
 							$popover.hide();
 						}
					    
					});
					_this.canvas[name] = _canvas;
				}
				_this.switchCanvas();
				_this.show = true;
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
						this.dom.heatdiv.show();
						this.switchCanvas(this.datatype);
					} else {
						this.dom.heatdiv.hide();
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
	z-index: 1000;
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
