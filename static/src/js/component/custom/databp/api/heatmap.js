var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
const commonFilds = ['pageUrl', 'platform', 'startTime', 'endTime', 'version', 'dateTime'];
module.exports = {
	getHeatVersions(data) {
		return buildAjax('/point/versions', filterArgs(data, ['platform'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取版本信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result) && data.length) {
				return data;
			} else {
				return Promise.reject('暂无版本信息');
			}
		}).catch(errHandler);
	},
	getHeatData(data) {
		return buildAjax('/heat', filterArgs(data, commonFilds)).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力图信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result) && data.length) {
				return data;
			} else {
				return Promise.reject('暂无热力图信息');
			}
		}).catch(errHandler);
	},
	getHeatTable() {
		return buildAjax('/heat/table', filterArgs(data, commonFilds)).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力图表格失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
				return Promise.reject('获取的热力图表格信息为空');
			}
		}).catch(errHandler);
	},
	exportHeatTable() {
		return buildAjax('/heat/export', filterArgs(data, commonFilds)).catch(errHandler);
	}
}
