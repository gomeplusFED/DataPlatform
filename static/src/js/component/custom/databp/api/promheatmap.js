var { baseurl, filterArgs, buildAjax, extractResult, errHandler } = require('./common');
const $ = require('jQuery');
const commonFilds = ['pageUrl', 'platform', 'startTime', 'endTime', 'version', 'dateTime'];
export const promheatmap = {
	getHeatVersions(data) {
		return Promise.resolve({
			"msg": "成功",
			"code": "200",
			"data": {
				"result": [{
					"id": 1,
					"version": "默认版本",
					"dateTime": Date.now()
				}],
				"total": 1
			},
			"iserror": "0"
		}).then(function(res) {
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
	getLatestVersions(data) {
		return Promise.resolve({ "data": { "total": 1, "result": "默认版本" }, "code": "200", "msg": "", "iserror": "0" }).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取最新版本信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return data;
			} else {
				return Promise.reject('暂无最新版本信息');
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
	getHeatTable(data) {
		return buildAjax('/heat/table', filterArgs(data, commonFilds)).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力图表格失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return data;
			} else {
				return Promise.reject('获取的热力图表格信息为空');
			}
		}).catch(errHandler);
	},
	exportHeatTable(data) {
		window.open(baseurl + '/heat/export?' + $.param(filterArgs(data, commonFilds)));
	},
	getLocalUrl(data) {
		return buildAjax('/point/localurl', filterArgs(data, ['originalUrl', 'version', 'platform'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('热力图地址转化失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return data;
			} else {
				return Promise.reject('无热力图地址');
			}
		}).catch(errHandler);
	}
}
