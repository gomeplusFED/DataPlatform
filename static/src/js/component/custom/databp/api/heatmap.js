var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
module.exports = {
	getHeatData(data) {
		return buildAjax('/heat', filterArgs(data, ['platform', 'pageUrl', 'dateTime'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取埋点信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result) && data.length) {
				return data;
			} else {
				return Promise.reject('暂无热点信息');
			}
		}).catch(errHandler);
	}
}
