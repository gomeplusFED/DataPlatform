var store = require('store');
var actions = require('actions');
var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
// var api = [require('./heatmap'), require('./bpstats'), require('./autoupdate'), require('./bpinfo')].reduce((pre, cur) => Object.assign(pre, cur));

const files = require.context('.', false, /\.js$/);
const api = {};
files.keys().forEach((key) => {
	if (key === './index.js') return;
	Object.assign(api, files(key));
});
Object.assign(api, {
	// {pageUrl, selector, platform, pointId, matchUrlId}
	alert(opt) {
		actions.alert(store, opt);
	},
	// useless: selector
	// {pageUrl, platform, pointName, page, size}
	listBps(data) {
		return buildAjax('/pointList', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'version', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取埋点信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
				return Promise.reject('获取的埋点信息为空');
			}
		}).catch(errHandler);
	}
});
module.exports = api;
