<template>
<div class="heatmap">
	<div class="extendNav">
		<div class='form-group'>
			<label>数据</label>
			<select class="form-control data-type" v-model="datatype" :disabled="!show">
				<option v-for="type of dataTypes" value="{{type.name}}">{{type.name}}</option>
			</select>
		 </div>

		<div class="form-group date_picker">
			<label>截止日期</label>             
			<m-date :index="index" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs' diasbled></m-date>
		</div>
		<label class="showmap"><input type="checkbox" v-model="show"></input>显示热力图</label>
	</div>
	<visualbp :loading.sync='loading'> </visualbp>
</div>
</template>
<script>
	const Vue = require('Vue');
	const $ = require('jQuery');
	const utils = require('utils');
	const api = require('./mock/api.js');
	var DatePicker = require('../../common/datePicker.vue');
	const visualbp = require('./visualbp.vue');
	const Heatmap = require('./lib/heatmap.js');
	const heatmapFactory =  new Heatmap({
		            type : 'heatmap',
		            hoverable : false,
		            minAlpha: 0.2,
		            valueScale: 1,
		            opacity: 1
		        });

	let heatmap = Vue.extend({
		name: 'heatmap',
		components: {
			'visualbp': visualbp,
			'm-date': DatePicker
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
					heatdiv: null,
					styleNode: null,
					$elems: null,
					$tip: null,
					$popover: null
				},
				data: [],
				argvs: {},
				pageComponentsData: {
					date_picker: {
						show: true,
						defaultData: 1,
						showDayUnit:true
					},
					trigger: true
				},
				resultData: {
				}
			}
		},
		route: {
			activate: function (transition) {
				this.$broadcast('visual_url', this.$route.query);
				return Promise.resolve(true);
			}
		},
		ready() {
			this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
			// window.JQ = $;
		},
		events: {
			'visualbp_loaded': function (config) {
				let heatconfig = {...config, dateTime: this.argvs.endTime};
				this.init(heatconfig).then(() => {
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
			},
			'search_clicked':  function (config) {
				this.loading.show = true;
				let heatconfig = {...config, dateTime: this.argvs.endTime};
				this.destroyCanvas();
				this.init(heatconfig).then(() => {
					this.loading.show = false;
				}).catch(() => {
					this.loading.show = false;
				});
			}
		},
		methods: {
			init(config) {
				return api.getHeatData(config).then((data) => {
					// this.data = data;
					this.generateCanvas(data);
					this.showTip();
				});
			},
			showTip() {
				let $allElem = this.dom.$elems;
				let $popover = this.dom.$popover;
				let $tip = this.dom.$tip;
				let wait = false;
				let _x;
				let _y;
				let _element;
				let _text;
				
				let setPopover = (text) => {
					$tip.html(text);
					$popover.css('left', _x);
					$popover.css('top', _y);
					$popover.show();
					wait = false;
				}
				$allElem.mousemove(function(e) {
					_x = e.pageX + 12;
					_y = e.pageY + 12;
					if (_element !== this) {
						setPopover(_text = this.getAttribute('heat-data'));
					} else {
						if(!wait) {
							// throttle
							setTimeout(() => {
									setPopover(_text);
								}, 200);
							wait = true;
						}
					}
				});
				$allElem.mouseleave((e) => {
					$popover.hide();
					_element = null;
				});
			},
			destroyCanvas() {
				if (this.dom.heatdiv) {
					this.dom.heatdiv.remove();
					this.dom.heatdiv = null;
				}
				if (this.dom.styleNode) {
					this.dom.styleNode.remove();
					this.dom.styleNode = null;
				}
			},
			generateCanvas(data) {
				let _this = this;
				let $iframe = this.dom.iframe = $('iframe').contents();
				let $body = this.dom.body = $iframe.find('body');
				let heatdiv = document.createElement("div");
				heatdiv.id = 'heatdiv';
				let $heatdiv = $(heatdiv);
				this.dom.heatdiv = $heatdiv;

				let styleNode = document.createElement('style');
				this.dom.body.append(styleNode);
				this.dom.styleNode = $(styleNode);

				this.data = data = data.map((x, i) => {
					let $elem = $iframe.find(x.selector);
					if($elem.length === 0) {
						return null;
					}
					let _offset = $elem.offset();
					let _width = $elem.outerWidth();
					let _height = $elem.outerHeight();
					let _centerX = _offset.left + _width / 2;
					let _centerY = _offset.top + _height / 2;
					return ({$elem,_width, _height, _centerX, _centerY,  ...x, uid: i});
					}).filter(Boolean);
				
				// 
				if (data.length === 0) {
					this.show = false;
					return;
				}
				let docheight = $iframe.height();
				let docwidth = $iframe.width();
				let outRangeData = [];
				let normalData = [];
				for(let x of data) {
					if (x._centerX > 0 &&  x._centerX < docwidth && x._centerY > 0 && x._centerY < docheight) {
						normalData.push(x);
					} else {
						outRangeData.push(x);
					}
				}

				heatdiv.style = `overflow:hidden;z-index:1100;position:absolute;height:${docheight}px;width:${docwidth}px;top:0;left:0;pointer-events:none;`;
				$body.append(heatdiv);

					// inject popover
				let $tip = $('<p id="heatmaptip" style="text-align: left;"></p>');
				let $popover = $(`<div style="z-index:1200;overflow:hidden;display:none;position:absolute;border:0px solid rgb(51,51,51);transition:left 0.4s,top 0.4s;border-radius:4px;color:rgb(255,255,255);padding:5px;background-color:rgba(0,0,0,0.7);transition: all 0.5s"></div>`);
				$popover.append($tip);
				this.dom.$popover = $popover;
				this.dom.$tip = $tip;
				$heatdiv.append($popover);
				
				for(let type of _this.dataTypes) {
					let name = type.name;
					let vals = data.map(x => x[name]);
					let max = Math.max(...vals);
					if (max > this.maxVal) {
						type.p = this.maxVal/max;
					}
					// 处理数据
					
					let canvasData = normalData.map(x => [x._centerX, x._centerY, x[name] * type.p]);
					let extraData = outRangeData.map(x => ({heatmap: x[name] * type.p, ...x}));

					let _canvas = heatmapFactory.getCanvas(canvasData,
                        docwidth, docheight);

					let ctx = _canvas.getContext('2d');
					//
					// 切分canvas
					let heatmapStyle = this.cutCanvas(ctx, normalData, extraData);
					
					_canvas.style.display = 'none';
					heatdiv.appendChild(_canvas);
					_this.resultData[name] = {
						canvas: _canvas,
						heatmapStyle
					};
					
				}
				
				// bind event
				this.dom.$elems = data.reduce((acu,cur) => acu.add(cur.$elem.attr('heat-data', `名称：${cur.pointName || '--'}<br>pv：${cur.pv}<br>日uv：${cur.uv}`)), $());
				_this.switchCanvas();
				data.forEach(x => x.$elem.addClass(`heatmap-${x.uid}`));
				_this.show = true;
			},
			cutCanvas(ctx, data, extraData) {
				let heatmapStyle = '';
				let minD = Heatmap.DEFAULT_D || 0;
				for (let x of data) {
					let _width = x._width;
					let _height = x.$elem.css('display').includes('inline') ? x.$elem.parent().outerHeight() : x._height;
					let cutWidth = minD > x._width ? minD: _width;
					let cutHeight = minD > x._height ? minD: _height;
					let cutOffsetX = cutWidth / 2;
					let cutOffsetY = cutHeight / 2;
					let cutX = x._centerX - cutOffsetX;
					let cutY = x._centerY - cutOffsetY;
					let _imageData = ctx.getImageData(cutX, cutY, cutWidth, cutHeight);
					// 将该区域换成透明的
					ctx.putImageData(ctx.createImageData(_imageData), cutX, cutY);
					// 转为base64
					let __canvas = document.createElement('canvas');
						__canvas.width = cutWidth;
					__canvas.height = cutHeight;
					let __ctx = __canvas.getContext('2d');
					__ctx.putImageData(_imageData, 0, 0);
					let imgdata = __canvas.toDataURL();
					// 将其置为元素内容
					heatmapStyle += `.heatmap-${x.uid}:before {
						content: url(${imgdata});
						float: left;
						width: 0;
						height: 0;
						border: none;
						position: relative;
						z-index: 1000;
						left: ${-(cutOffsetX - _width / 2)}px;
						top: ${-(cutOffsetY - _height / 2)}px;
					}`;
					// x.$elem.parents().css('z-index', '900');

				}
				for (let x of extraData) {
					let _width = x._width;
					let _height = x.$elem.css('display').includes('inline') ? x.$elem.parent().outerHeight() : x._height;
					let cutWidth = minD > x._width ? minD: _width;
					let cutHeight = minD > x._height ? minD: _height;
					let cutOffsetX = cutWidth / 2;
					let cutOffsetY = cutHeight / 2;
					let __canvas = heatmapFactory.getCanvas([[cutWidth / 2, cutHeight / 2, x.heatmap]],
                        cutWidth, cutHeight);
					let imgdata = __canvas.toDataURL();
					// 将其置为元素内容
					heatmapStyle += `.heatmap-${x.uid}:before {
						content: url(${imgdata});
						float: left;
						width: 0;
						height: 0;
						border: none;
						position: relative;
						z-index: 1000;
						left: ${-(cutOffsetX - _width / 2)}px;
						top: ${-(cutOffsetY - _height / 2)}px;
					}`;
					
				}
				
				return heatmapStyle;
			},
			switchCanvas(type = this.datatype) {
				for(let t in this.resultData) {
					let data = this.resultData[t];
					if (t === type) {
						data.canvas.style.display = 'block';
						this.dom.styleNode.html(data.heatmapStyle);
					} else {
						data.canvas.style.display = 'none';
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
<style>
.heatmap #search {
	float: right;
}
.heatmap .extendNav {
	position: absolute;
	left: 570px;
}
.heatmap .extendNav > * {
	display: inline-block;
	margin-right: 15px;
}
.heatmap .extendNav .data-type {
    display: inline-block;
    width: 70px;
}
</style>
