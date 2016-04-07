var path = require('path');
var config = require('./config.json');

exports.unique = function(data) {
    data = data || [];
    var a = {},
        i = 0,
        len = data.length;
    for (; i < len; i++) {
        var v = data[i];
        if ('undefined' === typeof(a[v])) {
            a[v] = 1;
        }
    }
    data.length = 0;
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            data.push(i);
        }
    }
    return data;
};

exports.checkFilePath = function(filepath, typelist, src) {
    var param = filepath.match(/(^.+\?\?)|(.+$)/gi);
    if (param) {
        var types = new RegExp("[^\,]+\.(" + typelist + ")(?=$|[\,|\?])", "gi");
        if (param[0]) {
            var matched = path.normalize(param[0]).match(types);
            if (matched) {
                matched = exports.unique(matched);
                var extension = matched.map(function(element) {
                    var typeReg = new RegExp("(\)(" + typelist + ")");
                    return element.match(typeReg)[2];
                });
                if (exports.unique(extension).length === 1) {
                    var root = param[0].slice(0, -2);
                    var files = matched.map(function(element) {
                            var t = element.indexOf('?');
                            element = (t !== -1) ? element.slice(0, t) : element;
                            return path.join(src + element);
                        });
                    return files;
                }
            }
        }
    }
    return null;
};

exports.decode = function(province_code, city_code) {
    var area = config.area,
        province = '',
        city = '';
    for(var i = 0; i < area.length; i++) {
        if(area[i].province_code === province_code) {
            province = area[i].province;
            for(var n = 0; n < area[i].cities.length; n++) {
                if(area[i].cities[n].city_code === city_code) {
                    city = area[i].cities[n].city;
                }
            }
        }
    }
    return {
        province : province,
        city : city
    };
};

exports.encode = function(province, city) {
    var area = config.area,
        province_code = '',
        city_code = '';
    for(var i = 0; i < area.length; i++) {
        if(area[i].province === province) {
            province_code = area[i].province_code;
            for(var n = 0; n < area[i].cities.length; n++) {
                if(area[i].cities[n].city === city) {
                    city_code = area[i].cities[n].city_code;
                }
            }
        }
    }
    return {
        province_code : province_code,
        city_code :city_code
    };
};

exports.mixin= function(source,target){
    for(var i in target){
        if(target.hasOwnProperty(i)){
            source[i] = target[i];
        }
    }
    return source;
};

exports.noop = function(){};

/*更新session*/
exports.updateSession = function(req,obj){
    var session = req.session;
    if(session){
        for(var k in obj){
            if(obj.hasOwnProperty(k)){
                if(k in session){
                    session[k] = obj[k];
                }
            }
        }
    }
};

exports.uniq = function(dates){
    var result = [],
        hash = {};
    for(var key of dates) {
        if(!hash[key]) {
            result.push(key);
            hash[key] = true;
        }
    }
    return result;
};

exports.toTable = function(data, rows, cols) {
    var newData = [];
    for(var i = 0; i < data.length; i++) {
        newData.push({
            data : data[i],
            rows : rows[i],
            cols : cols[i]
        });
    }
    return newData;
};

exports.sort = function(array, first, second) {
    for(var i = 0;i < array.length; i++) {
        var j = i,
            key = array[i];
        while(--j > -1) {
            if (array[j][first] < key[first]) {
                array[j + 1] = array[j];
            } else if(array[j][first] === key[first]) {
                if (array[j][second] < key[second]) {
                    array[j + 1] = array[j];
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        array[j + 1] = key;
    }
    return array;
};

exports.toFixed = function(one, two) {
    return (one / (two === 0 ? 1 : two) * 1000).toFixed(1) / 10 + "%";
};