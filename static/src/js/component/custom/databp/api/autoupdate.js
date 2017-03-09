var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
module.exports = {
	runUpdate(data) {
		return buildAjax('/run', filterArgs(data, ['platform', 'rootUrl', 'version']), 'post').then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('一键更新任务启动失败:' + res.msg);
			}
			var data;
			if (res && (data = res.data) && data.total) {
				return data;
			} else {
				return Promise.reject('一键更新任务启动失败:' + res.msg);
			}
		}).catch(errHandler);
	},
	getLogs(data) {
		return buildAjax('/point/logs', filterArgs(data, ['platform', 'website', 'version', 'page', 'size'])).then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取日志信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
				return Promise.reject('获取的日志信息为空');
			}
		}).catch(errHandler);
	}

}
