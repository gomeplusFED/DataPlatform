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
	const api = require('./lib/api.js');
	var DatePicker = require('../../common/datePicker.vue');
	const visualbp = require('./visualbp.vue');
	const Heatmap = require('./lib/heatmap.js');

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
		ready() {
			this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
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
					this.data = data;
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

				data = data.map(x => ({$elem: $iframe.find(x.selector), ...x})).filter(x => x.$elem.length);

				if (data.length === 0) {
					this.show = false;
					return;
				}

				let docheight = $iframe.height();
				let docwidth = $iframe.width();
				heatdiv.style = `overflow:hidden;z-index:900;position:absolute;height:${docheight}px;width:${docwidth}px;top:0;left:0;pointer-events:none;`;
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
					let canvasData = [];
					for (let x of data) {
						let $elem = x.$elem;
						let _offset = $elem.offset();
						let _width = $elem.outerWidth();
						let _height = $elem.outerHeight();
						let _centerX = _offset.left + _width / 2;
						let _centerY = _offset.top + _height / 2;
						canvasData.push([_centerX, _centerY, x[name] * type.p]);
					}
					let _canvas = new Heatmap(_this.option).getCanvas(canvasData,
                        docwidth, docheight);
					_canvas.style.display = 'none';
					heatdiv.appendChild(_canvas);
					let lastres;
					_this.canvas[name] = _canvas;
				}
				// bind event
				this.dom.$elems = data.reduce((acu,cur) => acu.add(cur.$elem.attr('heat-data', `名称：${cur.pointName || '--'}<br>pv：${cur.pv}<br>日uv：${cur.uv}`)), $());
				_this.switchCanvas();
				_this.show = true;
			},
			switchCanvas(type = this.datatype) {
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
