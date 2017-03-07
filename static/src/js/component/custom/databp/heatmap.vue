<template>
<div class="heatmap">

	<visualbp :loading.sync='loading'>
		<div slot="extend-nav" class="extendNav">
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

		<div slot="data-table">
			<table class="table table-hover">
				<thead>
					<tr >
						<th>时间</th>
						<th>日UV</th>
						<th>PV</th>
						<th>点击量</th>
						<th>点击率</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{'-'}}</td>
						<td>{{'-'}}</td>
						<td>{{'-'}}</td>
						<td>{{'-'}}</td>
						<td>{{'-'}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	
	 </visualbp>
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
					width: null,
					height: null,
					$elems: null,
					$tip: null,
					$popover: null
				},
				data: [],
				rawData: [],
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
						if(mutations[0].target !== body && !mutations[0].target.id.includes('heatmap')) {
							// this.dom.heatdiv.remove();
							// 延迟一下，使浏览器先render完毕
							setTimeout(() => {
								if(this.dom.iframe.height() !== this.dom.height || this.dom.iframe.width() !== this.dom.width) {
									this.destroyCanvas();
									this.generateCanvas(this.rawData);
								}
								this.showTip();
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
					this.rawData = data;
					this.generateCanvas(data);
					this.showTip();
					window.requestAnimationFrame(this.freshCanvas);
				});
			},
			showTip() {
				// bind event
				this.dom.$elems && this.dom.$elems.off();
				let $allElem = this.dom.$elems = this.data.filter(x => x.$elem).reduce((acu,cur) => acu.add(cur.$elem.attr('heat-data', `名称：${cur.pointName || '--'}<br>pv：${cur.pv}<br>日uv：${cur.uv}`)), $());
				if (!$allElem) {
					return;
				}
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
			trimData(data) {
				let $iframe = this.dom.iframe;
				return data.map((x, i) => {
					let $elem = x.$elem || $iframe.find(x.selector);
					if($elem.length) {
						$elem = $elem.first();
					} else {
						return {...this.rawData[i]};
					}
					let _offset = $elem.offset();

					let _left = _offset.left;
					let _top = _offset.top;
					if ($elem.is(":visible") && (_left + _top) > 0) {
						let _width = $elem.outerWidth();
						let _height = $elem.outerHeight();
						let _centerX = _left + _width / 2;
						let _centerY = _top + _height / 2;
						return ({...x, $elem, _width, _height, _centerX, _centerY});
					} else {
						return ({...this.rawData[i], $elem});
					}
					
					});
			},
			freshCanvas() {
				let newdata = this.trimData(this.data);
				let needkeep = [];
				let needupdate = [];
				let needupdatePre = [];
				for(let i = 0,len= newdata.length;i<len;i++) {
					let x0 = this.data[i];
					let x1 = newdata[i];
					if ((x0._centerX === x1._centerX) && (x0._centerY === x1._centerY)) {
						needkeep.push(x0);
					} else {
						needupdate.push(x1)
						needupdatePre.push(x0);
					}
				}
				let type = this.dataTypes.find(x => x.name === this.datatype);
				let canvas = this.resultData[type.name].canvas;
				if(needupdate.length > 0) {
					let filterFunc = (arr) => arr.filter(x => (x._centerX && x._centerX < canvas.width && x._centerY < canvas.height));
					needupdate = filterFunc(needupdate);
					needupdatePre = filterFunc(needupdatePre);
					needkeep = filterFunc(needkeep);
					let field = '_' + type.name;
					if (needupdate.length === 0) {
						heatmapFactory.refreshCanvas(canvas, needkeep.map(x => [x._centerX, x._centerY, x[field]]));
					} else {
						let all = [...needupdatePre, ...needupdate];
						let xseries = all.map(x => x._centerX);
						let yseries = all.map(x => x._centerY);
						let maxX = Math.max(...xseries);
						let minX = Math.min(...xseries);
						let maxY = Math.max(...xseries);
						let minY = Math.min(...yseries);
						heatmapFactory.refreshCanvas(canvas, [...needupdate, ...needkeep].map(x => [x._centerX, x._centerY, x[field]]), minX, minY, maxX - minX, maxY - minY);
					}
				}
				this.data = newdata;
				window.requestAnimationFrame(this.freshCanvas);
			},
			destroyCanvas() {
				if (this.dom.heatdiv) {
					this.dom.heatdiv.remove();
					this.dom.heatdiv = null;
				}
			},
			generateCanvas(data = this.rawData) {
				let _this = this;
				let $iframe = this.dom.iframe = $('iframe').contents();
				// let iframedoc = $iframe[0];
				let $body = this.dom.body = $iframe.find('body');
				let heatdiv = document.createElement("div");
				heatdiv.id = 'heatdiv';
				let $heatdiv = $(heatdiv);
				this.dom.heatdiv = $heatdiv;

				data = this.trimData(this.rawData);
				
				if (data.length === 0) {
					this.show = false;
					return;
				}
				let docheight = this.dom.height = $iframe.height();
				let docwidth = this.dom.width = $iframe.width();
				let normalData = data.filter(x => x._centerX);

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
					for(let x of data) {
						x['_' + name] = x[name] * type.p;
					}
					
					let canvasData = normalData.map(x => [x._centerX, x._centerY, x['_' + name]]);

					let _canvas = heatmapFactory.getCanvas(canvasData,
                        docwidth, docheight);
					_canvas.style.display = 'none';
					heatdiv.appendChild(_canvas);
					_this.resultData[name] = {
						canvas: _canvas
					};
					
				}
				this.data = data;
				this.switchCanvas(this.datatype);
				_this.show = true;
			},
			switchCanvas(type = this.datatype) {
				for(let t in this.resultData) {
					let data = this.resultData[t];
					if (t === type) {
						data.canvas.style.display = 'block';
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

.heatmap .extendNav > * {
	display: inline-block;
	margin-right: 15px;
}
.heatmap .extendNav .data-type {
    display: inline-block;
    width: 70px;
}
.heatmap .extendNav .date_picker input {
	max-width: 120px;
}

.heatmap table{
	border: 1px solid #d6d6d6;
    font-size: 12px;
}
</style>
