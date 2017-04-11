var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
module.exports = {
	getHeatList(data) {
		return buildAjax('/pointHeatList', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'version', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力列表信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
				return Promise.reject('获取的热力列表信息为空');
			}
		}).catch(errHandler);
	},
	getHeatSum(data) {
		return buildAjax('/pointHeatList/total', filterArgs(data, ['pageUrl', 'platform', 'version', 'pointName', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力总计信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return data;
			} else {
				return Promise.reject('获取的热力总计信息为空');
			}
		}).catch(errHandler);
	},
	getHeatDetail(data) {
		return buildAjax('/pointHeatList/detail', filterArgs(data, ['pageUrl', 'platform', 'version', 'pointId', 'startTime', 'endTime', 'pattern', 'uniquePoint', 'isActive', 'type'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力趋势信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result) && (data.length)) {
				return data;
			} else {
				return [];
			}
		}).catch(errHandler);
	}
}
