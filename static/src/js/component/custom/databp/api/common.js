var store = require('store');
var actions = require('actions');
var $ = require('jQuery');
const baseurl = window.location.href.startsWith('http://bi.intra') ?
	'http://api.point.bi.pro.gomeplus.com/bomber-pie' : 'http://api.point.bi.pre.gomeplus.com/bomber-pie'
// 请求失败 重试一次
const RETRY_TIMES = 2;
$.support.cors = true;
export function filterArgs(data, args) {
	var newdata = {};
    if (data != null) {
        for (var key of args) {
            // 不允许空字符串
            if (data[key] != null && data[key] !== '') {
                newdata[key] = data[key];
            }
        }
    }
	return newdata;
}
export function buildAjax(url, data, type = 'get') {
	let t = RETRY_TIMES;
	let proc = function(s, j) {
		$.ajax({
			url: baseurl + url,
			timeout: 3000,
			type,
			dataType: 'JSON',
			data,
			success(data) {
				s(data);
			},
			error(xhr, status, error) {
				t--;
				if (t > 0) {
					proc(s, j);
				} else {
					j(`请求${baseurl + url}失败, 错误信息: ${error || status}`);
				}
			}
		});
	};
	return new Promise(proc);
}
export function extractResult(res) {
	return new Promise(function(s, j) {
		if (res.code !== '200' || res.iserror !== '0') {
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
export function errHandler(errmsg) {
	var msg = '警告,' + errmsg;
	actions.alert(store, {
		show: true,
		msg,
		type: 'danger'
	});
	// stop the process
	return Promise.reject(msg);
}
