<template>
   <div class='page-content'>
	<form class='form-inline'>
	    <div class='form-group'>
	        <label>埋点URL</label>
	        <input type='text' class='form-control' placeholder='' value='{{searchData.companyName}}'>
	    </div>
	    <div class='form-group'>
	        <label>平台</label>
		    <select>
				<option value='pc'>PC</option>
				<option value='h5'>H5</option>
			</select>
		 </div>
	    <button on-click='search' type='button' class='btn ent-btn-blue search-btn '>检索页面</button>
	</form>
        <!-- nav -->
        <div id='container' class='main'>
	        <div class='tabpanel_content' style='width: 100%; height: 1000px;'>
		        <div class='html_content' style='z-index: 2;'>
		        	<iframe frameborder='no' border='0' marginwidth='0' marginheight='0' id='tab_baseQuery'  src='{{url}}'></iframe>
		        </div>
	        </div>
        </div>
        
    </div>
    <m-loading :loading.sync='loading'></m-loading>
</template>
<script>
	var Vue = require('Vue');
	Vue.config.debug = true;
	var $ = require('jQuery');

	var Loading = require('../../common/loading.vue');
	var DatePicker = require('../../common/datePicker.vue');
	var FilterSelect = require('../../common/filterSelect.vue');
	
	var databp = Vue.extend({
		name: 'databp',
		components: {
			'm-loading': Loading,
			'm-filter-select': FilterSelect,
			'm-date': DatePicker
		},
		data: function() {
			return {
				index: 1,
				initData: {},
				url: '',
				argvs: {
					channel: '',
					coupon_type: '',
					day_type: 1,
					endTime: '',
					startTime: '',
					type: 'new_vshop_num',
					ver: ''
				},
				loading: {
					show: true,
					noLoaded: 0
				},
				pageComponentsData: {
					date_picker: {show: false, defaultData: 7}
				},
				list: []
			}
		},
		ready() {
			var _this = this;
			this.url = '/databp/html?url=https://www.gomeplus.com/';
			$('iframe').load(function(){
				_this.loading.show = false;
				var $iframe = $(this).contents();
				var $head = $iframe.find('head'); 
				var $body = $iframe.find('body');
				var hovered = [];
				$head.append('<style> .bphover {border: 3px solid blue;}</style>');
			    $body.bind('contextmenu', function(e) {
			  		// console.log(e.target);
				    e.preventDefault();
				});
				$body.mouseover(
					function(e) {
						for (var i in hovered) {
							hovered[i].removeClass('bphover');
						}
						var $target = $(e.target)
					    $target.addClass('bphover');
					    hovered.push($target);
					});
			});
		},
		methods: {

		}
	});
	module.exports = databp;
</script>
<style scoped>
.tabpanel_content {
    position: relative;
    z-index: 2;
    background-color: #efefef;
    overflow: hidden;
}
.tabpanel_content .html_content {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-color: #efefef;
}
iframe {
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
}

.hover {
	border: 5px solid blue;
}

</style>
