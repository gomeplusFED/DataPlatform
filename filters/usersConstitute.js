/**
 * @author yanglei
 * @date 20160223
 * @fileoverview 用户构成
 */


module.exports = function(data, array) {
    var newdata = [];
    var source = data.data;
    //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
    var obj = {};
    var total = 0;
    var Xdata = [];
    var once = true;
    for(var key of array) {
        obj.num = 0;
        obj.rate = 0;
        obj.date = '';
        Xdata.push(key);
        for(var k of source) {
            if(once) {
                total = total + k.num;
            }
            if(key === k.distribution) {
                obj.date = k.date;
                obj.num = obj.num + k.num;
            }
        }
        once = false;
        obj.rate = Math.round(obj.num / ( total === 0 ? 1 : total ) * 100);
        obj.num_rate = obj.rate + '%';
        newdata.push({
            distribution : key,
            num : obj.num,
            rate : obj.rate,
            num_rate : obj.num_rate,
            date : obj.date
        });
    }
    data.data = newdata;
    data.Xdata = Xdata;
    return data;
};