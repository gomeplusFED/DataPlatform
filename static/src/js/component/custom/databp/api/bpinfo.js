var store = require('store');
var actions = require('actions');
var { filterArgs, buildAjax, extractResult, errHandler } = require('./common');
module.exports = {
	getBp(data) {
		return buildAjax('/point', filterArgs(data, ['pageUrl', 'selector', 'platform', 'pointId'])).then(extractResult).then(function(res) {
			// 从私有埋点中去除公共埋点	
			//let tmppub = res.publicParam.split('&');
			//let tmppri = res.privateParam;
			// for(let s of tmppub) {
			// 	tmppri = tmppri.replace(s, '');
			// }
			//res.privateParam = tmppri;
			if (res.uniquePoint === '1') {
				res.publicParam = '';
			}
			return res;
		}).catch(errHandler);
	},
	// {pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}
	updateBp(data) {
		return buildAjax('/point', data, 'put').then((res) => {
			if (res.code !== '200' || res.iserror !== '0') {
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
	deleteBp({ pointId, type, uniquePoint }) {
		return buildAjax(`/point?pointId=${pointId}&type=${type}&uniquePoint=${uniquePoint}`, null, 'delete').then(function(res) {
			if (res.code !== '200' || res.iserror !== '0') {
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
	restoreBp({ pointId, type, uniquePoint }) {
		return buildAjax('/restore', { pointId, type, uniquePoint }, 'put').catch(errHandler).then(function(res) {
			actions.alert(store, {
				show: true,
				msg: '恢复成功',
				type: 'success'
			});
		});
	}
}
