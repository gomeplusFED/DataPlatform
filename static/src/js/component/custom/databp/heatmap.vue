<template>
<div class="extendNav">
	<div class='form-group data-type'>
		<label>数据</label>
		<select v-model="datatype">
			<option v-for="type of dataTypes" value="{{type}}">{{type}}</option>
		</select>
	 </div>
	<label><input type="checkbox" v-model="mask"></input>显示热力图</label>

</div>

<div class="mask" v-show="mask"> </div>
<visualbp> </visualbp>
</template>
<script>
	let Vue = require('Vue');
	let $ = require('jQuery');
	let utils = require('utils');
	let api = require('./api');
	let Loading = require('../../common/loading.vue');
	let visualbp = require('./visualbp.vue');

	let heatmap = Vue.extend({
		name: 'databp',
		components: {
			'visualbp': visualbp
		},
		data: function() {
			return {
				mask: true,
				maskNodes: [],
				dataTypes: ['pv', 'uv'],
				datatype: 'pv'
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
				// var $iframe = $('iframe').contents();
				// var $body = $iframe.find('body');
				// let $elem = $iframe.find('body > div.gome-about.gome-wrap > div.public-container > main > div.left-menu > ul > li.active > a');
	//   			let mask = this.genNodes($elem, {pv: 200, uv:400});
	//   			this.renderNodes();
	//   			$body.append(mask);


				api.getHeatData(config).then((data) => {
					var $iframe = $('iframe').contents();
					var $body = $iframe.find('body');
					
					for(let t of data) {
						let $elem = $iframe.find(t.selector);
						// 当前把值都缩小一半
						let mask = this.genNodes($elem, t, 0.5);
						$body.append(mask);
					}
					this.renderNodes();
				});
			},
			genNodes($elem, item, p) {
				let _offset = $elem.offset();
				let _width = $elem.outerWidth();
				let _height = $elem.outerHeight();
				let _product = _width * _height;
				let _centerX = _offset.left + _width / 2;
				let _centerY = _offset.top + _height / 2;
				function calc(value) {
					value = p * value;
					// 计算比例k
					let k = Math.sqrt(value * value / _product);
					let width = k * _width;
					let height = k * _height;
					return {
						width: width + 'px',
						height: height + 'px',
						left: _centerX-width/2 + 'px',
						top: _centerY-height/2 + 'px'
					}
				}

				let data = {}
				for(let type of this.dataTypes) {
					data[type] = calc(item[type]);
				}
				let divNode = document.createElement("div");
				divNode.style = `z-index:900;position:absolute;background: radial-gradient(red, yellow 20%, #1E90FF 30%, rgba(255,255,255,0) 50%);`;
				let res = {
					divNode,
					data
				}
				this.maskNodes.push(res);
				return divNode;
			},
			renderNodes(type = this.dataTypes[0]) {
				for(let node of this.maskNodes) {
					Object.assign(node.divNode.style, node.data[type]);
				}
			}
		},
		watch: {
			'mask': {
				handler(val) {
					if(val) {
						for(let div of this.maskdivs) {
							div.style.display = 'block';
						}

					} else {
						for(let div of this.maskdivs) {
							div.style.display = 'none';
						}
						
					}
				}   
			},
			'datatype': {
				handler(val) {
					this.renderNodes(val);
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
	background: rgba(255,255,255,0.2);
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
