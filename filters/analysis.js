/**
 * @author yanglei
 * @date 20151229
 * @fileoverview 用户分析数据过滤
 */

var _ = require('lodash');

module.exports = {
    verAnalysis : function(data, types, param) {
        var newdata = [];
        var source = data.data;
        var dates = _.uniq(_.pluck(source,'date'));
        var vers = [];
        var lines = [];
        if(!types.ver) {
            types.ver = [];
        }
        types.ver.forEach(function(key) {
            vers.push({
                name : key,
                num : 0
            });
        });
        source.forEach(function(key) {
            vers.forEach(function(ver) {
                if(ver.name === key.ver) {
                    ver.num = ver.num + key[param];
                }
            });
        });
        vers.sort(function(a, b) {
            return b.num - a.num;
        });
        var times = vers.length < 10 ? vers.length : 10;
        for(var i = 0; i < times; i++) {
            lines.push({
                name : vers[i].name + '版本',
                type : 'line',
                key:vers[i].name
            });
        }
        dates.forEach(function(date){
            var ret = {};
            for(var i=0;i<source.length;i++){
                for(var n = 0; n < lines.length; n++) {
                    if(source[i].ver === lines[n].key && source[i].date === date){
                        ret[source[i].ver] = source[i][param];
                    }
                }
            }
            for(var j=0;j<lines.length;j++) {
                var ver = lines[j].key;
                if(!ret.hasOwnProperty(ver)){
                    ret[ver] = 0;
                }
            }
            ret.date = date;
            newdata.push(ret);
        });
        newdata.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        data.data = newdata;
        data.lines = lines;
        data.rows = ["date"].concat(types.ver);
        data.cols = [
            {
                caption : '时间',
                type : 'string',
                beforeCellWrite : function(row, cellData){
                    return moment(cellData).format('YYYY-MM-DD HH:mm');
                },
                width : 20
            }
        ].concat(types.ver.map(function(ver){
                return {
                    caption:ver,
                    type:"number"
                };
            }));
        return data;
    }
};