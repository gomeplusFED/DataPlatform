var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
module.exports = {
	runUpdate(data) {
		return buildAjax('/run', filterArgs(data, ['platform', 'rootUrl', 'version', 'operUser']), 'post').then(function(res) {
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
	getSiteList() {
		return [{
				name: '国美在线PC（测试）',
				url: 'http://www.atguat.com.cn/'
			}, {
				name: '国美PLUS站PC（测试）',
				url: 'https://www.pre.gomeplus.com/'
			}, {
				name: '国美在线PC',
				url: 'https://www.gome.com.cn/'
			}, {
				name: '国美PLUS站PC',
				url: 'https://www.gomeplus.com/'
			}
			// {
			// 	name: '国美Plus站Wap',
			// 	url: 'https://m.gomeplus.com/'
			// }, {
			// 	name: '国美Plus站Wap（测试）',
			// 	url: 'https://m.gomeplus.com/'
			// },{
			// 	name: '国美在线Wap',
			// 	url: 'http://m.gome.com.cn/'
			// }
		]
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
