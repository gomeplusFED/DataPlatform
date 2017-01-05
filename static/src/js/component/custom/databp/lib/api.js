var store = require('store');
var actions = require('actions');
var $ = require('jQuery');

const baseurl = window.location.href.startsWith('http://bi.') ? 
'http://10.125.192.133:8180/bomber-pie' : 'http://10.69.10.20:8088/bomber-pie'
// 请求失败 重试一次
const RETRY_TIMES = 2;

$.support.cors = true;

function filterArgs(data, args) {
	var newdata = {};
	for(var key of args) {
		// 不允许空字符串
		if(data[key] != null && data[key] !== '') {
			newdata[key] = data[key];
		}
	}
	return newdata;
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

function buildAjax(url, data, type = 'get') {
	let t = RETRY_TIMES;
	let proc = function(s, j){
		$.ajax({
			url: baseurl + url,
			timeout : 3000,
			type,
			dataType: 'JSON',
			data,
			success(data) {
				s(data);
			},
			error(xhr, status, error) {
				t--;
				if(t > 0) {
					proc(s, j);
				} else {
					j(`请求${baseurl + url}失败, 错误信息: ${error || status}`);
				}
			}
		});
	};
	return new Promise(proc);
}

function extractResult(res) {
	return new Promise(function(s, j){
		if(res.code !== '200' || res.iserror !== '0') {
			j('获取埋点信息失败：' + res.msg);
		}
		var data;
		if (res && (data = res.data) && (data = data.result)) {
			s(data);
		} else {
			j('获取的埋点信息为空');
		}
	});
}
function errHandler(errmsg) {
	var msg = '警告,' + errmsg;
	actions.alert(store, {
		show: true,
		msg,
		type: 'danger'
	});
	// stop the process
	return Promise.reject(msg);
}

var api = {
	// {pageUrl, selector, platform, pointId, matchUrlId}
	alert(opt) {
		actions.alert(store, opt);
	},
	getUserInfo() {
		return new Promise(function(s, j){
			$.ajax({
				url: '/databp/userInfo',
				type: 'get',
				dataType: 'JSON',
				timeout : 3000,
				success(data) {
					if (data.iserror) {
						j('请求用户信息失败');
					} else {
						s(data);
					}
				},
				error(xhr, status, error) {
					j('请求用户信息失败：' + status);
				}
			})
		}).catch(errHandler);
	},
	getBp(data) {
		return buildAjax('/point', filterArgs(data, ['pageUrl', 'selector', 'platform', 'pointId'])).then(extractResult).then(function(res){
			// 从私有埋点中去除公共埋点	
			//let tmppub = res.publicParam.split('&');
			//let tmppri = res.privateParam;
			// for(let s of tmppub) {
			// 	tmppri = tmppri.replace(s, '');
			// }
			//res.privateParam = tmppri;
			if(res.uniquePoint === '1') {
				res.publicParam = '';
			}
			return res;
		}).catch(errHandler);
	},
	// {pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}
	updateBp(data) {
		return buildAjax('/point', filterArgs(data, ['pageUrl', 'selector', 'pointName', 'platform', 'pointId', 'matchUrlId', 'pattern', 'publicParam', 'privateParam', 'userInfo', 'type']), 'put').then((res) => {
			if(res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('更新失败：' + res.msg);
			}
		}).catch(errHandler).then(function(res) {
			actions.alert(store, {
				show: true,
				msg: '更新成功',
				type: 'success'
			});
		});
	},
	// {pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}
	saveBp(data) {
		return buildAjax('/point', data, 'post').then(extractResult).catch(errHandler).then(function(res) {
			actions.alert(store, {
				show: true,
				msg: '保存成功',
				type: 'success'
			});
		});
	},
	// {pointId, matchUrlId}
	deleteBp({pointId, type}) {

		return buildAjax(`/point?pointId=${pointId}&type=${type}`, null, 'delete').then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('删除失败：' + res.msg);
			}
			return res;
		}).catch(errHandler).then(function(res) {
			actions.alert(store, {
				show: true,
				msg: '删除成功',
				type: 'success'
			});
		});
	},
	restoreBp(id) {
		return buildAjax('/restore', {pointId: id}, 'put').catch(errHandler).then(function(res) {
			actions.alert(store, {
				show: true,
				msg: '恢复成功',
				type: 'success'
			});
		});
	},
	// useless: selector
	// {pageUrl, platform, pointName, page, size}
	listBps(data){
		return buildAjax('/pointList', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
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
	},
	getHeatList(data) {
		return buildAjax('/pointHeatList', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
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
		return buildAjax('/pointHeatList/total', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
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
		return buildAjax('/pointHeatList/detail', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'page', 'size', 'startTime', 'endTime', 'pattern', 'isActive', 'type'])).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取热力趋势信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
				return Promise.reject('获取的热力趋势信息为空');
			}
		}).catch(errHandler);
	},
	getHeatData(data){
		return buildAjax('/heat', filterArgs(data, ['pageUrl', 'dateTime'])).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取埋点信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result) && data.length) {
				return data;
			} else {
				return Promise.reject('获取的热点信息为空');
			}
		}).catch(errHandler);
	}
}
module.exports = api;
