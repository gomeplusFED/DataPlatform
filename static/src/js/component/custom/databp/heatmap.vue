<template>
<div class="heatmap">

	<visualbp :loading.sync='loading' v-ref:visual>
			<div slot="extend-nav" class='form-group inpW1'>
				<label>快照版本</label>
				<select id="version" class="form-control data-type" v-model="version"  data-content="请选择版本">
					<option v-for="(i, t) of versions" value={{i}}>{{t.version}} - {{t.dateTime}}</option>
				</select>
			</div>
			<div slot="extend-nav" class='form-group'>
				<label>显示指标</label>
				<select class="form-control data-type" v-model="datatype" :disabled="!show">
					<option v-for="type of dataTypes" value="{{type.name}}">{{type.name}}</option>
				</select>
			</div>
			<div slot="extend-nav" class="form-group">
				<label>截止日期</label>                     
				<m-date :index="index" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs' :custom-option = "datepickerOption"></m-date>

			</div>
			<label class="showmap" slot="extend-nav"><input type="checkbox" v-model="show"></input>显示热力图</label>
			<button slot="extend-nav" type='button' class='btn btn-primary export' @click="exportTable">导出</button>

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
						<td>{{tableData.dataTime || '-'}}</td>
						<td>{{tableData.uv || '-'}}</td>
						<td>{{tableData.pv || '-'}}</td>
						<td>{{tableData.hits || '-'}}</td>
						<td>{{tableData.rate || '-'}}</td>
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
	const api = require('./api');
	// const api = require('./mock/api');
	const DatePicker = require('../../common/datePicker.vue');
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
			let datepickerOption = {
					startDate: utils.formatDate((() => {
						let date = new Date();
						date.setDate(date.getDate() - 7);
						return date;
					})(), 'yyyy-MM-dd'),
					endDate: utils.formatDate(new Date(), 'yyyy-MM-dd'),
					opens: 'right'
			};
			return {
				show: true,
				datepickerOption,
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
				versions: [],
				version: null,
				tableData: {},
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
				argvs: {
					// 注意此时时间选取控件尚未初始化
					endTime: datepickerOption.endDate,
					startTime: datepickerOption.startDate
				},
				pageComponentsData: {
					date_picker: {
						show: true,
						defaultData: 90,
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
			api.getHeatVersions(this.$refs.visual.bpConfig).then((res) => {
				this.versions = res.map(x => ({...x, dateTime: utils.formatDate(new Date(x.dateTime), 'yyyy-MM-dd hh:mm:ss')}));
			});
		},
		events: {
			'visualbp_loaded': function (config) {
				this.init().then(() => {
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
				this.destroyCanvas();
				this.init().then(() => {
					this.loading.show = false;
				}).catch(() => {
					this.loading.show = false;
				});
			}
		},
		methods: {
			init() {
				// 表格
				let options;
				if(options = this.checkParams()) {
					api.getHeatTable(options).then((res) => {
						this.tableData = res;
					});
					return api.getHeatData(options).then((data) => {
						// this.data = data;
						this.rawData = data;
						this.generateCanvas(data);
						this.showTip();
						window.requestAnimationFrame(this.freshCanvas);
					});
				} else {
					return Promise.reject();
				}
			},
			checkParams() {
				var $ele;
				if(!this.version) {
					$ele =  $('#version');
				} else if (!this.$refs.visual.bpConfig.pageUrl) {
					$ele =  $('#page-url');
				}
				if($ele) {
					$ele.popover('show');
					setTimeout(function () { $ele.popover("destroy"); }, 1000);
					return false;
				}
				return {...this.$refs.visual.bpConfig, 
						...this.versions[this.version],
						startTime: this.argvs.startTime + ' 00:00:00',
						endTime: this.argvs.endTime + ' 23:59:59'
					};
			},
			exportTable() {
				let options;
				if(options = this.checkParams()) {
					api.exportHeatTable(options).then();
				}
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
			filterFunc(arr, canvas) {
				return arr.filter(x => (x._centerX && x._centerX < canvas.width && x._centerY < canvas.height));
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
					let filterFunc = (arr) => this.filterFunc(arr, canvas);
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
						all = null;
						xseries = null;
						yseries = null;
					}
				}
				this.data = newdata;
				needupdate = null;
				needupdatePre = null;
				needkeep = null;
				return window.requestAnimationFrame(this.freshCanvas);
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
					let vals = this.rawData.map(x => x[name]);
					let max = Math.max(...vals);
					if (max > this.maxVal) {
						type.p = this.maxVal/max;
					}
					let field = '_' + name;
					// 处理数据
					this.rawData.forEach((x, i) => {
						x[field] = x[name] * type.p;
						data[i][field] = x[field];
					})
					
					let canvasData = normalData.map(x => [x._centerX, x._centerY, x[field]]);

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
    margin-left: 20%;
    margin-right: 15px;
}

.heatmap .export {
	order: 1;
}
.heatmap .showmap {
	margin-top: 5px;
}
.heatmap * [slot="extend-nav"] {
	display: inline-block;
	margin-right: 15px;
	margin-bottom: 10px;
}
.heatmap .inpW1 {
	width: 280px;
}
.nform-box select {
	font-size: 12px;
}
.heatmap .inpW1 select {
	min-width: 190px;
}
.heatmap .extendNav .data-type {
    display: inline-block;
    width: 70px;
}
.heatmap .date_picker input {
	min-width: 210px;
}

.heatmap table{
	border: 1px solid #d6d6d6;
    font-size: 12px;
}
</style>
