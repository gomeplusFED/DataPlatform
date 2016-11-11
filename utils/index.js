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

exports.toTable = function(data, rows, cols, count) {
    var newData = [];
    for(var i = 0; i < data.length; i++) {
        var obj = {
            data : data[i],
            rows : rows[i],
            cols : cols[i]
        };
        if(count && count instanceof Array) {
            if(count[i]) {
                obj.count = count[i];
            }
        } else if(count) {
            if(count.count) {
                obj.count = count.count[i];
            }
            if(count.config) {
                obj.config = count.config[i];
            }
        }
        newData.push(obj);
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
    return (one / (Math.ceil(two) === 0 ? 1 : two) * 100).toFixed(2) + "%";
};

exports.percentage = function(one, two) {
    return (one ? one : 0 / (two === 0 ? 1 : two) * 100).toFixed(2);
};

exports.toRound = function(one, two) {
    return Math.round(one / (two === 0 ? 1 : two) * 100);
};

exports.division = function(one, two) {
    return (one / (Math.ceil(two) === 0 ? 1 : two)).toFixed(2);
};

exports.round = function(one, two) {
    return Math.round((one / (two === 0 ? 1 : two)));
};

exports.contrast = function(one, two) {
    return (one - two) / (two === 0 ? 1 : two);
};

exports.ceil = function(one, two) {
    return Math.ceil((one / (two === 0 ? 1 : two)));
};

exports.getDate = function(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};


/*numberLeave("234.567789" , 3) // 234.567*/
exports.numberLeave = function(number , num){
    if(typeof number != "number"){
        console.error("must be a number");
        return 0;
    }
    if(!number) return 0;

    let a = 1;
    let i = 0;
    while(i<num){
        a *= 10;
        i++;
    }
    number = parseInt(number*a);
    return number/a;
}

exports.times = function(startTime, endTime, day_type) {
    var start = new Date(startTime).getTime(),
        end = new Date(endTime).getTime(),
        year = new Date(start).getFullYear(),
        month = new Date(start).getMonth() + 1,
        array = [];
    while(start <= end) {
        if(day_type === '1') {
            array.push(exports.getDate(new Date(start)));
            start = start + 24 * 60 * 60 * 1000;
        } else if(day_type === '2') {
            if(new Date(start).getDay() === 0) {
                array.push(exports.getDate(new Date(start)));
                start = start + 7 * 24 * 60 * 60 * 1000;
            } else {
                start = start + 24 * 60 * 60 * 1000;
            }
        } else if(day_type === '3') {
            if(new Date(start).getDate() ===
                new Date(new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000).getDate()) {
                month++;
                array.push(exports.getDate(new Date(start)));
                start = new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000;
            } else {
                start = new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000;
            }
        }
    }
    return array;
};

exports.getClientIp = function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.date = function(date, day_type) {
    var startTime = "";

    if(day_type === "1") {
        startTime = new Date(
            exports.getDate(
                new Date(
                    new Date(date) - 24 * 60 * 60 * 1000
                )
            ) + " 00:00:00"
        )
    } else if(day_type === "2") {
        startTime = new Date(
            exports.getDate(
                new Date(
                    new Date(date) - 7 * 24 * 60 * 60 * 1000
                )
            ) + " 00:00:00"
        )
    } else {
        var start = new Date(date),
            year = new Date(start).getFullYear(),
            month = new Date(start).getMonth();
        startTime = new Date(new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000);
    }

    return startTime;
};

exports.mergeCell = function(data, rows) {
    var _array = [];
    var merge = [];
    for(var i = 0; i < rows.length; i++) {
        var col = 0;
        for(var j = 0; j < data.length; j++) {
            if(i === 0) {
                if(j !== 0 &&
                    data[j][rows[i]] !== data[j -1][rows[i]]) {
                    _array.push({
                        col : i,
                        row : col,
                        end : {
                            col : i,
                            row : j - col
                        }
                    });
                    col = j;
                } else if(j === data.length - 1) {
                    _array.push({
                        col : i,
                        row : col,
                        end : {
                            col : i,
                            row : j - col + 1
                        }
                    });
                }
            } else {
                if(j !== 0) {
                    if(data[j][rows[i - 1]] === data[j - 1][rows[i - 1]]) {
                        if(data[j][rows[i]] !== data[j - 1][rows[i]]) {
                            _array.push({
                                col : i,
                                row : col,
                                end : {
                                    col : i,
                                    row : j  - col
                                }
                            });
                            col = j;
                        } else if(j === data.length - 1) {
                            _array.push({
                                col : i,
                                row : col,
                                end : {
                                    col : i,
                                    row : j - col + 1
                                }
                            });
                        }
                    } else {
                        _array.push({
                            col : i,
                            row : col,
                            end : {
                                col : i,
                                row : j - col
                            }
                        });
                        col = j;
                    }
                } else if(j === data.length - 1){
                    _array.push({
                        col : i,
                        row : col,
                        end : {
                            col : i,
                            row : j - col + 1
                        }
                    });
                }
            }
        }
    }
    for(var key of _array) {
        if(key.end.row !== 1 || 1 !== key.end.col) {
            merge.push(key);
        }
    }
    return merge;
};


exports.isEmptyObject = function(obj){
    for(var n in obj){ return false }
    return true;
}


/*
 * 功能描述：给定一个日期，获取前几日／前几周／前几月的日期
 * 参数 ：date , 给定的日期
 *       num  , 要获取几个，包含date ,默认只包含1天
 *       type , 日 1，周 2， 月 3，  默认1  
 * 备注：月份只会返回获得月的最后一天 
 * beforeDate("2016-2-2" , 5 , 3)
 [  '2016-2-29',
    '2016-1-31',
    '2015-12-31',
    '2015-11-30',
    '2015-10-31' 
]
*/

exports.beforeDate = function( date , num , type ){
    var type = type/1 || 1,
        num  = num || 1,
        thisDate = new Date(date),
        arr = [];    //返回的数组
    //date是必须的
    if(!date) return false;

    var Units;

    switch(type){
        case 1:
            Units = 1000*60*60*24;
            break;
        case 2:
            Units = 1000*60*60*24*7;
            break;
        case 3:
            break;
    }

    for(var i=0;i<num;i++){
        var aDate;
        if(Units){
            //日，周
            aDate = new Date(thisDate.getTime() - i*Units);
            aDate = aDate.getFullYear() + "-" + (aDate.getMonth()+1) + "-" + aDate.getDate();
        }else{
            //月
            var year = thisDate.getFullYear();
            var month = thisDate.getMonth() + 1 - i;
            if(month <= 0){
                month += 12;
                year--;
            }
            var mDate = new Date(year , month , 0);
            aDate = year + "-" + month + "-" + mDate.getDate();
        }
        arr.push(aDate);
    }

    return arr;
}

/* 调换数组顺序 */
exports.ArraySort = function(arr){
    if(arr instanceof Array && arr.length > 1){
        let len = arr.length,
            arr2= [];

        for(let i=0;i<len;i++){
            arr2.unshift(arr[i]);
        }
        return arr2;
    }else{
        return arr;
    }
}


/* 商品价目对照表 */
exports.prizeRange = {
    '0': '0~10元',
    '1': '10~20元',
    '2': '20~30元',
    '3': '30~40元',
    '4': '40~50元',
    '5': '50~60元',
    '6': '60~70元',
    '7': '70~80元',
    '8': '80~90元',
    '9': '90~100元',
    '10': '100+元',

    '11': '0~10元',
    '12': '10~20元',
    '13': '20~30元',
    '14': '30~50元',
    '15': '50~100元',
    '16': '100~200元',
    '17': '200~300元',
    '18': '300~500元',
    '19': '500~800元',
    '20': '800~1000元',
    '21': '1000+元',

    '22': '0~100元',
    '23': '100~200元',
    '24': '200~300元',
    '25': '300~500元',
    '26': '500~1000元',
    '27': '1000~2000元',
    '28': '2000~3000元',
    '29': '3000~5000元',
    '30': '5000~7000元',
    '31': '7000~10000元',
    '32': '10000+元',


    '33': '0~20元',
    '34': '20~50元',
    '35': '50~100元',
    '36': '100~300元',
    '37': '300~500元',
    '38': '500~1000元',
    '39': '1000~2000元',
    '40': '2000~3000元',
    '41': '3000~5000元',
    '42': '5000~10000元',
    '43': '10000+元'
};

