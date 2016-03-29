/**
 * @author yanglei
 * @date 20151228
 * @fileoverview 终端属性数据过滤
 */
var utils = require('../libs/utils');
var _ = require('lodash');

module.exports = {
    area : function(data, types, param, sortName) {
        var lines = [];
        var source = data.data;
        var array = _.uniq(_.pluck(source, param));
        var newdata = [];
        var new_users_total = 0;
        var start_up_total = 0;
        array.forEach(function(key) {
            newdata.push({
                name : key,
                new_users : 0,
                start_up : 0
            });
        });
        source.forEach(function(k) {
            new_users_total = new_users_total + k.new_users;
            start_up_total = start_up_total + k.start_up;
            newdata.forEach(function(key) {
                if(key.name === k[param]) {
                    key.new_users = key.new_users + k.new_users;
                    key.start_up = key.start_up + k.start_up;
                }
            });
        });
        newdata.sort(function(a, b) {
            return b[sortName] - a[sortName];
        });
        var times = newdata.length < 10 ? newdata.length : 10;
        data.data = [];
        for(var i = 0; i < times; i++) {
            newdata[i].new_users_rate =
                (newdata[i].new_users / (new_users_total === 0 ? 1 : new_users_total) * 100).toFixed(2) + '%';
            newdata[i].start_up_rate =
                (newdata[i].start_up / (start_up_total === 0 ? 1 : start_up_total) * 100).toFixed(2) + '%';
            if(param === 'country') {
                if(newdata[i].name === 'cn') {
                    newdata[i].name = '中国'
                }
            } else {
                newdata[i].name = utils.decode(newdata[i].name, '').province;
            }
            data.data.push(newdata[i]);
            lines.push({
                name : newdata[i].name,
                type : 'bar',
                key : newdata[i][sortName]
            });
        }
        data.data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        data.lines = lines;
        return data;
    },
    terminal : function(data, types, param, sortName) {
        var lines = [];
        var source = [];
        var newdata = [];
        var new_users_total = 0;
        var start_up_total = 0;
        data.data.forEach(function(key) {
            if(key.object === param) {
                source.push(key);
            }
        });
        var models = _.uniq(_.pluck(source, 'oname'));
        models.forEach(function(key) {
            newdata.push({
                name : key,
                new_users : 0,
                start_up : 0
            });
        });
        source.forEach(function(key) {
            new_users_total = new_users_total + key.new_users;
            start_up_total = start_up_total + key.start_up;
            newdata.forEach(function(k) {
                if(key.oname === k.name) {
                    k.new_users = k.new_users + key.new_users;
                    k.start_up = k.start_up + key.start_up;
                }
            });
        });
        newdata.sort(function(a, b) {
            return b[sortName] - a[sortName];
        });
        var times = newdata.length < 10 ? newdata.length : 10;
        data.data = [];
        for(var i = 0; i < times; i++) {
            newdata[i].new_users_rate =
                (newdata[i].new_users / (new_users_total === 0 ? 1 : new_users_total) * 100).toFixed(2) + '%';
            newdata[i].start_up_rate =
                (newdata[i].start_up / (start_up_total === 0 ? 1 : start_up_total) * 100).toFixed(2) + '%';
            data.data.push(newdata[i]);
            lines.push({
                name : newdata[i].name,
                type : 'bar',
                key : newdata[i][sortName]
            });
        }
        data.data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        data.lines = lines;
        return data;
    }
};