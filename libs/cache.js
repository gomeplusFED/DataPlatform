/**
 * @author yanglei
 * @fileoverview cache data
 * @date 20151218
 */


var NodeCache = require('node-cache');
var myCache = new NodeCache();

module.exports = {
    //查询缓存数据
    cacheGet: function(key, cb) {
        myCache.get(key, function(err, value) {
            if (!err) {
                cb(null, value);
            } else {
                cb(err);
            }
        });
    },
    //设置缓存数据
    cacheSet: function(key, value, ttl, cb) {
        myCache.set(key, value, ttl, function(err, success) {
            if (!err && success) {
                cb(null, success);
            } else {
                cb(err);
            }
        });
    }
};