var store = require('../../../store/store.js');
var actions = require('../../../store/actions.js');
var $ = require('jQuery');
// const baseurl = 'http://10.69.20.59:8090/bomber-pie';
const baseurl = 'http://10.69.112.146:38080/bomber-pie'

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
	return new Promise(function(s, j){
		$.ajax({
			url: baseurl + url,
			type,
			dataType: 'JSON',
			data,
			success(data) {
				s(data);
			},
			error(xhr, status, error) {
				j('请求失败：' + status);
			}
		});
	});
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
function errHandler(err) {
	var msg = '请求过程中失败：' + err.toString();
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
	getBp(data) {
		return buildAjax('/point', filterArgs(data, ['pageUrl', 'selector', 'platform', 'pointId'])).then(extractResult).then(function(res){
			// console.log(typeof res.uniquePoint);
			if(res.uniquePoint === '1') {
				res.publicParam = '';
			}
			return res;
		}).catch(errHandler);
	},
	// {pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}
	updateBp(data) {
		return buildAjax('/point', filterArgs(data, ['pageUrl', 'selector', 'pointName', 'platform', 'pointId', 'matchUrlId', 'pattern', 'publicParam', 'privateParam']), 'put').then(extractResult).catch(errHandler).then(function(res) {
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
	deleteBp(id) {
		return buildAjax('/point?pointId='+ id, null, 'delete').then(function(res) {
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
	// useless: selector
	// {pageUrl, platform, pointName, page, size}
	listBps(data){
		return buildAjax('/pointList', filterArgs(data, ['pageUrl', 'platform', 'pointName', 'page', 'size', 'startTime', 'endTime'])).then(function(res) {
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
	}
}
module.exports = api;
