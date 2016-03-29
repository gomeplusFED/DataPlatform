/**
 * @author yanglei
 * @date 20151215
 * @fileoverview 检查合法性
 */
var validator = require('validator');

validator.extend('hasParams', function(params){
    params = JSON.parse(params);
    if(!params.type) return false;
    if(!params.ver) return false;
    if(!params.channel) return false;
    if(!params.day_type) return false;
    if(!params.startTime || !params.endTime) return false;
    return true;
});

validator.extend('isDayType', function(day_type){
    var types = ['d', 'm', 'w'];
    for(var i = 0; i < types.length; i++) {
        if(types[i] === day_type) return true;
    }
    return false;
});

module.exports = validator;